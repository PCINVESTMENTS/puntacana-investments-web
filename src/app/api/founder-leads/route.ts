import { NextResponse } from 'next/server';
import {
    attachM04LinkToInboxEntry,
    getPhase4BackendBaseUrl,
    isLocalFileSandbox,
    recordLocalServerOutboundEvent,
    upsertSandboxFounderLead,
} from '@/lib/localSandbox';
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
            const localApiKey = String(process.env.NEXT_PUBLIC_API_KEY || process.env.API_SHARED_SECRET || '').trim();
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
