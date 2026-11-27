'use server'

import { headers } from 'next/headers';
import { Resend } from 'resend';
import { createHubspotContact } from '@/lib/hubspot';
import {
    appendSandboxFlyAndBuyLead,
    dispatchCloudStagingStage2Emails,
    fetchLocalSandboxPhase8,
    getPhase4BackendBaseUrl,
    getServerStagingApiKey,
    isCloudStagingBackend,
    isCloudStagingRealAllowlistMode,
    isLocalFileSandbox,
    isLocalSandboxEnabled,
    linkSandboxFlyAndBuyCrmInquiry,
    recordLocalServerOutboundEvent,
} from '@/lib/localSandbox';
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

    // Respect Fly & Buy open/closed toggle from Gestor Web (both local sandbox & Cloud Staging/Production)
    if (isLocalSandboxEnabled()) {
        const phase8 = await fetchLocalSandboxPhase8();
        if (phase8?.fly_and_buy?.show_form === false) {
            return {
                success: false,
                closed: true,
                sandbox_isolated: isLocalFileSandbox(),
                message:
                    safeLang === 'en'
                        ? 'Fly & Buy intake is currently closed. Your request could not be submitted.'
                        : safeLang === 'fr'
                        ? 'La réception des demandes Fly & Buy est actuellement fermée. Votre demande n’a pas été envoyée.'
                        : 'La recepción de solicitudes Fly & Buy está cerrada actualmente. Tu solicitud no fue registrada.',
            };
        }
    }

    // ISOLATED LOCAL SANDBOX INTERCEPTOR (local disk mirror + M04 CRM V2 local ingest; ZERO real emails, ZERO HubSpot):
    if (isLocalFileSandbox()) {
        let capturedQuestionnaireEs: Array<{ label: string; value: string }> = [];

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
                    '1 solicitud Fly & Buy = 1 consulta M04 + 1 registro Fly & Buy + 1 aviso simulado PCI (cuestionario en español)',
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
                capturedQuestionnaireEs = built.questionnaireEs || [];
                return {
                    admin_subject: built.adminEmail.subject,
                    client_subject: built.clientEmail.subject,
                    admin_email: built.adminEmail,
                    client_email: built.clientEmail,
                    questionnaire_es: built.questionnaireEs,
                };
            }
        );

        // Also ingest idempotently into isolated local CRM V2 M04 LeadInquiry so it lands in the advisor inbox
        let crmIngest: {
            created?: boolean;
            deduplicated?: boolean;
            notification_sent?: boolean;
            inquiry?: { id?: number; inquiry_code?: string };
        } | null = null;
        const localBackendBase = getPhase4BackendBaseUrl();
        const localApiKey = String(process.env.API_SHARED_SECRET || process.env.DASHBOARD_AUTH_API_KEY || '').trim();
        if (
            localBackendBase &&
            (localBackendBase.startsWith('http://127.0.0.1:') || localBackendBase.startsWith('http://localhost:')) &&
            localApiKey
        ) {
            try {
                const readableNotesEs = [
                    `[Solicitud VIP Fly & Buy · Ref Web: ${saved?.reference_code || 'LOCAL'}]`,
                    `País de origen: ${country || 'Por definir'}`,
                    ...capturedQuestionnaireEs.map((item) => `${item.label}: ${item.value}`),
                    `Comentarios (${safeLang.toUpperCase()}): ${comments || 'Sin comentarios'}`,
                ].join('\n');

                const propCodeMatch = /^\[([A-Z0-9-]+)\]\s*(.*)$/i.exec(specificProperty || '');
                const extractedPropCode = propCodeMatch ? propCodeMatch[1].trim() : '';
                const cleanPropTitle = propCodeMatch ? propCodeMatch[2].trim() : specificProperty;

                const ingestUrl = `${localBackendBase}/api/crm-v2/lead-inquiries/ingest/`;
                const ingestRes = await fetch(ingestUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-KEY': localApiKey,
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        phone,
                        country,
                        lang: safeLang,
                        channel: 'fly_buy',
                        origin_label: 'Solicitud VIP Fly & Buy',
                        company_code: 'PCI-RE',
                        source_page: `/${safeLang}/fly-and-buy/form`,
                        subject: `Solicitud VIP Fly & Buy · ${specificProperty || 'Tour Inmobiliario Personalizado'}`,
                        message: readableNotesEs,
                        property_title: cleanPropTitle || '',
                        property: extractedPropCode
                            ? { internal_code: extractedPropCode, title: cleanPropTitle }
                            : undefined,
                        reference_code: saved?.reference_code || '',
                        metadata: {
                            web_reference_code: saved?.reference_code || '',
                            fly_buy_reference_code: saved?.reference_code || '',
                            specific_property: specificProperty || '',
                            questionnaire_es: capturedQuestionnaireEs,
                            experience,
                            horizon,
                            visited,
                            objectives: objectivesArr,
                            property_types: propertyTypesArr,
                            investment_focus: investmentFocusArr,
                            motivation: motivationArr,
                        },
                    }),
                    cache: 'no-store',
                });
                if (ingestRes.ok) {
                    crmIngest = await ingestRes.json();
                    if (saved?.id) {
                        linkSandboxFlyAndBuyCrmInquiry(
                            saved.id,
                            crmIngest?.inquiry?.id || null,
                            crmIngest?.inquiry?.inquiry_code || null,
                            readableNotesEs
                        );
                    }
                } else {
                    console.warn('Local M04 Fly & Buy ingest non-OK:', ingestRes.status);
                }
                recordLocalServerOutboundEvent({
                    flow: 'fly_and_buy',
                    provider: 'local_crm_v2',
                    target_url: ingestUrl,
                    method: 'POST',
                    blocked: false,
                    simulated: false,
                    status_code: ingestRes.status,
                    reference_code: saved?.reference_code || '',
                    crm_inquiry_code: crmIngest?.inquiry?.inquiry_code || '',
                    reason: 'LOCAL_M04_INGEST',
                });
            } catch (ingestErr) {
                console.warn('Local M04 Fly & Buy ingest skipped:', ingestErr);
            }
        }

        // Explicitly audit that HubSpot was blocked and Resend stayed in local simulation
        recordLocalServerOutboundEvent({
            flow: 'fly_and_buy',
            provider: 'hubspot',
            target_url: 'https://api.hubapi.com/crm/v3/objects/contacts',
            method: 'POST',
            blocked: true,
            simulated: false,
            status_code: 0,
            reference_code: saved?.reference_code || '',
            crm_inquiry_code: crmIngest?.inquiry?.inquiry_code || '',
            reason: 'HUBSPOT_DISABLED_LOCAL',
        });
        recordLocalServerOutboundEvent({
            flow: 'fly_and_buy',
            provider: 'resend',
            target_url: 'https://api.resend.com/emails',
            method: 'POST',
            blocked: true,
            simulated: true,
            status_code: 0,
            reference_code: saved?.reference_code || '',
            crm_inquiry_code: crmIngest?.inquiry?.inquiry_code || '',
            reason: 'RESEND_SIMULATED_LOCAL_OUTBOX',
        });

        const effectiveRef = crmIngest?.inquiry?.inquiry_code || saved?.reference_code || 'LOCAL';
        return {
            success: true,
            sandbox_isolated: true,
            reference_code: effectiveRef,
            web_reference_code: saved?.reference_code || '',
            crm_inquiry_id: crmIngest?.inquiry?.id || null,
            email_sent: false,
            message:
                safeLang === 'en'
                    ? `Fly & Buy application recorded in M04 CRM under ${effectiveRef} (Web Ref: ${saved?.reference_code || 'LOCAL'}, no real email dispatched).`
                    : safeLang === 'fr'
                    ? `Demande Fly & Buy enregistrée dans le CRM M04 sous ${effectiveRef} (Réf. Web : ${saved?.reference_code || 'LOCAL'}, aucun e-mail réel envoyé).`
                    : `Solicitud Fly & Buy registrada en M04 Leads y Buzón Fly & Buy bajo ${effectiveRef} (Ref. web: ${saved?.reference_code || 'LOCAL'}, sin envío de correo real).`,
        };
    }

    // CLOUD STAGING (Stage 1 simulated OR Stage 2 real-Resend allowlist -> Railway Staging PostgreSQL; 0 HubSpot)
    if (isCloudStagingBackend()) {
        const isStage2Real = isCloudStagingRealAllowlistMode();
        let stage2Policy: ReturnType<typeof resolveExecutionPolicy> | null = null;
        if (isStage2Real) {
            stage2Policy = resolveExecutionPolicy(email);
            if (!stage2Policy.allowed) {
                console.error(`[Stage2 FlyBuy Fail-Closed:${stage2Policy.code}] ${stage2Policy.error}`);
                return {
                    success: false,
                    message: stage2Policy.error,
                };
            }
        }
        const builtPreview = buildFlyAndBuyEmails({
            referenceCode: 'FB-STG',
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
        const backendBase = getPhase4BackendBaseUrl();
        const apiKey = getServerStagingApiKey();
        const resp = await fetch(`${backendBase}/api/phase8-sandbox/fly-buy-leads/submit/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': apiKey,
            },
            body: JSON.stringify({
                name,
                email,
                phone,
                country,
                comments,
                specific_property: specificProperty,
                questionnaire_es: builtPreview.questionnaireEs || [],
                experience,
                horizon,
                visited,
                objectives: objectivesArr,
                property_types: propertyTypesArr,
                investment_focus: investmentFocusArr,
                motivation: motivationArr,
                lang: safeLang,
            }),
            cache: 'no-store',
        });
        const json = await resp.json().catch(() => ({}));
        if (!resp.ok || !json.success) {
            return {
                success: false,
                message: json.error || 'No se pudo registrar la solicitud Fly & Buy en Staging.',
            };
        }
        const effectiveRef = json.reference_code || json.crm_inquiry_code || json.web_reference_code || 'FB-STG';
        if (isStage2Real && stage2Policy && stage2Policy.allowed) {
            const finalBuilt = buildFlyAndBuyEmails({
                referenceCode: effectiveRef,
                lang: safeLang,
                name,
                email: stage2Policy.clientRecipient,
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
            const sent = await dispatchCloudStagingStage2Emails({
                flow: 'fly_and_buy',
                referenceCode: effectiveRef,
                crmInquiryCode: json.crm_inquiry_code || effectiveRef,
                lang: safeLang,
                teamRecipients: stage2Policy.teamRecipients,
                clientRecipient: stage2Policy.clientRecipient,
                adminEmail: finalBuilt.adminEmail,
                clientEmail: finalBuilt.clientEmail,
            });
            return {
                success: true,
                sandbox_isolated: false,
                reference_code: effectiveRef,
                web_reference_code: json.web_reference_code || '',
                crm_inquiry_id: json.crm_inquiry_id || null,
                email_sent: sent.clientAccepted,
                resend_ids: { admin: sent.adminResendId, client: sent.clientResendId },
                message: sent.clientAccepted
                    ? safeLang === 'en'
                        ? `Fly & Buy application registered under ${effectiveRef} (Web Ref: ${json.web_reference_code || 'FB-STG'}). Confirmation email sent.`
                        : safeLang === 'fr'
                        ? `Demande Fly & Buy enregistrée sous ${effectiveRef} (Réf. Web : ${json.web_reference_code || 'FB-STG'}). E-mail de confirmation envoyé.`
                        : `Solicitud Fly & Buy registrada bajo ${effectiveRef} (Ref. web: ${json.web_reference_code || 'FB-STG'}). Te enviamos un correo de confirmación.`
                    : safeLang === 'en'
                    ? `Fly & Buy application registered under ${effectiveRef} (confirmation email could not be delivered right now).`
                    : safeLang === 'fr'
                    ? `Demande Fly & Buy enregistrée sous ${effectiveRef} (l'e-mail de confirmation n'a pas pu être envoyé).`
                    : `Solicitud Fly & Buy registrada bajo ${effectiveRef} (el correo de confirmación no pudo enviarse en este momento).`,
            };
        }
        return {
            success: true,
            sandbox_isolated: true,
            reference_code: effectiveRef,
            web_reference_code: json.web_reference_code || '',
            crm_inquiry_id: json.crm_inquiry_id || null,
            email_sent: false,
            message:
                safeLang === 'en'
                    ? `Fly & Buy application recorded in M04 CRM under ${effectiveRef} (Web Ref: ${json.web_reference_code || 'FB-STG'}, simulated Stage 1: 0 real emails dispatched).`
                    : safeLang === 'fr'
                    ? `Demande Fly & Buy enregistrée dans le CRM M04 sous ${effectiveRef} (Réf. Web : ${json.web_reference_code || 'FB-STG'}, mode simulé Étape 1 : 0 e-mail réel envoyé).`
                    : `Solicitud Fly & Buy registrada en M04 Leads y Buzón Fly & Buy bajo ${effectiveRef} (Ref. web: ${json.web_reference_code || 'FB-STG'}, Etapa A simulada: 0 correos externos enviados).`,
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
