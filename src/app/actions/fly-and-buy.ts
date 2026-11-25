'use server'

import { Resend } from 'resend';
import { createHubspotContact } from '@/lib/hubspot';
import { appendSandboxFlyAndBuyLead, fetchLocalSandboxPhase8, isLocalSandboxEnabled } from '@/lib/localSandbox';
import {
    buildFlyAndBuyEmails,
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

export async function submitFlyAndBuyForm(prevState: any, formData: FormData) {
    // Obligamos a la acción a ir directo a Railway, ignorando NEXT_PUBLIC_API_URL de Vercel.
    const apiUrl = 'https://puntacana-fortress-production.up.railway.app';

    // Extract data from FormData
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const country = String(formData.get('country') || '').trim();
    const comments = String(formData.get('comments') || '').trim();
    const safeLang = normalizeLang(formData.get('lang'), 'es');

    // Additional fields
    const experience = String(formData.get('experience') || 'N/A');
    const horizon = String(formData.get('horizon') || 'N/A');
    const visited = String(formData.get('visited') || 'N/A');

    // Arrays for multiple checkboxes
    const objectivesArr = formData.getAll('objective').map(String).filter(Boolean);
    const propertyTypesArr = formData.getAll('propertyType').map(String).filter(Boolean);
    const investmentFocusArr = formData.getAll('investmentFocus').map(String).filter(Boolean);
    const motivationArr = formData.getAll('motivation').map(String).filter(Boolean);

    const objectives = objectivesArr.join(', ') || 'N/A';
    const propertyTypes = propertyTypesArr.join(', ') || 'N/A';
    const investmentFocus = investmentFocusArr.join(', ') || 'N/A';
    const motivation = motivationArr.join(', ') || 'N/A';

    // Check dynamic select/input correctly
    const propertySelection = String(formData.get('specificPropertySelect') || '');
    const propertyInput = String(formData.get('specificPropertyName') || '');
    const specificProperty = propertySelection === 'other' || !propertySelection ? propertyInput : propertySelection;

    const tripData = {
        client_name: name,
        client_email: email,
        client_phone: phone,
        origin_city: country,
        proposed_dates: 'Por Definir',
        notes: `Comentarios: ${comments}\nObjetivos: ${objectives}\nTipo de Propiedad: ${propertyTypes}\nEnfoque de Inversión: ${investmentFocus}\nExperiencia: ${experience}\nHorizonte: ${horizon}\nHa visitado RD: ${visited}\nMotivación: ${motivation}\nPropiedad Específica: ${specificProperty || 'Ninguna'}`,
    };

    const cleanedApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    // ISOLATED LOCAL SANDBOX INTERCEPTOR:
    // Captures Fly & Buy submissions + exact rendered Team & Client emails into test_inbox.json,
    // with ZERO calls to production Railway/HubSpot/Resend.
    if (isLocalSandboxEnabled()) {
        const phase8 = fetchLocalSandboxPhase8();
        if (phase8?.fly_and_buy?.show_form === false) {
            return {
                success: false,
                closed: true,
                sandbox_isolated: true,
                message:
                    safeLang === 'en'
                        ? 'Fly & Buy intake is currently closed. Your request could not be submitted.'
                        : safeLang === 'fr'
                        ? 'La réception des demandes Fly & Buy est actuellement fermée. Votre demande n’a pas été envoyée.'
                        : 'La recepción de solicitudes Fly & Buy está cerrada actualmente. Tu solicitud no fue registrada.',
            };
        }

        const saved = appendSandboxFlyAndBuyLead(
            {
                form_type: 'fly_and_buy',
                form_label: 'Solicitud VIP Fly & Buy',
                lang: safeLang,
                configured_from: PCI_TEAM_FROM,
                configured_pci_recipient: PCI_TEAM_TO,
                client_autoresponder_to: email,
                property_reference: {
                    title: specificProperty || 'Tour Inmobiliario General Fly & Buy',
                    type: 'fly_and_buy',
                    location: country || 'Por definir',
                },
                lead: {
                    name: tripData.client_name,
                    email: tripData.client_email,
                    phone: tripData.client_phone,
                    country: tripData.origin_city,
                    message: tripData.notes,
                },
                deduplication_note:
                    '1 solicitud Fly & Buy = 1 aviso PCI (cuestionario en español + referencia) + 1 confirmación cliente en su idioma (buzón local)',
            },
            (referenceCode) => {
                const built = buildFlyAndBuyEmails({
                    referenceCode,
                    lang: safeLang,
                    name,
                    email,
                    phone,
                    country,
                    proposedDates: tripData.proposed_dates,
                    objectives: objectivesArr,
                    propertyTypes: propertyTypesArr,
                    investmentFocus: investmentFocusArr,
                    experience,
                    horizon,
                    visited,
                    motivation: motivationArr,
                    specificProperty,
                    comments,
                });
                return {
                    admin_subject: built.adminEmail.subject,
                    client_subject: built.clientEmail.subject,
                    admin_email: built.adminEmail,
                    client_email: built.clientEmail,
                };
            }
        );

        const refCode = saved?.reference_code || 'FB-LOC-001';
        return {
            success: true,
            sandbox_isolated: true,
            reference_code: refCode,
            message:
                safeLang === 'en'
                    ? `Your Fly & Buy request was saved locally under reference ${refCode} (local isolated mode: no external emails sent).`
                    : safeLang === 'fr'
                    ? `Votre demande Fly & Buy a été enregistrée localement sous la référence ${refCode} (mode local isolé : aucun e-mail externe envoyé).`
                    : `Tu solicitud Fly & Buy quedó registrada en el Dashboard local bajo la referencia ${refCode} (modo local aislado: sin enviar correos reales).`,
        };
    }

    try {
        const referenceCode = generateProductionRefCode('FB');
        const built = buildFlyAndBuyEmails({
            referenceCode,
            lang: safeLang,
            name,
            email,
            phone,
            country,
            proposedDates: tripData.proposed_dates,
            objectives: objectivesArr,
            propertyTypes: propertyTypesArr,
            investmentFocus: investmentFocusArr,
            experience,
            horizon,
            visited,
            motivation: motivationArr,
            specificProperty,
            comments,
        });

        const res = await fetch(`${cleanedApiUrl}/api/public/fly-buy/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...tripData,
                notes: `[Ref: ${referenceCode}]\n${tripData.notes}`,
            }),
        });

        // Cortocircuito de éxito inmediato si el servidor responde 200 o 201
        if (res.ok || res.status === 201 || res.status === 200) {
            // HubSpot API Integration (Background sync - preserved)
            try {
                await createHubspotContact({
                    email,
                    firstname: name.split(' ')[0],
                    lastname: name.split(' ').slice(1).join(' '),
                    phone,
                    message: `[Ref: ${referenceCode}]\n${tripData.notes}`,
                    form_source: 'Fly & Buy Form',
                });
            } catch (hsError) {
                console.error('HubSpot sync failed in Fly&Buy form:', hsError);
            }

            // Client Auto-Responder via existing Resend integration (ES/EN/FR + same refCode)
            try {
                const { error } = await getResend().emails.send({
                    from: built.clientEmail.from,
                    to: [built.clientEmail.to],
                    subject: built.clientEmail.subject,
                    html: built.clientEmail.html,
                    text: built.clientEmail.text,
                });
                if (error) {
                    console.error('Resend internal autoresponder failed:', error);
                }
            } catch (emailErr) {
                console.error('Resend internal autoresponder exception:', emailErr);
            }

            // Team Notification Email via existing Resend integration (Spanish questionnaire + refCode)
            try {
                const { error } = await getResend().emails.send({
                    from: built.adminEmail.from,
                    to: [built.adminEmail.to],
                    subject: built.adminEmail.subject,
                    html: built.adminEmail.html,
                    text: built.adminEmail.text,
                });
                if (error) {
                    console.error('Resend admin notification failed:', error);
                }
            } catch (adminEmailError) {
                console.error('Admin Email Exception:', adminEmailError);
            }

            return { success: true, reference_code: referenceCode, message: 'Request sent successfully!' };
        }

        const errorText = await res.text();
        console.error('Backend Error:', res.status, errorText);
        return { success: false, message: `Rechazado por el servidor: ${res.status} - ${errorText}` };
    } catch (error: any) {
        console.error('Server Action Error:', error);
        return { success: false, message: `Error de red: ${error.message}` };
    }
}
