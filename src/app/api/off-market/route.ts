import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createHubspotContact } from '@/lib/hubspot';
import { getPhase4BackendBaseUrl, isLocalFileSandbox, recordLocalServerOutboundEvent, upsertSandboxOffMarketApplication } from '@/lib/localSandbox';
import {
    buildOffMarketEmails,
    generateProductionRefCode,
    normalizeLang,
    resolveExecutionPolicy,
} from '@/lib/formEmails';
import { evaluateFormAntispam } from '@/lib/formSecurity';

export const dynamic = 'force-dynamic';

let _resendClient: Resend | null = null;
function getResend(): Resend {
    if (!_resendClient) {
        _resendClient = new Resend(process.env.RESEND_API_KEY);
    }
    return _resendClient;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const name = String(body.fullName || body.name || '').trim();
        const company = String(body.companyName || body.company || '').trim();
        const email = String(body.email || '').trim();
        const phone = String(body.phone || '').trim();
        const tab: 'oportunidad' | 'hoteles' = body.activeTab === 'hoteles' ? 'hoteles' : 'oportunidad';
        const budget = String(body.budget || '').trim();
        const regions = Array.isArray(body.regions) ? body.regions.map(String) : [];
        const details = body.details && typeof body.details === 'object' ? body.details : {};
        const freeText = String(body.freeText || body.notes || '').trim();
        const compiledMessage = String(body.compiledMessage || '').trim();
        const lang = normalizeLang(body.lang, 'es');
        const idempotencyKey = String(body.idempotency_key || request.headers.get('x-idempotency-key') || '').trim();
        const simulateEmailFailure = Boolean(
            body.simulate_email_failure || request.headers.get('x-simulate-email-failure') === '1'
        );

        if (!name || !email || !phone || !budget) {
            const errMsg =
                lang === 'en'
                    ? 'Please fill in all required fields.'
                    : lang === 'fr'
                    ? 'Veuillez remplir tous les champs obligatoires.'
                    : 'Por favor complete todos los campos requeridos.';
            return NextResponse.json({ success: false, message: errMsg }, { status: 400 });
        }

        const antispam = evaluateFormAntispam({
            email,
            honeypot: body.website_url,
            formLoadedAt: body.form_loaded_at,
            lang,
            sourceLabel: 'OffMarketAPI',
        });
        if (antispam.action === 'silent_drop') {
            console.warn(antispam.logMessage);
            return NextResponse.json(
                {
                    success: true,
                    reference_code: '',
                    message: 'Off-Market application sent successfully!',
                },
                { status: 201 }
            );
        }
        if (antispam.action === 'reject') {
            console.warn(antispam.logMessage);
            return NextResponse.json({ success: false, message: antispam.errorMessage }, { status: 400 });
        }

        if (isLocalFileSandbox()) {
            // 1. Ingest idempotently into isolated local CRM V2 M04 LeadInquiry (zero real emails, zero HubSpot)
            let crmIngest: {
                created?: boolean;
                deduplicated?: boolean;
                notification_sent?: boolean;
                inquiry?: { id?: number; inquiry_code?: string };
            } | null = null;
            const localBackendBase = getPhase4BackendBaseUrl();
            const localApiKey = String(process.env.NEXT_PUBLIC_API_KEY || process.env.API_SHARED_SECRET || '').trim();
            if (
                localBackendBase &&
                (localBackendBase.startsWith('http://127.0.0.1:') || localBackendBase.startsWith('http://localhost:')) &&
                localApiKey
            ) {
                try {
                    const ingestRes = await fetch(`${localBackendBase}/api/crm-v2/lead-inquiries/ingest/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-API-KEY': localApiKey,
                            ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
                        },
                        body: JSON.stringify({
                            name,
                            email,
                            phone,
                            message: compiledMessage || freeText || `Requerimiento Off-Market (${tab})`,
                            subject: `Off-Market (${tab === 'hoteles' ? 'Hoteles y Resorts' : 'Propiedades de Oportunidad'}) · ${budget}`,
                            lang,
                            channel: 'off_market',
                            origin_label: 'Búsqueda Privada Off-Market',
                            company_code: 'PCI-RE',
                            source_page: `/${lang}/investments/off-market`,
                            idempotency_key: idempotencyKey || undefined,
                            metadata: {
                                company_name: company,
                                active_tab: tab,
                                budget,
                                regions,
                                details,
                                free_text: freeText,
                            },
                        }),
                        cache: 'no-store',
                    });
                    if (ingestRes.ok) {
                        crmIngest = await ingestRes.json();
                    } else {
                        console.warn('Local M04 Off-Market ingest non-OK:', ingestRes.status);
                    }
                    recordLocalServerOutboundEvent({
                        flow: 'off_market',
                        provider: 'local_crm_v2',
                        target_url: `${localBackendBase}/api/crm-v2/lead-inquiries/ingest/`,
                        method: 'POST',
                        blocked: false,
                        simulated: false,
                        status_code: ingestRes.status,
                        crm_inquiry_code: crmIngest?.inquiry?.inquiry_code || '',
                        reason: 'LOCAL_M04_INGEST',
                    });
                } catch (ingestErr) {
                    console.warn('Local M04 Off-Market ingest skipped:', ingestErr);
                }
            }

            recordLocalServerOutboundEvent({
                flow: 'off_market',
                provider: 'hubspot',
                target_url: 'https://api.hubapi.com/crm/v3/objects/contacts',
                method: 'POST',
                blocked: true,
                simulated: false,
                status_code: 0,
                crm_inquiry_code: crmIngest?.inquiry?.inquiry_code || '',
                reason: 'HUBSPOT_DISABLED_LOCAL',
            });
            recordLocalServerOutboundEvent({
                flow: 'off_market',
                provider: 'resend',
                target_url: 'https://api.resend.com/emails',
                method: 'POST',
                blocked: true,
                simulated: true,
                status_code: 0,
                crm_inquiry_code: crmIngest?.inquiry?.inquiry_code || '',
                reason: 'RESEND_SIMULATED_LOCAL_OUTBOX',
            });

            const saved = upsertSandboxOffMarketApplication({
                name,
                company,
                email,
                phone,
                tab,
                budget,
                regions,
                details,
                freeText,
                compiledMessage,
                lang,
                idempotency_key: idempotencyKey,
                simulate_email_failure: simulateEmailFailure,
            });
            if (!saved) {
                return NextResponse.json({ success: false, message: 'Local sandbox storage unavailable.' }, { status: 500 });
            }

            const effectiveRef = crmIngest?.inquiry?.inquiry_code || saved.reference_code;
            const emailFailed = saved.email_status === 'failed_simulated';
            const message = emailFailed
                ? lang === 'en'
                    ? `Your Off-Market request was safely registered under reference ${effectiveRef}. However, we could not send the confirmation email at this moment (simulated provider failure); our private investment committee already has your dossier.`
                    : lang === 'fr'
                    ? `Votre demande Off-Market a bien été enregistrée sous la référence ${effectiveRef}. Toutefois, l'e-mail de confirmation n'a pas pu être envoyé pour le moment (panne simulée) ; notre comité d'investissement dispose déjà de votre dossier.`
                    : `Tu requerimiento Off-Market quedó guardado en el registro local bajo el código ${effectiveRef}. Sin embargo, el correo de confirmación no pudo enviarse en este momento (fallo de correo simulado); nuestro comité privado ya recibió tu solicitud.`
                : lang === 'en'
                ? `Your Off-Market request has been registered locally in M04 CRM under reference ${effectiveRef} (isolated local mode: no real email dispatched).`
                : lang === 'fr'
                ? `Votre demande Off-Market a été enregistrée localement dans le CRM M04 sous la référence ${effectiveRef} (mode local isolé : aucun e-mail réel envoyé).`
                : `Tu requerimiento Off-Market quedó registrado en M04 Leads bajo ${effectiveRef} (Ref. web: ${saved.reference_code}, sin envío real de correo).`;

            return NextResponse.json(
                {
                    success: true,
                    sandbox_isolated: true,
                    id: saved.id,
                    reference_code: effectiveRef,
                    web_reference_code: saved.reference_code,
                    crm_inquiry_id: crmIngest?.inquiry?.id || null,
                    crm_inquiry_code: crmIngest?.inquiry?.inquiry_code || null,
                    deduplicated: Boolean(crmIngest?.deduplicated || saved.deduplicated),
                    email_sent: false,
                    email_failed: emailFailed,
                    email_status: saved.email_status,
                    email_error: saved.email_error,
                    message,
                },
                { status: (crmIngest?.deduplicated || saved.deduplicated) ? 200 : 201 }
            );
        }

        // Fail-closed Preview guard: stops BEFORE any Railway, HubSpot, or Resend call
        const policy = resolveExecutionPolicy(email);
        if (!policy.allowed) {
            console.error(`[FormEmails:${policy.code}] ${policy.error}`);
            return NextResponse.json({ success: false, message: policy.error }, { status: 403 });
        }

        // Production / Preview path
        const referenceCode = generateProductionRefCode('OM');
        const built = buildOffMarketEmails({
            referenceCode,
            lang,
            name,
            company,
            email: policy.clientRecipient,
            phone,
            tab,
            budget,
            regions,
            details,
            freeText,
        });

        if (policy.railwayMode === 'simulated') {
            console.log(`[PREVIEW-SIMULATED] Railway /api/public/leads/ skipped [${referenceCode}]`);
        } else if (policy.railwayApiUrl) {
            const leadRes = await fetch(`${policy.railwayApiUrl}/api/public/leads/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: name.split(' ')[0],
                    last_name: name.split(' ').slice(1).join(' ') || '.',
                    email,
                    phone,
                    message: built.adminEmail.text,
                    source: 'Website Off-Market Form',
                    interest: `Off-Market (${tab === 'hoteles' ? 'Hoteles y Resorts' : 'Oportunidades'}) [${referenceCode}]`,
                }),
            });

            if (!leadRes.ok) {
                const errText = await leadRes.text();
                console.error('Off-Market Backend Lead Error:', leadRes.status, errText);
                return NextResponse.json(
                    { success: false, message: `Error de conexión con el servidor principal (${leadRes.status}).` },
                    { status: 502 }
                );
            }
        }

        if (policy.hubspotMode === 'simulated') {
            console.log(`[PREVIEW-SIMULATED] HubSpot contact sync skipped [${referenceCode}]`);
        } else {
            try {
                await createHubspotContact({
                    email,
                    firstname: name.split(' ')[0],
                    lastname: name.split(' ').slice(1).join(' '),
                    phone,
                    message: built.adminEmail.text,
                    budget: built.budgetEs,
                    form_source: 'Website Off-Market Form',
                });
            } catch (hsErr) {
                console.error('HubSpot sync failed in Off-Market API:', hsErr);
            }
        }

        if (policy.mode !== 'local_dry_run') {
            try {
                const clientRes = await getResend().emails.send({
                    from: built.clientEmail.from,
                    to: [policy.clientRecipient],
                    subject: built.clientEmail.subject,
                    html: built.clientEmail.html,
                    text: built.clientEmail.text,
                });
                if (clientRes.error) console.error('Resend Error (Off-Market Client):', clientRes.error);
            } catch (err) {
                console.error('Off-Market Client Autoresponder Exception:', err);
            }

            try {
                const adminRes = await getResend().emails.send({
                    from: built.adminEmail.from,
                    to: policy.teamRecipients,
                    subject: built.adminEmail.subject,
                    html: built.adminEmail.html,
                    text: built.adminEmail.text,
                });
                if (adminRes.error) console.error('Resend Error (Off-Market Admin):', adminRes.error);
            } catch (err) {
                console.error('Off-Market Admin Email Exception:', err);
            }
        }

        return NextResponse.json(
            {
                success: true,
                reference_code: referenceCode,
                message: 'Off-Market application sent successfully!',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Off-Market API Error:', error);
        return NextResponse.json(
            { success: false, message: 'Error interno al procesar la solicitud Off-Market.' },
            { status: 500 }
        );
    }
}
