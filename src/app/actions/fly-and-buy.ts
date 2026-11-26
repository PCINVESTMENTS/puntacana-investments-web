'use server'

import { headers } from 'next/headers';
import { Resend } from 'resend';
import { createHubspotContact } from '@/lib/hubspot';
import { appendSandboxFlyAndBuyLead, fetchLocalSandboxPhase8, isLocalSandboxEnabled } from '@/lib/localSandbox';
import {
    buildFlyAndBuyEmails,
    generateReferenceCode,
    normalizeLang,
    PCI_TEAM_FROM,
    PCI_TEAM_TO,
    recordLocalDryRunEmail,
    resolveExecutionPolicy,
    resolveSiteOrigin,
} from '@/lib/formEmails';
import {
    evaluateFormAntispam,
    extractAntispamFromFormData,
} from '@/lib/formSecurity';

function getResend(): Resend {
    return new Resend(process.env.RESEND_API_KEY);
}

export async function submitFlyAndBuyForm(prevState: any, formData: FormData) {
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const country = String(formData.get('country') || '').trim();
    const comments = String(formData.get('comments') || '').trim();
    const safeLang = normalizeLang(formData.get('lang'), 'es');

    // Silent antispam + self-domain bounce shield: stops BEFORE sandbox, Preview guard, CRM, or Resend
    const { honeypot, formLoadedAt } = extractAntispamFromFormData(formData);
    const antispam = evaluateFormAntispam({
        email,
        honeypot,
        formLoadedAt,
        lang: safeLang,
        sourceLabel: 'FlyAndBuyForm',
    });
    if (antispam.action === 'silent_drop') {
        console.warn(antispam.logMessage);
        return {
            success: true,
            message: 'Request sent successfully!',
        };
    }
    if (antispam.action === 'reject') {
        console.warn(antispam.logMessage);
        return {
            success: false,
            message: antispam.errorMessage,
        };
    }

    const experience = String(formData.get('experience') || 'N/A');
    const horizon = String(formData.get('horizon') || 'N/A');
    const visited = String(formData.get('visited') || 'N/A');

    const objectivesArr = formData.getAll('objective').map(String).filter(Boolean);
    const propertyTypesArr = formData.getAll('propertyType').map(String).filter(Boolean);
    const investmentFocusArr = formData.getAll('investmentFocus').map(String).filter(Boolean);
    const motivationArr = formData.getAll('motivation').map(String).filter(Boolean);

    const propertySelection = String(formData.get('specificPropertySelect') || '');
    const propertyInput = String(formData.get('specificPropertyName') || '');
    const specificProperty = propertySelection === 'other' || !propertySelection ? propertyInput : propertySelection;

    // ISOLATED LOCAL SANDBOX INTERCEPTOR (Fases 1-8 local mirror):
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
                    name,
                    email,
                    phone,
                    country,
                    message: comments,
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
                    proposedDates: 'Por Definir',
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
                    questionnaire_es: built.questionnaireEs,
                };
            }
        );

        return {
            success: true,
            sandbox_isolated: true,
            reference_code: saved?.reference_code || '',
            email_sent: false,
            message:
                safeLang === 'en'
                    ? `Fly & Buy application recorded in local sandbox under reference ${saved?.reference_code || 'LOCAL'} (no real email dispatched).`
                    : safeLang === 'fr'
                    ? `Demande Fly & Buy enregistrée dans le bac à sable local sous la référence ${saved?.reference_code || 'LOCAL'} (aucun e-mail réel envoyé).`
                    : `Solicitud Fly & Buy registrada en el Buzón Local bajo la referencia ${saved?.reference_code || 'LOCAL'} (sin envío de correo real).`,
        };
    }

    // Fail-closed Preview guard: stops BEFORE any Railway, HubSpot, or Resend call
    const policy = resolveExecutionPolicy(email);
    if (!policy.allowed) {
        console.error(`[FormEmails:${policy.code}] ${policy.error}`);
        return {
            success: false,
            message: policy.error,
        };
    }

    const referenceCode = generateReferenceCode('FB');
    const reqHeaders = await headers();
    const siteOrigin = resolveSiteOrigin(reqHeaders);

    const { adminEmail, clientEmail, questionnaireEs } = buildFlyAndBuyEmails({
        referenceCode,
        lang: safeLang,
        name,
        email: policy.clientRecipient,
        phone,
        country,
        proposedDates: 'Por Definir',
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

    if (policy.mode === 'local_dry_run') {
        recordLocalDryRunEmail({
            recordedAt: new Date().toISOString(),
            flow: 'fly_and_buy',
            referenceCode,
            lang: safeLang,
            siteOrigin,
            railwayMode: policy.railwayMode,
            hubspotMode: policy.hubspotMode,
            adminEmail: {
                ...adminEmail,
                recipients: policy.teamRecipients,
            },
            clientEmail,
        });

        return {
            success: true,
            message: 'Request sent successfully!',
        };
    }

    const readableNotes = [
        `[Ref: ${referenceCode}]`,
        `Comentarios (${safeLang.toUpperCase()}): ${comments || 'Sin comentarios'}`,
        ...questionnaireEs.map((item) => `${item.label}: ${item.value}`),
    ].join('\n');

    const tripData = {
        client_name: name,
        client_email: email,
        client_phone: phone,
        origin_city: country,
        proposed_dates: 'Por Definir',
        notes: readableNotes,
    };

    try {
        if (policy.railwayMode === 'simulated') {
            console.log(`[PREVIEW-SIMULATED] Railway /api/public/fly-buy/ skipped [${referenceCode}]`);
        } else if (policy.railwayApiUrl) {
            const res = await fetch(`${policy.railwayApiUrl}/api/public/fly-buy/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tripData),
            });

            if (!(res.ok || res.status === 201 || res.status === 200)) {
                const errorText = await res.text();
                console.error('Backend Error:', res.status, errorText);
                return { success: false, message: `Rechazado por el servidor: ${res.status} - ${errorText}` };
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
                    message: tripData.notes,
                    form_source: 'Fly & Buy Form',
                });
            } catch (hsError) {
                console.error('HubSpot sync failed in Fly&Buy form:', hsError);
            }
        }

        const resend = getResend();

        try {
            const { error } = await resend.emails.send({
                from: clientEmail.from,
                to: [policy.clientRecipient],
                subject: clientEmail.subject,
                html: clientEmail.html,
                text: clientEmail.text,
            });
            if (error) {
                console.error('Resend internal autoresponder failed:', error);
            }
        } catch (emailErr: any) {
            console.error('Resend internal autoresponder exception:', emailErr);
        }

        try {
            const { error } = await resend.emails.send({
                from: adminEmail.from,
                to: policy.teamRecipients,
                subject: adminEmail.subject,
                html: adminEmail.html,
                text: adminEmail.text,
            });
            if (error) {
                console.error('Resend Admin notification failed (Fly&Buy):', error);
            }
        } catch (adminEmailError) {
            console.error('Admin Email Exception:', adminEmailError);
        }

        return { success: true, message: 'Request sent successfully!' };
    } catch (error: any) {
        console.error('Server Action Error:', error);
        return { success: false, message: `Error de red: ${error.message}` };
    }
}
