'use server'

import { Resend } from 'resend';
import { createHubspotContact } from '@/lib/hubspot';
import {
    attachM04LinkToInboxEntry,
    getPhase4BackendBaseUrl,
    isLocalFileSandbox,
    recordLocalServerOutboundEvent,
    upsertSandboxMonitoringRequest,
} from '@/lib/localSandbox';
import {
    normalizeLang,
    PCI_CLIENT_FROM,
    PCI_TEAM_FROM,
    resolveExecutionPolicy,
} from '@/lib/formEmails';
import {
    evaluateFormAntispam,
    extractAntispamFromFormData,
} from '@/lib/formSecurity';

let _resendClient: Resend | null = null;
function getResend(): Resend {
    if (!_resendClient) {
        _resendClient = new Resend(process.env.RESEND_API_KEY);
    }
    return _resendClient;
}

export async function submitMonitoringForm(prevState: any, formData: FormData) {
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const country = String(formData.get('country') || '').trim();
    const project = String(formData.get('project') || '').trim();
    const location = String(formData.get('location') || '').trim();
    const investment = String(formData.get('investment') || '').trim();
    const date = String(formData.get('date') || '').trim();

    const lang = normalizeLang(formData.get('lang'), 'en');

    // Email translations
    const t = {
        en: {
            title: "New Monitoring Plan Request",
            error: "Please fill in all required fields."
        },
        es: {
            title: "Nueva Solicitud de Plan de Monitoreo",
            error: "Por favor complete todos los campos requeridos."
        },
        fr: {
            title: "Nouvelle Demande de Plan de Suivi",
            error: "Veuillez remplir tous les champs obligatoires."
        }
    };

    const dict = t[lang as keyof typeof t] || t.en;

    // Simple validation
    if (!name || !email || !phone) {
        return {
            success: false,
            message: dict.error
        };
    }

    const { honeypot, formLoadedAt } = extractAntispamFromFormData(formData);
    const antispam = evaluateFormAntispam({
        email,
        honeypot,
        formLoadedAt,
        lang,
        sourceLabel: 'MonitoringForm',
    });
    if (antispam.action === 'silent_drop') {
        console.warn(antispam.logMessage);
        return {
            success: true,
            email_sent: false,
            message: 'Message sent successfully!'
        };
    }
    if (antispam.action === 'reject') {
        console.warn(antispam.logMessage);
        return {
            success: false,
            message: antispam.errorMessage
        };
    }

    if (isLocalFileSandbox()) {
        const idempotencyKey = String(formData.get('idempotency_key') || '').trim();
        const savedMon = upsertSandboxMonitoringRequest({
            name,
            email,
            phone,
            country,
            project,
            location,
            investment,
            date,
            lang,
            idempotency_key: idempotencyKey,
        });
        const refCode = savedMon?.reference_code || 'CNT-LOC-001';
        let crmInquiryId: number | null = savedMon?.crm_inquiry_id || null;
        let crmInquiryCode = savedMon?.crm_inquiry_code || '';
        let crmClientId: number | null = null;

        const localBackendBase = getPhase4BackendBaseUrl();
        const localApiKey = String(process.env.API_SHARED_SECRET || process.env.DASHBOARD_AUTH_API_KEY || '').trim();
        if (
            savedMon &&
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
                        'Idempotency-Key': `cnt::${refCode}`,
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        phone,
                        country,
                        lang,
                        budget: investment,
                        channel: 'investment_monitoring',
                        origin_label: 'Plan de Monitoreo de Inversión',
                        subject: `Monitoreo (${refCode}) · ${project || 'Proyecto'} (${location || 'Punta Cana'})`,
                        message: [
                            `[Plan de Monitoreo de Inversión · Ref: ${refCode}]`,
                            `País: ${country || 'N/A'}`,
                            `Proyecto: ${project || 'N/A'}`,
                            `Ubicación: ${location || 'N/A'}`,
                            `Monto Inversión: ${investment || 'N/A'}`,
                            `Fecha Entrega: ${date || 'N/A'}`,
                        ].join('\n'),
                        reference_code: refCode,
                        idempotency_key: `cnt::${refCode}`,
                        source_page: `/${lang}/services/monitoreo-de-inversion`,
                        metadata: {
                            monitoring_reference_code: refCode,
                            web_reference_code: refCode,
                            monitoring_project: project,
                            monitoring_location: location,
                            monitoring_investment: investment,
                            monitoring_delivery_date: date,
                            country,
                            inbox_entry_id: savedMon.id,
                        },
                    }),
                });
                const ingestJson = await ingestRes.json().catch(() => ({}));
                if (ingestRes.ok && ingestJson?.inquiry?.id) {
                    crmInquiryId = Number(ingestJson.inquiry.id);
                    crmInquiryCode = String(ingestJson.inquiry.inquiry_code || '');
                    crmClientId = ingestJson.inquiry?.client?.id ? Number(ingestJson.inquiry.client.id) : null;
                    attachM04LinkToInboxEntry(savedMon.id, {
                        crm_inquiry_id: crmInquiryId,
                        crm_inquiry_code: crmInquiryCode,
                        crm_client_id: crmClientId,
                    });
                }
                recordLocalServerOutboundEvent({
                    flow: 'investment_monitoring',
                    provider: 'crm_v2_local',
                    target_url: `${localBackendBase}/api/crm-v2/lead-inquiries/ingest/`,
                    method: 'POST',
                    blocked: false,
                    simulated: false,
                    status_code: ingestRes.status,
                    reference_code: refCode,
                    crm_inquiry_code: crmInquiryCode,
                    reason: ingestJson?.deduplicated ? 'LOCAL_M04_DEDUPLICATED' : 'LOCAL_M04_INGEST',
                });
            } catch (err) {
                console.warn('Local M04 monitoring bridge skipped:', err);
            }
        }

        if (!savedMon?.deduplicated) {
            recordLocalServerOutboundEvent({
                flow: 'investment_monitoring',
                provider: 'hubspot',
                target_url: 'https://api.hubapi.com/crm/v3/objects/contacts',
                method: 'POST',
                blocked: true,
                simulated: false,
                status_code: 0,
                reference_code: refCode,
                crm_inquiry_code: crmInquiryCode,
                reason: 'HUBSPOT_DISABLED_LOCAL',
            });
            recordLocalServerOutboundEvent({
                flow: 'investment_monitoring',
                provider: 'resend',
                target_url: 'https://api.resend.com/emails',
                method: 'POST',
                blocked: true,
                simulated: true,
                status_code: 0,
                reference_code: refCode,
                crm_inquiry_code: crmInquiryCode,
                reason: 'RESEND_SIMULATED_LOCAL_OUTBOX',
            });
        }
        return {
            success: true,
            sandbox_isolated: true,
            email_sent: false,
            deduplicated: Boolean(savedMon?.deduplicated),
            reference_code: refCode,
            crm_inquiry_id: crmInquiryId,
            crm_inquiry_code: crmInquiryCode,
            message: savedMon?.deduplicated
                ? lang === 'en'
                    ? `Your monitoring request was already registered under reference ${refCode} (no duplicate created).`
                    : lang === 'fr'
                    ? `Votre demande de suivi était déjà enregistrée sous la référence ${refCode} (aucun doublon créé).`
                    : `Tu solicitud de Monitoreo ya estaba registrada bajo la referencia ${refCode} (sin duplicar tu registro).`
                : lang === 'en'
                ? `Monitoring request saved under tracking reference ${refCode} (local isolated mode: no real email sent).`
                : lang === 'fr'
                ? `Demande de suivi enregistrée sous la référence ${refCode} (mode local isolé : aucun e-mail réel envoyé).`
                : `Solicitud de Monitoreo registrada bajo la referencia de seguimiento ${refCode} (modo local aislado: sin correos reales ni HubSpot).`,
        };
    }

    const policy = resolveExecutionPolicy(email);
    if (!policy.allowed) {
        console.error(`[FormEmails:${policy.code}] ${policy.error}`);
        return {
            success: false,
            message: policy.error
        };
    }

    if (policy.mode === 'local_dry_run') {
        return {
            success: true,
            email_sent: false,
            message: 'Message sent successfully!'
        };
    }

    try {
        // Construct message for the CRM
        const combinedMessage = `Solicitud de Monitoreo Técnico:
País de Residencia: ${country || 'N/A'}
Proyecto: ${project || 'N/A'}
Ubicación: ${location || 'N/A'}
Monto Inversión: ${investment || 'N/A'}
Fecha Entrega: ${date || 'N/A'}`;

        if (policy.railwayMode === 'simulated') {
            console.log(`[PREVIEW-SIMULATED] Railway /api/public/leads/ skipped [MONITORING]`);
        } else if (policy.railwayApiUrl) {
            const backendData = {
                first_name: name.split(' ')[0],
                last_name: name.split(' ').slice(1).join(' ') || '.',
                email: email,
                phone: phone,
                message: combinedMessage,
                source: "Website Monitoring Form",
                interest: "Servicio de Monitoreo de Inversión"
            };

            try {
                const res = await fetch(`${policy.railwayApiUrl}/api/public/leads/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(backendData),
                });

                if (!res.ok) {
                    const errText = await res.text();
                    console.error("CRITICAL: Backend rejected the Lead payload:", errText);
                    throw new Error(`Backend Validation Error: ${res.status} - ${errText}`);
                }
            } catch (backendError) {
                console.error("FATAL: Cannot reach Backend or payload rejected:", backendError);
                return {
                    success: false,
                    message: 'Error de conexión con el servidor principal. ' + (backendError instanceof Error ? backendError.message : 'Fallo desconocido.')
                };
            }
        }

        if (policy.hubspotMode === 'simulated') {
            console.log(`[PREVIEW-SIMULATED] HubSpot contact sync skipped [MONITORING]`);
        } else {
            try {
                await createHubspotContact({
                    email: email,
                    firstname: name.split(' ')[0],
                    lastname: name.split(' ').slice(1).join(' '),
                    phone: phone,
                    message: combinedMessage,
                    budget: investment,
                    form_source: "Website Monitoring Form"
                });
            } catch (hsError) {
                console.error("HubSpot sync failed in monitoring form:", hsError);
            }
        }

        // Send Auto-Responder to the CLIENT — email_sent is true ONLY when Resend accepts the email
        let clientEmailAccepted = false;
        try {
            const firstName = name.split(' ')[0] || (lang === 'en' ? 'Client' : lang === 'fr' ? 'Client' : 'Cliente');
            
            // Localization variables
            let subject = 'Hemos recibido tu solicitud de Monitoreo - Punta Cana Investments';
            let title = 'Solicitud en Proceso';
            let greeting = `Hola <strong>${firstName}</strong>,`;
            let body = 'Un consultor experto de nuestro equipo está revisando los datos de tu proyecto y se comunicará contigo dentro de las próximas 24 horas para presentarte una propuesta de monitoreo a la medida.';
            let speedUpTitle = '¿Deseas agilizar el proceso?';
            let speedUpText = 'Puedes agendar una videollamada personalizada con nuestros expertos inmediatamente:';
            let buttonText = 'Agendar Videollamada';
            let slogan = 'Tus ojos en la obra, tu capital asegurado.';
            
            if (lang === 'en') {
                subject = 'We have received your Monitoring request - Punta Cana Investments';
                title = 'Request in Process';
                greeting = `Hello <strong>${firstName}</strong>,`;
                body = 'An expert consultant from our team is reviewing your project details and will contact you within the next 24 hours to present a customized monitoring proposal.';
                speedUpTitle = 'Want to speed up the process?';
                speedUpText = 'You can schedule a personalized video call with our experts immediately:';
                buttonText = 'Schedule Video Call';
                slogan = 'Your eyes on the ground, your capital secured.';
            } else if (lang === 'fr') {
                subject = 'Nous avons reçu votre demande de suivi - Punta Cana Investments';
                title = 'Demande en cours';
                greeting = `Bonjour <strong>${firstName}</strong>,`;
                body = 'Un consultant expert de notre équipe examine les détails de votre projet et vous contactera dans les prochaines 24 heures pour vous présenter une proposition de suivi sur mesure.';
                speedUpTitle = 'Vous souhaitez accélérer le processus ?';
                speedUpText = 'Vous pouvez planifier un appel vidéo personnalisé avec nos experts dès maintenant :';
                buttonText = "Planifier l'Appel Vidéo";
                slogan = 'Vos yeux sur le terrain, votre capital sécurisé.';
            }

            const htmlTemplate = `
            <html>
                <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #000000; color: #ffffff; max-width: 600px; margin: 0 auto; padding: 0;">
                    <div style="background-color: #111111; padding: 40px 20px; text-align: center; border-bottom: 2px solid #c9ae5d;">
                        <img src="https://puntacanainvestmentsrd.com/images/logo-email.jpg" alt="Punta Cana Investments Logo" style="max-width: 320px; height: auto;" />
                    </div>
                    <div style="padding: 40px 30px; background-color: #0a0a0a;">
                        <h2 style="color: #c9ae5d; text-transform: uppercase; margin-top: 0; font-weight: 400; letter-spacing: 1px; text-align: center;">${title}</h2>
                        <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 20px;">
                            ${greeting}
                        </p>
                        <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 30px;">
                            ${body}
                        </p>
                        
                        <div style="background-color: #1a1a1a; padding: 25px; border-left: 4px solid #c9ae5d; margin: 30px 0; border-radius: 4px;">
                            <p style="margin: 0 0 15px 0; color: #ffffff; font-size: 15px;"><strong>${speedUpTitle}</strong><br>
                            ${speedUpText}</p>
                            <p style="margin: 0;">
                                <a href="https://calendly.com/ulisespp9/30min" style="display: inline-block; background-color: #c9ae5d; color: #000000; padding: 12px 24px; text-decoration: none; border-radius: 2px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">${buttonText}</a>
                            </p>
                        </div>
                    </div>
                    <div style="background-color: #111111; padding: 30px; text-align: center; border-top: 1px solid #333333;">
                        <p style="margin: 0; font-size: 14px; color: #c9ae5d; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">Punta Cana Investments</p>
                        <p style="margin: 10px 0 0 0; font-size: 12px; color: #888888;">${slogan}</p>
                    </div>
                </body>
            </html>
            `;

            const clientSendRes = await getResend().emails.send({
                from: PCI_CLIENT_FROM,
                to: [policy.clientRecipient],
                subject: subject,
                html: htmlTemplate
            });
            if (!clientSendRes?.error && clientSendRes?.data?.id) {
                clientEmailAccepted = true;
            } else if (clientSendRes?.error) {
                console.error("Resend rejected Monitoring client autoresponder:", clientSendRes.error);
            }

        } catch (autoResponderError: any) {
            console.error("Client Autoresponder Exception:", autoResponderError);
        }

        // Send Admin Notification Email via Resend
        try {
            const adminHtmlTemplate = `
            <html>
                <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #000000; color: #ffffff; max-width: 600px; margin: 0 auto; padding: 0;">
                    <div style="background-color: #111111; padding: 40px 20px; text-align: center; border-bottom: 2px solid #c9ae5d;">
                        <img src="https://puntacanainvestmentsrd.com/images/logo-email.jpg" alt="Punta Cana Investments Logo" style="max-width: 320px; height: auto;" />
                    </div>
                    <div style="padding: 40px 30px; background-color: #0a0a0a;">
                        <h2 style="color: #c9ae5d; text-transform: uppercase; margin-top: 0; font-weight: 400; letter-spacing: 1px; text-align: center;">NUEVO LEAD MONITOREO</h2>
                        
                        <div style="background-color: #1a1a1a; padding: 20px; border-left: 4px solid #c9ae5d; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0 0 10px 0; color: #c9ae5d; font-size: 15px; font-weight: bold; text-transform: uppercase;">Datos del Inversor</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Nombre:</strong> ${name}</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Email:</strong> ${email}</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Teléfono:</strong> ${phone}</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>País:</strong> ${country}</p>
                        </div>

                        <div style="background-color: #1a1a1a; padding: 20px; border-left: 4px solid #c9ae5d; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0 0 10px 0; color: #c9ae5d; font-size: 15px; font-weight: bold; text-transform: uppercase;">Datos del Proyecto</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Proyecto:</strong> ${project}</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Ubicación:</strong> ${location}</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Inversión:</strong> ${investment}</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Fecha Entrega:</strong> ${date}</p>
                        </div>
                        
                        <p style="font-size: 12px; color: #888888; text-align: center; margin-top: 30px;">Este lead ya fue enviado al Backend de forma automática.</p>
                    </div>
                </body>
            </html>
            `;

            await getResend().emails.send({
                from: PCI_TEAM_FROM,
                to: policy.teamRecipients,
                subject: `LEAD MONITOREO: ${name} - ${project}`,
                html: adminHtmlTemplate
            });
        } catch (adminEmailError) {
            console.error("Admin Email Exception:", adminEmailError);
        }

        return {
            success: true,
            email_sent: clientEmailAccepted,
            message: 'Message sent successfully!'
        };

    } catch (error) {
        console.error("Server Error:", error);
        return {
            success: false,
            message: 'Internal server error. Please try again later.'
        };
    }
}
