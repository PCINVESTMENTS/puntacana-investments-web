'use server'

import { headers } from 'next/headers';
import { Resend } from 'resend';
import { createHubspotContact } from '@/lib/hubspot';
import { appendSandboxTestInboxEntry, getPhase4BackendBaseUrl, isLocalFileSandbox, recordLocalServerOutboundEvent } from '@/lib/localSandbox';
import {
    buildOffMarketEmails,
    buildPropertyOrHotelEmails,
    generateReferenceCode,
    isHotelOrCommercialAsset,
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

export async function submitContactForm(prevState: any, formData: FormData) {
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const lang = normalizeLang(formData.get('lang'), 'en');

    const validationError =
        lang === 'es'
            ? 'Por favor complete todos los campos requeridos.'
            : lang === 'fr'
            ? 'Veuillez remplir tous les champs obligatoires.'
            : 'Please fill in all required fields.';

    if (!name || !email || !phone || !message) {
        return {
            success: false,
            message: validationError,
        };
    }

    // Silent antispam + self-domain bounce shield: stops BEFORE sandbox, Preview guard, CRM, or Resend
    const { honeypot, formLoadedAt } = extractAntispamFromFormData(formData);
    const antispam = evaluateFormAntispam({
        email,
        honeypot,
        formLoadedAt,
        lang,
        sourceLabel: 'ContactForm',
    });
    if (antispam.action === 'silent_drop') {
        console.warn(antispam.logMessage);
        return {
            success: true,
            message: 'Message sent successfully!',
        };
    }
    if (antispam.action === 'reject') {
        console.warn(antispam.logMessage);
        return {
            success: false,
            message: antispam.errorMessage,
        };
    }

    const subjectInput = String(formData.get('subject') || '').trim();
    const propertyDataStr = String(formData.get('propertyData') || '').trim();
    const offMarketDataStr = String(formData.get('offMarketData') || '').trim();

    let parsedProperty: {
        id?: number | string | null;
        technicalId?: number | string | null;
        idSource?: string | null;
        permanentCode?: string | null;
        internal_code?: string | null;
        code?: string | null;
        slug?: string | null;
        title?: string | null;
        location?: string | null;
        price?: number | null;
        isStartingPrice?: boolean | null;
        area?: number | null;
        type?: string | null;
    } | null = null;

    if (propertyDataStr) {
        try {
            parsedProperty = JSON.parse(propertyDataStr);
        } catch {
            parsedProperty = null;
        }
    }

    let parsedOffMarket: {
        tab?: 'oportunidad' | 'hoteles';
        company?: string;
        budget?: string;
        regions?: string[];
        details?: Record<string, string>;
        freeText?: string;
    } | null = null;

    if (offMarketDataStr) {
        try {
            parsedOffMarket = JSON.parse(offMarketDataStr);
        } catch {
            parsedOffMarket = null;
        }
    }

    const reqHeaders = await headers();
    const siteOrigin = resolveSiteOrigin(reqHeaders);

    const isOffMarketFlow = Boolean(parsedOffMarket);
    const isHotelFlow =
        !isOffMarketFlow &&
        Boolean(parsedProperty) &&
        isHotelOrCommercialAsset(parsedProperty?.type, parsedProperty?.title, parsedProperty?.slug);
    const isPropertyFlow = !isOffMarketFlow && !isHotelFlow && Boolean(parsedProperty);

    const formCategory: 'property_inquiry' | 'hotel_inquiry' | 'general_contact' = isHotelFlow
        ? 'hotel_inquiry'
        : isPropertyFlow
        ? 'property_inquiry'
        : 'general_contact';

    const flowType: 'property_inquiry' | 'hotel_inquiry' | 'general_contact' | 'off_market' = isOffMarketFlow
        ? 'off_market'
        : formCategory;

    const cleanInterest = subjectInput
        ? subjectInput.replace(/^(Inquiry about|Consulta sobre|Demande concernant):\s*/i, '').trim()
        : 'General';

    // ISOLATED LOCAL SANDBOX INTERCEPTOR (local disk mirror + M04 CRM V2 local ingest; ZERO real emails, ZERO HubSpot):
    if (isLocalFileSandbox()) {
        // 1. Send idempotently to local isolated CRM V2 M04 LeadInquiry endpoint (when local backend is configured)
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
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        phone,
                        message,
                        subject: subjectInput || cleanInterest,
                        lang,
                        channel: isOffMarketFlow
                            ? 'off_market'
                            : isHotelFlow
                            ? 'hotel'
                            : 'website',
                        origin_label:
                            flowType === 'off_market'
                                ? 'Búsqueda Privada Off-Market'
                                : flowType === 'hotel_inquiry'
                                ? 'Consulta Directa de Hotel / Activo Comercial'
                                : flowType === 'property_inquiry'
                                ? 'Formulario Web · Propiedad'
                                : 'Formulario de Contacto General',
                        company_code: 'PCI-RE',
                        source_page: parsedProperty?.slug ? `/${lang}/properties/${parsedProperty.slug}` : `/${lang}/contact`,
                        property: parsedProperty
                            ? {
                                  canonical_key: (parsedProperty as any).canonical_key || '',
                                  internal_code: parsedProperty.internal_code || parsedProperty.permanentCode || parsedProperty.code || '',
                                  slug: parsedProperty.slug || '',
                                  code_number: (parsedProperty as any).code_number || null,
                              }
                            : undefined,
                    }),
                    cache: 'no-store',
                });
                if (ingestRes.ok) {
                    crmIngest = await ingestRes.json();
                } else {
                    console.warn('Local M04 ingest non-OK status:', ingestRes.status);
                }
                recordLocalServerOutboundEvent({
                    flow: flowType,
                    provider: 'local_crm_v2',
                    target_url: `${localBackendBase}/api/crm-v2/lead-inquiries/ingest/`,
                    method: 'POST',
                    blocked: false,
                    simulated: false,
                    status_code: ingestRes.status,
                    crm_inquiry_code: crmIngest?.inquiry?.inquiry_code || '',
                    reason: crmIngest?.deduplicated ? 'LOCAL_M04_DEDUPLICATED' : 'LOCAL_M04_INGEST',
                });
            } catch (ingestErr) {
                console.warn('Local M04 ingest skipped:', ingestErr);
            }
        }

        recordLocalServerOutboundEvent({
            flow: flowType,
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
            flow: flowType,
            provider: 'resend',
            target_url: 'https://api.resend.com/emails',
            method: 'POST',
            blocked: true,
            simulated: true,
            status_code: 0,
            crm_inquiry_code: crmIngest?.inquiry?.inquiry_code || '',
            reason: 'RESEND_SIMULATED_LOCAL_OUTBOX',
        });

        // If CRM V2 M04 deduplicated an identical retry, do NOT duplicate test_inbox notification
        if (crmIngest?.deduplicated && crmIngest?.inquiry?.inquiry_code) {
            return {
                success: true,
                sandbox_isolated: true,
                deduplicated: true,
                reference_code: crmIngest.inquiry.inquiry_code,
                email_sent: false,
                message:
                    lang === 'en'
                        ? `Duplicate submission detected: kept existing inquiry ${crmIngest.inquiry.inquiry_code} without duplicate notification (0 real emails sent).`
                        : lang === 'fr'
                        ? `Envoi en double détecté : demande existante ${crmIngest.inquiry.inquiry_code} conservée sans doublon (0 e-mail réel envoyé).`
                        : `Reintento detectado: se conservó la consulta existente ${crmIngest.inquiry.inquiry_code} sin generar duplicado ni segundo aviso (0 correos reales enviados).`,
            };
        }

        const saved = appendSandboxTestInboxEntry(
            {
                form_type: flowType,
                form_label:
                    flowType === 'off_market'
                        ? 'Búsqueda Privada Off-Market'
                        : flowType === 'hotel_inquiry'
                        ? 'Consulta Directa de Hotel / Activo Comercial'
                        : flowType === 'property_inquiry'
                        ? 'Consulta de Propiedad'
                        : 'Formulario de Contacto General',
                lang,
                configured_from: PCI_TEAM_FROM,
                configured_pci_recipient: PCI_TEAM_TO,
                client_autoresponder_to: email,
                crm_inquiry_id: crmIngest?.inquiry?.id || null,
                crm_inquiry_code: crmIngest?.inquiry?.inquiry_code || null,
                property_reference: parsedProperty || { title: cleanInterest, type: 'general' },
                lead: { name, email, phone, message },
                deduplication_note:
                    '1 envío = 1 consulta M04 + 1 aviso simulado PCI (sin correos reales ni HubSpot)',
            },
            (referenceCode) => {
                const effectiveRef = crmIngest?.inquiry?.inquiry_code || referenceCode;
                const built =
                    isOffMarketFlow && parsedOffMarket
                        ? buildOffMarketEmails({
                              referenceCode: effectiveRef,
                              lang,
                              name,
                              company: parsedOffMarket.company || '',
                              email,
                              phone,
                              tab: parsedOffMarket.tab === 'hoteles' ? 'hoteles' : 'oportunidad',
                              budget: parsedOffMarket.budget || '',
                              regions: Array.isArray(parsedOffMarket.regions) ? parsedOffMarket.regions : [],
                              details: parsedOffMarket.details || {},
                              freeText: parsedOffMarket.freeText || '',
                          })
                        : buildPropertyOrHotelEmails({
                              referenceCode: effectiveRef,
                              formCategory,
                              lang,
                              siteOrigin,
                              name,
                              email,
                              phone,
                              message,
                              interestText: cleanInterest,
                              property: parsedProperty,
                          });
                return {
                    admin_subject: built.adminEmail.subject,
                    client_subject: built.clientEmail.subject,
                    admin_email: built.adminEmail,
                    client_email: built.clientEmail,
                    property_reference: parsedProperty
                        ? { ...parsedProperty, url: 'propertyUrl' in built ? built.propertyUrl : '' }
                        : { title: cleanInterest, type: 'general' },
                };
            }
        );

        const finalRef = crmIngest?.inquiry?.inquiry_code || saved?.reference_code || 'LOCAL';
        return {
            success: true,
            sandbox_isolated: true,
            reference_code: finalRef,
            crm_inquiry_id: crmIngest?.inquiry?.id || null,
            email_sent: false,
            message:
                lang === 'en'
                    ? `Inquiry registered in M04 CRM local sandbox under ${finalRef} (no real email dispatched).`
                    : lang === 'fr'
                    ? `Demande enregistrée dans le CRM local M04 sous ${finalRef} (aucun e-mail réel envoyé).`
                    : `Consulta registrada en M04 Leads bajo ${finalRef} con aviso simulado local (sin envío de correo real).`,
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

    const referenceCode = generateReferenceCode(
        isOffMarketFlow ? 'OM' : isHotelFlow ? 'HTL' : isPropertyFlow ? 'INQ' : 'CNT'
    );

    const emailBundle =
        isOffMarketFlow && parsedOffMarket
            ? {
                  ...buildOffMarketEmails({
                      referenceCode,
                      lang,
                      name,
                      company: parsedOffMarket.company || '',
                      email: policy.clientRecipient,
                      phone,
                      tab: parsedOffMarket.tab === 'hoteles' ? 'hoteles' : 'oportunidad',
                      budget: parsedOffMarket.budget || '',
                      regions: Array.isArray(parsedOffMarket.regions) ? parsedOffMarket.regions : [],
                      details: parsedOffMarket.details || {},
                      freeText: parsedOffMarket.freeText || '',
                  }),
                  propertyUrl: '',
              }
            : buildPropertyOrHotelEmails({
                  referenceCode,
                  formCategory,
                  lang,
                  siteOrigin,
                  name,
                  email: policy.clientRecipient,
                  phone,
                  message,
                  interestText: cleanInterest,
                  property: parsedProperty,
              });

    if (policy.mode === 'local_dry_run') {
        recordLocalDryRunEmail({
            recordedAt: new Date().toISOString(),
            flow: flowType,
            referenceCode,
            lang,
            siteOrigin,
            propertyUrl: emailBundle.propertyUrl || undefined,
            railwayMode: policy.railwayMode,
            hubspotMode: policy.hubspotMode,
            adminEmail: {
                ...emailBundle.adminEmail,
                recipients: policy.teamRecipients,
            },
            clientEmail: emailBundle.clientEmail,
        });

        return {
            success: true,
            message: 'Message sent successfully!',
        };
    }

    try {
        const crmMessage = `[Ref: ${referenceCode}] ${message}`;

        if (policy.railwayMode === 'simulated') {
            console.log(`[PREVIEW-SIMULATED] Railway /api/public/leads/ skipped [${referenceCode}]`);
        } else if (policy.railwayApiUrl) {
            const backendData = {
                first_name: name.split(' ')[0],
                last_name: name.split(' ').slice(1).join(' ') || '.',
                email,
                phone,
                message: crmMessage,
                source: 'Website Contact Form',
                interest: cleanInterest,
            };

            try {
                const res = await fetch(`${policy.railwayApiUrl}/api/public/leads/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(backendData),
                });

                if (!res.ok) {
                    const errText = await res.text();
                    console.error('CRITICAL: Backend rejected the Lead payload:', errText);
                    throw new Error(`Backend Validation Error: ${res.status} - ${errText}`);
                }
                console.log(`Lead saved to Backend successfully [${referenceCode}]`);
            } catch (backendError) {
                console.error('FATAL: Cannot reach Backend or payload rejected:', backendError);
                return {
                    success: false,
                    message:
                        'Error de conexión con el servidor principal. ' +
                        (backendError instanceof Error ? backendError.message : 'Fallo desconocido.'),
                };
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
                    message: crmMessage,
                    form_source: 'Website Contact Form',
                });
            } catch (hsError) {
                console.error('HubSpot sync failed in contact form:', hsError);
            }
        }

        const resend = getResend();

        try {
            const clientEmailRes = await resend.emails.send({
                from: emailBundle.clientEmail.from,
                to: [policy.clientRecipient],
                subject: emailBundle.clientEmail.subject,
                html: emailBundle.clientEmail.html,
                text: emailBundle.clientEmail.text,
            });
            if (clientEmailRes.error) {
                console.error('Resend Error (Client Autoresponder):', clientEmailRes.error);
            }
        } catch (autoResponderError: any) {
            console.error('Client Autoresponder Exception:', autoResponderError);
        }

        try {
            const adminEmailRes = await resend.emails.send({
                from: emailBundle.adminEmail.from,
                to: policy.teamRecipients,
                subject: emailBundle.adminEmail.subject,
                html: emailBundle.adminEmail.html,
                text: emailBundle.adminEmail.text,
            });
            if (adminEmailRes.error) {
                console.error('Resend Error (Admin Notification):', adminEmailRes.error);
            }
        } catch (adminEmailError) {
            console.error('Admin Email Exception:', adminEmailError);
        }

        return {
            success: true,
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
