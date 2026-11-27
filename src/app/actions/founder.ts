'use server'

import { Resend } from 'resend';
import { createHubspotContact } from '@/lib/hubspot';
import {
    getPhase4BackendBaseUrl,
    getServerStagingApiKey,
    isCloudStagingSimulatedMode,
    isLocalFileSandbox,
    recordLocalServerOutboundEvent,
    upsertSandboxFounderLead,
} from '@/lib/localSandbox';
import { normalizeLang, PCI_CLIENT_FROM, PCI_TEAM_FROM, resolveExecutionPolicy } from '@/lib/formEmails';
import { evaluateFormAntispam, extractAntispamFromFormData } from '@/lib/formSecurity';

let _resendClient: Resend | null = null;
function getResend(): Resend {
    if (!_resendClient) {
        _resendClient = new Resend(process.env.RESEND_API_KEY);
    }
    return _resendClient;
}

export async function submitFounderForm(prevState: Record<string, any>, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;
    const modality = formData.get('modality') as string;
    const lang = (formData.get('lang') as string) || 'es';

    const t = {
        en: {
            title: "New Founder Investor Submission",
            error: "Please fill in all required fields."
        },
        es: {
            title: "Nuevo Inversor Fundador",
            error: "Por favor complete todos los campos requeridos."
        }
    };

    const dict = t[lang as keyof typeof t] || t.es;

    if (!name || !email || !phone || !modality) {
        return {
            success: false,
            message: dict.error
        };
    }

    const safeLang = normalizeLang(lang, 'es');
    const { honeypot, formLoadedAt } = extractAntispamFromFormData(formData);
    const antispam = evaluateFormAntispam({
        email,
        honeypot,
        formLoadedAt,
        lang: safeLang,
        sourceLabel: 'FounderForm',
    });
    if (antispam.action === 'silent_drop') {
        console.warn(antispam.logMessage);
        return { success: true, message: 'Application sent successfully!' };
    }
    if (antispam.action === 'reject') {
        console.warn(antispam.logMessage);
        return { success: false, message: antispam.errorMessage };
    }

    if (isLocalFileSandbox()) {
        const idempotencyKey = String(formData.get('idempotency_key') || '').trim();
        const projectSlug = String(formData.get('project_slug') || 'miches-eco-resort').trim();
        const saved = upsertSandboxFounderLead({
            name,
            email,
            phone,
            modality,
            message: message || '',
            lang,
            project_slug: projectSlug,
            idempotency_key: idempotencyKey,
        });
        const seq = saved?.sequence_number || 'FND-LOC-001';
        const dedup = Boolean(saved?.deduplicated);
        recordLocalServerOutboundEvent({
            flow: 'founder_lista_cero',
            provider: 'hubspot',
            target_url: 'https://api.hubapi.com/crm/v3/objects/contacts',
            method: 'POST',
            blocked: true,
            simulated: false,
            status_code: 0,
            reference_code: seq,
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
            reference_code: seq,
            reason: 'RESEND_SIMULATED_LOCAL_OUTBOX',
        });
        return {
            success: true,
            sandbox_isolated: true,
            email_sent: false,
            deduplicated: dedup,
            sequence_number: seq,
            id: saved?.id,
            message: dedup
                ? lang === 'en'
                    ? `Your Zero List registration was already confirmed under reference ${seq} (no duplicate created).`
                    : lang === 'fr'
                    ? `Votre inscription à la Liste Zéro était déjà confirmée sous la référence ${seq} (aucun doublon créé).`
                    : `Tu solicitud en Lista Cero ya estaba registrada bajo la referencia ${seq} (sin duplicar tu registro).`
                : lang === 'en'
                ? `Your Zero List registration was saved locally under reference ${seq} (local test mode: no real email sent).`
                : lang === 'fr'
                ? `Votre inscription à la Liste Zéro a été enregistrée localement sous la référence ${seq} (mode local : aucun e-mail réel envoyé).`
                : `Tu solicitud en Lista Cero quedó registrada en local bajo la referencia ${seq} (modo local aislado: sin enviar correos reales).`,
        };
    }

    if (isCloudStagingSimulatedMode()) {
        const idempotencyKey = String(formData.get('idempotency_key') || '').trim();
        const projectSlug = String(formData.get('project_slug') || 'miches-eco-resort').trim();
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
                message: message || '',
                lang: safeLang,
                project_slug: projectSlug,
                idempotency_key: idempotencyKey,
            }),
            cache: 'no-store',
        });
        const json = await resp.json().catch(() => ({}));
        if (!resp.ok || !json.success) {
            return { success: false, message: json.error || 'No se pudo registrar en Lista Cero (Staging).' };
        }
        const seq = String(json.sequence_number || 'FND-STG-001');
        const dedup = Boolean(json.deduplicated);
        return {
            success: true,
            sandbox_isolated: true,
            email_sent: false,
            deduplicated: dedup,
            sequence_number: seq,
            crm_inquiry_id: json.crm_inquiry_id || null,
            crm_inquiry_code: json.crm_inquiry_code || '',
            id: json.id,
            message: dedup
                ? safeLang === 'en'
                    ? `Your Zero List registration was already confirmed under reference ${seq} (no duplicate created).`
                    : safeLang === 'fr'
                    ? `Votre inscription à la Liste Zéro était déjà confirmée sous la référence ${seq} (aucun doublon créé).`
                    : `Tu solicitud en Lista Cero ya estaba registrada bajo la referencia ${seq} (sin duplicar tu registro).`
                : safeLang === 'en'
                ? `Your Zero List registration was saved under reference ${seq} (simulated Stage 1 mode: 0 real emails sent).`
                : safeLang === 'fr'
                ? `Votre inscription à la Liste Zéro a été enregistrée sous la référence ${seq} (mode simulé Étape 1 : 0 e-mail réel envoyé).`
                : `Tu solicitud en Lista Cero quedó registrada bajo la referencia ${seq} (Etapa A simulada: 0 correos externos enviados).`,
        };
    }

    const policy = resolveExecutionPolicy(email);
    if (!policy.allowed) {
        console.error(`[FormEmails:${policy.code}] ${policy.error}`);
        return { success: false, message: policy.error };
    }
    if (policy.mode === 'local_dry_run') {
        return { success: true, message: 'Application sent successfully!' };
    }

    try {
        const backendData = {
            first_name: name.split(' ')[0],
            last_name: name.split(' ').slice(1).join(' ') || '.',
            email: email,
            phone: phone,
            modality: modality,
            message: message || "Sin mensaje adicional."
        };

        let sequenceNumber = "FND-PREVIEW";

        if (policy.railwayMode === 'simulated') {
            console.log(`[PREVIEW-SIMULATED] Railway /api/public/founder-leads/ skipped`);
        } else if (policy.railwayApiUrl) {
            try {
                const res = await fetch(`${policy.railwayApiUrl}/api/public/founder-leads/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(backendData),
                });

                if (!res.ok) {
                    const errText = await res.text();
                    console.error("Backend Validation Error (Founder Lead):", errText);
                    throw new Error(`Error: ${res.status}`);
                }
                
                const data = await res.json();
                sequenceNumber = data.sequence_number || sequenceNumber;
                console.log(`Founder Lead saved successfully: ${sequenceNumber}`);
            } catch (backendError) {
                console.error("Cannot reach Founder Lead API:", backendError);
                return {
                    success: false,
                    message: 'Error de conexión con el servidor. Por favor intente más tarde.'
                };
            }
        }

        if (policy.hubspotMode === 'simulated') {
            console.log(`[PREVIEW-SIMULATED] HubSpot contact sync skipped [FOUNDER]`);
        } else {
            try {
                await createHubspotContact({
                    email: email,
                    firstname: name.split(' ')[0],
                    lastname: name.split(' ').slice(1).join(' '),
                    phone: phone,
                    message: `Modalidad: ${modality} | ${message}`,
                    form_source: "Founder Investor Form"
                });
            } catch (hsError) {
                console.error("HubSpot sync failed in founder form:", hsError);
            }
        }

        // Enviar Correo de Confirmación al Cliente con su Número (email_sent=true solo si Resend acepta)
        let clientEmailAccepted = false;
        try {
            const firstName = name.split(' ')[0] || 'Inversor';
            const htmlTemplate = `
            <html>
                <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #000000; color: #ffffff; max-width: 600px; margin: 0 auto; padding: 0;">
                    <div style="background-color: #111111; padding: 40px 20px; text-align: center; border-bottom: 2px solid #c9ae5d;">
                        <img src="https://puntacanainvestmentsrd.com/images/logo-email.jpg" alt="Punta Cana Investments Logo" style="max-width: 320px; height: auto;" />
                    </div>
                    <div style="padding: 40px 30px; background-color: #0a0a0a;">
                        <h2 style="color: #c9ae5d; text-transform: uppercase; margin-top: 0; font-weight: 400; letter-spacing: 1px; text-align: center;">Acceso Lista Cero Confirmado</h2>
                        <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 20px;">
                            Estimado/a <strong>${firstName}</strong>,
                        </p>
                        <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 20px;">
                            Hemos recibido tu aplicación para la fase exclusiva de lanzamiento del nuevo Eco-Resort en Miches bajo la modalidad: <strong>${modality === 'capital' ? 'Socio de Capital' : 'Inversor de Unidades'}</strong>.
                        </p>
                        
                        <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 30px;">
                            La dirección ejecutiva revisará tu perfil de inversión. Si eres aprobado, te enviaremos el Dossier Financiero Privado o el Acuerdo de Confidencialidad correspondiente a tu modalidad.
                        </p>
                        
                        <p style="font-size: 14px; line-height: 1.6; color: #a0a0a0; margin-bottom: 20px; font-style: italic;">
                            Nota: Por favor verifica tu bandeja de Spam o Correo no deseado para asegurar que recibes nuestras futuras comunicaciones.
                        </p>
                    </div>
                    <div style="background-color: #111111; padding: 30px; text-align: center; border-top: 1px solid #333333;">
                        <p style="margin: 0; font-size: 14px; color: #c9ae5d; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">Punta Cana Investments</p>
                        <p style="margin: 10px 0 0 0; font-size: 12px; color: #888888;">Gestión de Inversiones de Alto Capital</p>
                    </div>
                </body>
            </html>
            `;

            const clientFounderRes = await getResend().emails.send({
                from: PCI_CLIENT_FROM,
                to: [policy.clientRecipient],
                subject: `Solicitud VIP Recibida - Punta Cana Investments`,
                html: htmlTemplate
            });
            if (!clientFounderRes?.error && clientFounderRes?.data?.id) {
                clientEmailAccepted = true;
            }

        } catch (emailError) {
            console.error("Client Founder Autoresponder Exception:", emailError);
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
                        <h2 style="color: #c9ae5d; text-transform: uppercase; margin-top: 0; font-weight: 400; letter-spacing: 1px; text-align: center;">NUEVO LEAD VIP (FOUNDER)</h2>
                        
                        <div style="background-color: #1a1a1a; padding: 20px; border-left: 4px solid #c9ae5d; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0 0 10px 0; color: #c9ae5d; font-size: 15px; font-weight: bold; text-transform: uppercase;">Datos del Inversor VIP</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Secuencia:</strong> ${sequenceNumber}</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Nombre:</strong> ${name}</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Email:</strong> ${email}</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Teléfono:</strong> ${phone}</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Modalidad:</strong> ${modality}</p>
                        </div>

                        <div style="background-color: #1a1a1a; padding: 20px; border-left: 4px solid #c9ae5d; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0 0 10px 0; color: #c9ae5d; font-size: 15px; font-weight: bold; text-transform: uppercase;">Mensaje / Comentarios</p>
                            <p style="margin: 5px 0; color: #e0e0e0; white-space: pre-wrap;">${message || 'Sin mensaje'}</p>
                        </div>
                    </div>
                </body>
            </html>
            `;

            await getResend().emails.send({
                from: PCI_TEAM_FROM,
                to: policy.teamRecipients,
                subject: `NUEVO LEAD VIP (Founder): ${name} [${sequenceNumber}]`,
                html: adminHtmlTemplate
            });
        } catch (adminEmailError) {
            console.error("Admin Email Exception (Founder):", adminEmailError);
        }

        return {
            success: true,
            email_sent: clientEmailAccepted,
            message: 'Application sent successfully!'
        };

    } catch (error) {
        console.error("Server Error in Founder Action:", error);
        return {
            success: false,
            message: 'Internal server error. Please try again later.'
        };
    }
}
