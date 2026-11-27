import { NextResponse } from 'next/server';
import {
    attachM04LinkToInboxEntry,
    dispatchCloudStagingStage2Emails,
    getPhase4BackendBaseUrl,
    getServerStagingApiKey,
    isCrmV2RealEmailDeliveryMode,
    isCrmV2RemoteBackend,
    isLocalFileSandbox,
    recordLocalServerOutboundEvent,
    upsertSandboxFounderLead,
} from '@/lib/localSandbox';
import { PCI_CLIENT_FROM, PCI_TEAM_FROM, resolveExecutionPolicy } from '@/lib/formEmails';
import { submitFounderForm } from '@/app/actions/founder';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const contentType = request.headers.get('content-type') || '';
        let name = '';
        let email = '';
        let phone = '';
        let modality = 'unidades';
        let message = '';
        let lang = 'es';
        let projectSlug = 'miches-eco-resort';
        let idempotencyKey = '';

        if (contentType.includes('application/json')) {
            const body = await request.json();
            name = String(body.name || '').trim();
            email = String(body.email || '').trim();
            phone = String(body.phone || '').trim();
            modality = String(body.modality || 'unidades').trim();
            message = String(body.message || '').trim();
            lang = String(body.lang || 'es').trim().toLowerCase();
            projectSlug = String(body.project_slug || 'miches-eco-resort').trim();
            idempotencyKey = String(body.idempotency_key || request.headers.get('x-idempotency-key') || '').trim();
        } else {
            const fd = await request.formData();
            name = String(fd.get('name') || '').trim();
            email = String(fd.get('email') || '').trim();
            phone = String(fd.get('phone') || '').trim();
            modality = String(fd.get('modality') || 'unidades').trim();
            message = String(fd.get('message') || '').trim();
            lang = String(fd.get('lang') || 'es').trim().toLowerCase();
            projectSlug = String(fd.get('project_slug') || 'miches-eco-resort').trim();
            idempotencyKey = String(fd.get('idempotency_key') || request.headers.get('x-idempotency-key') || '').trim();
        }

        if (!name || !email || !phone || !modality) {
            const errMsg =
                lang === 'en'
                    ? 'Please fill in all required fields.'
                    : lang === 'fr'
                    ? 'Veuillez remplir tous les champs obligatoires.'
                    : 'Por favor complete todos los campos requeridos.';
            return NextResponse.json({ success: false, message: errMsg }, { status: 400 });
        }

        if (isLocalFileSandbox()) {
            const saved = upsertSandboxFounderLead({
                name,
                email,
                phone,
                modality,
                message,
                lang,
                project_slug: projectSlug,
                idempotency_key: idempotencyKey,
            });
            if (!saved) {
                return NextResponse.json({ success: false, message: 'Local sandbox storage unavailable.' }, { status: 500 });
            }

            // Bridge idempotently to local CRM V2 M04 LeadInquiry (same Client, same Case on both screens, 1 aviso on retry)
            let crmInquiryId: number | null = saved.crm_inquiry_id || null;
            let crmInquiryCode = saved.crm_inquiry_code || '';
            let crmClientId: number | null = null;
            const localBackendBase = getPhase4BackendBaseUrl();
            const localApiKey = String(process.env.API_SHARED_SECRET || process.env.DASHBOARD_AUTH_API_KEY || '').trim();
            if (
                localBackendBase &&
                (localBackendBase.startsWith('http://127.0.0.1:') || localBackendBase.startsWith('http://localhost:')) &&
                localApiKey
            ) {
                try {
                    const modLabel = modality === 'capital' ? 'Socio de Capital' : 'Inversor de Unidades';
                    const ingestRes = await fetch(`${localBackendBase}/api/crm-v2/lead-inquiries/ingest/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-API-KEY': localApiKey,
                            'Idempotency-Key': `fnd::${saved.sequence_number}`,
                        },
                        body: JSON.stringify({
                            name,
                            email,
                            phone,
                            lang,
                            channel: 'founder_lista_cero',
                            origin_label: 'Lista Cero · Futuros Proyectos',
                            subject: `Lista Cero (${saved.sequence_number}) · ${projectSlug} · ${modLabel}`,
                            message: [
                                `[Lista Cero / Inversor Fundador · Ref: ${saved.sequence_number}]`,
                                `Proyecto: ${projectSlug}`,
                                `Modalidad: ${modLabel}`,
                                `Comentarios: ${message || 'Sin comentarios adicionales.'}`,
                            ].join('\n'),
                            reference_code: saved.sequence_number,
                            idempotency_key: `fnd::${saved.sequence_number}`,
                            source_page: `/${lang}/futuros-proyectos`,
                            metadata: {
                                founder_reference_code: saved.sequence_number,
                                web_reference_code: saved.sequence_number,
                                project_slug: projectSlug,
                                modality,
                                inbox_entry_id: saved.id,
                            },
                        }),
                    });
                    const ingestJson = await ingestRes.json().catch(() => ({}));
                    if (ingestRes.ok && ingestJson?.inquiry?.id) {
                        crmInquiryId = Number(ingestJson.inquiry.id);
                        crmInquiryCode = String(ingestJson.inquiry.inquiry_code || '');
                        crmClientId = ingestJson.inquiry?.client?.id ? Number(ingestJson.inquiry.client.id) : null;
                        attachM04LinkToInboxEntry(saved.id, {
                            crm_inquiry_id: crmInquiryId,
                            crm_inquiry_code: crmInquiryCode,
                            crm_client_id: crmClientId,
                        });
                    }
                    recordLocalServerOutboundEvent({
                        flow: 'founder_lista_cero',
                        provider: 'crm_v2_local',
                        target_url: `${localBackendBase}/api/crm-v2/lead-inquiries/ingest/`,
                        method: 'POST',
                        blocked: false,
                        simulated: false,
                        status_code: ingestRes.status,
                        reference_code: saved.sequence_number,
                        crm_inquiry_code: crmInquiryCode,
                        reason: ingestJson?.deduplicated ? 'LOCAL_M04_DEDUPLICATED' : 'LOCAL_M04_INGEST',
                    });
                } catch (err) {
                    console.warn('Local M04 founder bridge skipped:', err);
                }
            }

            if (!saved.deduplicated) {
                recordLocalServerOutboundEvent({
                    flow: 'founder_lista_cero',
                    provider: 'hubspot',
                    target_url: 'https://api.hubapi.com/crm/v3/objects/contacts',
                    method: 'POST',
                    blocked: true,
                    simulated: false,
                    status_code: 0,
                    reference_code: saved.sequence_number,
                    crm_inquiry_code: crmInquiryCode,
                    reason: 'HUBSPOT_DISABLED_LOCAL',
                });
                recordLocalServerOutboundEvent({
                    flow: 'founder_lista_cero',
                    provider: 'resend',
                    target_url: 'https://api.resend.com/emails',
                    method: 'POST',
                    blocked: true,
                    simulated: true,
                    status_code: 0,
                    reference_code: saved.sequence_number,
                    crm_inquiry_code: crmInquiryCode,
                    reason: 'RESEND_SIMULATED_LOCAL_OUTBOX',
                });
            }

            const confirmMsg = saved.deduplicated
                ? lang === 'en'
                    ? `Your Zero List registration was already confirmed under reference ${saved.sequence_number} (no duplicate created).`
                    : lang === 'fr'
                    ? `Votre inscription à la Liste Zéro était déjà confirmée sous la référence ${saved.sequence_number} (aucun doublon créé).`
                    : `Tu solicitud en Lista Cero ya estaba registrada bajo la referencia ${saved.sequence_number} (sin duplicar tu registro).`
                : lang === 'en'
                ? `Your Zero List registration was saved locally under reference ${saved.sequence_number} (local test mode: no real email sent).`
                : lang === 'fr'
                ? `Votre inscription à la Liste Zéro a été enregistrée localement sous la référence ${saved.sequence_number} (mode local : aucun e-mail réel envoyé).`
                : `Tu solicitud en Lista Cero quedó registrada en local bajo la referencia ${saved.sequence_number} (modo local aislado: sin enviar correos reales).`;

            return NextResponse.json(
                {
                    success: true,
                    sandbox_isolated: true,
                    email_sent: false,
                    deduplicated: saved.deduplicated,
                    duplicate_attempts_blocked: saved.duplicate_attempts_blocked,
                    sequence_number: saved.sequence_number,
                    crm_inquiry_id: crmInquiryId,
                    crm_inquiry_code: crmInquiryCode,
                    merged_historical_codes: saved.merged_historical_codes,
                    previous_reused_code: saved.previous_reused_code || null,
                    id: saved.id,
                    message: confirmMsg,
                },
                { status: saved.deduplicated ? 200 : 201 }
            );
        }

        if (isCrmV2RemoteBackend()) {
            const isStage2Real = isCrmV2RealEmailDeliveryMode();
            let stage2Policy: ReturnType<typeof resolveExecutionPolicy> | null = null;
            if (isStage2Real) {
                stage2Policy = resolveExecutionPolicy(email);
                if (!stage2Policy.allowed) {
                    console.error(`[Stage2 Founder Fail-Closed:${stage2Policy.code}] ${stage2Policy.error}`);
                    return NextResponse.json(
                        { success: false, code: stage2Policy.code, message: stage2Policy.error },
                        { status: 403 }
                    );
                }
            }
            const backendBase = getPhase4BackendBaseUrl();
            const apiKey = getServerStagingApiKey();
            const resp = await fetch(`${backendBase}/api/phase7-sandbox/founder-leads/submit/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': apiKey,
                },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    modality,
                    message,
                    lang,
                    project_slug: projectSlug,
                    idempotency_key: idempotencyKey,
                }),
                cache: 'no-store',
            });
            const json = await resp.json().catch(() => ({}));
            if (!resp.ok || !json.success) {
                return NextResponse.json(
                    { success: false, message: json.error || 'No se pudo registrar la solicitud en Staging.' },
                    { status: resp.status || 500 }
                );
            }
            const seq = String(json.sequence_number || 'FND-STG-001');
            const dedup = Boolean(json.deduplicated);
            if (isStage2Real && stage2Policy && stage2Policy.allowed) {
                let clientEmailAccepted = false;
                let resendIds: { admin?: string; client?: string } = {};
                if (!dedup) {
                    const firstName = name.split(' ')[0] || 'Inversor';
                    const modLabel = modality === 'capital' ? 'Socio de Capital' : 'Inversor de Unidades';
                    const clientSubject =
                        lang === 'en'
                            ? `[${seq}] VIP Zero List Request Received - Punta Cana Investments`
                            : lang === 'fr'
                            ? `[${seq}] Demande VIP Liste Zéro Reçue - Punta Cana Investments`
                            : `[${seq}] Solicitud VIP Lista Cero Recibida - Punta Cana Investments`;
                    const clientHtml = `<html><body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#000;color:#fff;max-width:600px;margin:0 auto;padding:0;"><div style="background:#111;padding:32px 20px;text-align:center;border-bottom:2px solid #c9ae5d;"><img src="https://puntacanainvestmentsrd.com/images/logo-email.jpg" alt="Punta Cana Investments" style="max-width:280px;height:auto;"/></div><div style="padding:32px 28px;background:#0a0a0a;"><h2 style="color:#c9ae5d;text-transform:uppercase;text-align:center;">Acceso Lista Cero Confirmado</h2><p style="font-size:15px;color:#e0e0e0;">Estimado/a <strong>${firstName}</strong>,</p><p style="font-size:15px;color:#e0e0e0;line-height:1.6;">Hemos recibido tu solicitud en Lista Cero bajo la referencia <strong>${seq}</strong> (modalidad: <strong>${modLabel}</strong>).</p></div></body></html>`;
                    const adminHtml = `<html><body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#000;color:#fff;max-width:600px;margin:0 auto;padding:0;"><div style="background:#111;padding:28px 20px;text-align:center;border-bottom:2px solid #c9ae5d;"><img src="https://puntacanainvestmentsrd.com/images/logo-email.jpg" alt="Punta Cana Investments" style="max-width:260px;height:auto;"/></div><div style="padding:28px;background:#0a0a0a;"><h2 style="color:#c9ae5d;text-transform:uppercase;text-align:center;">NUEVO LEAD VIP LISTA CERO [${seq}]</h2><p><strong>CRM M04:</strong> ${json.crm_inquiry_code || ''}</p><p><strong>Nombre:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Teléfono:</strong> ${phone}</p><p><strong>Modalidad:</strong> ${modLabel}</p><p><strong>Mensaje:</strong> ${message || 'Sin mensaje'}</p></div></body></html>`;
                    const sent = await dispatchCloudStagingStage2Emails({
                        flow: 'founder_lista_cero',
                        referenceCode: seq,
                        crmInquiryCode: json.crm_inquiry_code || '',
                        lang,
                        teamRecipients: stage2Policy.teamRecipients,
                        clientRecipient: stage2Policy.clientRecipient,
                        adminEmail: {
                            from: PCI_TEAM_FROM,
                            subject: `NUEVO LEAD VIP (Lista Cero): ${name} [${seq}]`,
                            html: adminHtml,
                        },
                        clientEmail: {
                            from: PCI_CLIENT_FROM,
                            subject: clientSubject,
                            html: clientHtml,
                        },
                    });
                    clientEmailAccepted = sent.clientAccepted;
                    resendIds = { admin: sent.adminResendId, client: sent.clientResendId };
                }
                return NextResponse.json(
                    {
                        success: true,
                        sandbox_isolated: false,
                        email_sent: clientEmailAccepted,
                        resend_ids: resendIds,
                        deduplicated: dedup,
                        duplicate_attempts_blocked: Number(json.duplicate_attempts_blocked || 0),
                        sequence_number: seq,
                        crm_inquiry_id: json.crm_inquiry_id || null,
                        crm_inquiry_code: json.crm_inquiry_code || '',
                        id: json.id,
                        message: `Tu solicitud en Lista Cero quedó registrada bajo la referencia ${seq}.`,
                    },
                    { status: dedup ? 200 : 201 }
                );
            }
            const confirmMsg = dedup
                ? lang === 'en'
                    ? `Your Zero List registration was already confirmed under reference ${seq} (no duplicate created).`
                    : lang === 'fr'
                    ? `Votre inscription à la Liste Zéro était déjà confirmée sous la référence ${seq} (aucun doublon créé).`
                    : `Tu solicitud en Lista Cero ya estaba registrada bajo la referencia ${seq} (sin duplicar tu registro).`
                : lang === 'en'
                ? `Your Zero List registration was saved under reference ${seq} (simulated Stage 1 mode: 0 real emails sent).`
                : lang === 'fr'
                ? `Votre inscription à la Liste Zéro a été enregistrée sous la référence ${seq} (mode simulé Étape 1 : 0 e-mail réel envoyé).`
                : `Tu solicitud en Lista Cero quedó registrada bajo la referencia ${seq} (Etapa A simulada: 0 correos externos enviados).`;
            return NextResponse.json(
                {
                    success: true,
                    sandbox_isolated: true,
                    email_sent: false,
                    deduplicated: dedup,
                    duplicate_attempts_blocked: Number(json.duplicate_attempts_blocked || 0),
                    sequence_number: seq,
                    crm_inquiry_id: json.crm_inquiry_id || null,
                    crm_inquiry_code: json.crm_inquiry_code || '',
                    id: json.id,
                    message: confirmMsg,
                },
                { status: dedup ? 200 : 201 }
            );
        }

        const fd = new FormData();
        fd.append('name', name);
        fd.append('email', email);
        fd.append('phone', phone);
        fd.append('modality', modality);
        fd.append('message', message);
        fd.append('lang', lang);
        if (idempotencyKey) fd.append('idempotency_key', idempotencyKey);

        const result = await submitFounderForm({}, fd);
        return NextResponse.json(result, { status: result.success ? 201 : 400 });
    } catch (error) {
        console.error('Founder Leads API Error:', error);
        return NextResponse.json({ success: false, message: 'Error interno al procesar la solicitud.' }, { status: 500 });
    }
}
