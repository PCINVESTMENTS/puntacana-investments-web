'use server'

import { Resend } from 'resend';
import { createHubspotContact } from '@/lib/hubspot';
import { appendSandboxTestInboxEntry, isLocalSandboxEnabled } from '@/lib/localSandbox';
import {
    buildPropertyOrHotelEmails,
    generateProductionRefCode,
    normalizeLang,
    PCI_TEAM_FROM,
    PCI_TEAM_TO,
} from '@/lib/formEmails';

let _resendClient: Resend | null = null;
function getResend(): Resend {
    if (!_resendClient) {
        _resendClient = new Resend(process.env.RESEND_API_KEY);
    }
    return _resendClient;
}

export async function submitContactForm(prevState: any, formData: FormData) {
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const lang = normalizeLang(formData.get('lang'), 'en');

    const errorByLang = {
        en: 'Please fill in all required fields.',
        es: 'Por favor complete todos los campos requeridos.',
        fr: 'Veuillez remplir tous les champs obligatoires.',
    };

    if (!name || !email || !phone || !message) {
        return {
            success: false,
            message: errorByLang[lang],
        };
    }

    const subjectInput = String(formData.get('subject') || '').trim();
    const propertyDataStr = String(formData.get('propertyData') || '').trim();

    let parsedProp: Record<string, any> | null = null;
    if (propertyDataStr) {
        try {
            parsedProp = JSON.parse(propertyDataStr);
        } catch {
            parsedProp = null;
        }
    }

    const interestText = subjectInput
        ? subjectInput.replace(/^(Inquiry about|Consulta sobre|Demande concernant):\s*/i, '').trim()
        : 'General';

    const isHotelOrCommercial = Boolean(
        parsedProp &&
            (['resorts', 'commercial', 'condohotel', 'hotel'].includes(
                String(parsedProp.type || '').toLowerCase()
            ) ||
                /hotel|resort|comercial|condohotel/i.test(`${parsedProp.title || ''} ${interestText}`))
    );

    const formCategory: 'property_inquiry' | 'hotel_inquiry' | 'general_contact' = parsedProp
        ? isHotelOrCommercial
            ? 'hotel_inquiry'
            : 'property_inquiry'
        : 'general_contact';

    const normalizedProp = parsedProp
        ? {
              title: parsedProp.title || interestText,
              internal_code: parsedProp.internal_code || null,
              slug: parsedProp.slug || null,
              location: parsedProp.location || 'Punta Cana',
              price: parsedProp.price ?? null,
              area: parsedProp.area ?? null,
              type: parsedProp.type || 'property',
          }
        : null;

    // ISOLATED LOCAL SANDBOX INTERCEPTOR:
    // Captures exact Team + Client email payloads into local test_inbox.json using the SAME
    // templates as production Resend, with ZERO outbound calls to production Railway/HubSpot/Resend.
    if (isLocalSandboxEnabled()) {
        const saved = appendSandboxTestInboxEntry(
            {
                form_type: formCategory,
                form_label:
                    formCategory === 'hotel_inquiry'
                        ? 'Consulta Directa de Hotel / Activo Comercial'
                        : formCategory === 'property_inquiry'
                        ? 'Consulta de Propiedad'
                        : 'Formulario de Contacto General',
                lang,
                configured_from: PCI_TEAM_FROM,
                configured_pci_recipient: PCI_TEAM_TO,
                client_autoresponder_to: email,
                property_reference: normalizedProp || { title: interestText, type: 'general' },
                lead: { name, email, phone, message },
                deduplication_note:
                    '1 envío = 1 aviso PCI (con referencia, código y enlace) + 1 confirmación automática al cliente en su idioma (buzón local)',
            },
            (referenceCode) => {
                const built = buildPropertyOrHotelEmails({
                    referenceCode,
                    formCategory,
                    lang,
                    name,
                    email,
                    phone,
                    message,
                    interestText,
                    property: normalizedProp,
                });
                return {
                    admin_subject: built.adminEmail.subject,
                    client_subject: built.clientEmail.subject,
                    admin_email: built.adminEmail,
                    client_email: built.clientEmail,
                    property_reference: normalizedProp
                        ? { ...normalizedProp, url: built.propertyUrl }
                        : { title: interestText, type: 'general' },
                };
            }
        );

        const refCode = saved?.reference_code || (formCategory === 'hotel_inquiry' ? 'HTL-LOC-001' : 'INQ-LOC-001');
        return {
            success: true,
            sandbox_isolated: true,
            reference_code: refCode,
            email_status: 'intercepted_local',
            message:
                lang === 'es'
                    ? `Tu consulta quedó registrada en el buzón local bajo la referencia ${refCode} (modo local aislado: sin enviar correos reales).`
                    : lang === 'fr'
                    ? `Votre demande a été enregistrée localement sous la référence ${refCode} (mode local isolé : aucun e-mail réel envoyé).`
                    : `Your inquiry was registered locally under reference ${refCode} (isolated local mode: no real email sent).`,
        };
    }

    try {
        // 1. Send to "Fortaleza Digital" Backend (Django) - Server-to-Server (preserved existing flow)
        const apiUrl = 'https://puntacana-fortress-production.up.railway.app';
        const refPrefix =
            formCategory === 'hotel_inquiry' ? 'HTL' : formCategory === 'property_inquiry' ? 'INQ' : 'CNT';
        const referenceCode = generateProductionRefCode(refPrefix);

        const backendData = {
            first_name: name.split(' ')[0],
            last_name: name.split(' ').slice(1).join(' ') || '.',
            email,
            phone,
            message: `[Ref: ${referenceCode}] ${message}`,
            source: 'Website Contact Form',
            interest: interestText || 'General',
        };

        try {
            const res = await fetch(`${apiUrl}/api/public/leads/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(backendData),
            });

            if (!res.ok) {
                const errText = await res.text();
                console.error('CRITICAL: Backend rejected the Lead payload:', errText);
                throw new Error(`Backend Validation Error: ${res.status} - ${errText}`);
            }

            // HubSpot API Integration (Background sync - preserved)
            try {
                await createHubspotContact({
                    email,
                    firstname: name.split(' ')[0],
                    lastname: name.split(' ').slice(1).join(' '),
                    phone,
                    message: `[Ref: ${referenceCode}] ${message}`,
                    form_source: 'Website Contact Form',
                });
            } catch (hsError) {
                console.error('HubSpot sync failed in contact form:', hsError);
            }
        } catch (backendError) {
            console.error('FATAL: Cannot reach Backend or payload rejected:', backendError);
            return {
                success: false,
                message:
                    'Error de conexión con el servidor principal. ' +
                    (backendError instanceof Error ? backendError.message : 'Fallo desconocido.'),
            };
        }

        const built = buildPropertyOrHotelEmails({
            referenceCode,
            formCategory,
            lang,
            name,
            email,
            phone,
            message,
            interestText,
            property: normalizedProp,
        });

        // 2. Send Automatic Client Confirmation via existing Resend integration (ES/EN/FR + same refCode)
        try {
            const clientEmailRes = await getResend().emails.send({
                from: built.clientEmail.from,
                to: [built.clientEmail.to],
                subject: built.clientEmail.subject,
                html: built.clientEmail.html,
                text: built.clientEmail.text,
            });
            if (clientEmailRes.error) {
                console.error('Resend Error (Client Autoresponder):', clientEmailRes.error);
            }
        } catch (autoResponderError) {
            console.error('Client Autoresponder Exception:', autoResponderError);
        }

        // 3. Send Team Notification Email via existing Resend integration (ref + code + link + lead)
        try {
            const adminEmailRes = await getResend().emails.send({
                from: built.adminEmail.from,
                to: [built.adminEmail.to],
                subject: built.adminEmail.subject,
                html: built.adminEmail.html,
                text: built.adminEmail.text,
            });
            if (adminEmailRes.error) {
                console.error('Resend Error (Admin Notification):', adminEmailRes.error);
            }
        } catch (adminEmailError) {
            console.error('Admin Email Exception:', adminEmailError);
        }

        return {
            success: true,
            reference_code: referenceCode,
            message: 'Message sent successfully!',
        };
    } catch (error) {
        console.error('Server Error:', error);
        return {
            success: false,
            message: 'Internal server error. Please try again later.',
        };
    }
}
