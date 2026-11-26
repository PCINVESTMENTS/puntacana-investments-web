'use server'

import { headers } from 'next/headers';
import { Resend } from 'resend';
import { createHubspotContact } from '@/lib/hubspot';
import {
    buildOffMarketEmails,
    buildPropertyOrHotelEmails,
    generateReferenceCode,
    isHotelOrCommercialAsset,
    normalizeLang,
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

    // Silent antispam + self-domain bounce shield: stops BEFORE Preview guard, CRM, or Resend
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

    // Fail-closed Preview guard: stops BEFORE any Railway, HubSpot, or Resend call
    const policy = resolveExecutionPolicy(email);
    if (!policy.allowed) {
        console.error(`[FormEmails:${policy.code}] ${policy.error}`);
        return {
            success: false,
            message: policy.error,
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

    const flowType: 'property_inquiry' | 'hotel_inquiry' | 'general_contact' | 'off_market' = isOffMarketFlow
        ? 'off_market'
        : isHotelFlow
        ? 'hotel_inquiry'
        : isPropertyFlow
        ? 'property_inquiry'
        : 'general_contact';

    const referenceCode = generateReferenceCode(
        isOffMarketFlow ? 'OM' : isHotelFlow ? 'HTL' : isPropertyFlow ? 'INQ' : 'CNT'
    );

    const cleanInterest = subjectInput
        ? subjectInput.replace(/^(Inquiry about|Consulta sobre|Demande concernant):\s*/i, '')
        : 'General';

    const emailBundle = isOffMarketFlow && parsedOffMarket
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
              formCategory: isHotelFlow ? 'hotel_inquiry' : isPropertyFlow ? 'property_inquiry' : 'general_contact',
              lang,
              siteOrigin,
              name,
              email: policy.clientRecipient,
              phone,
              message,
              interestText: cleanInterest,
              property: parsedProperty,
          });

    // Local isolated dry-run mode (never active on Vercel / production)
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

        // 1. Backend persistence: Production Railway in prod; isolated or simulated in Preview
        if (policy.railwayMode === 'simulated') {
            console.log(`[PREVIEW-SIMULATED] Railway /api/public/leads/ skipped [${referenceCode}]`);
        } else if (policy.railwayApiUrl) {
            const backendData = {
                first_name: name.split(' ')[0],
                last_name: name.split(' ').slice(1).join(' ') || '.',
                email,
                phone,
                message: crmMessage,
                source: "Website Contact Form",
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
                    console.error("CRITICAL: Backend rejected the Lead payload:", errText);
                    throw new Error(`Backend Validation Error: ${res.status} - ${errText}`);
                }
                console.log(`Lead saved to Backend successfully [${referenceCode}]`);
            } catch (backendError) {
                console.error("FATAL: Cannot reach Backend or payload rejected:", backendError);
                return {
                    success: false,
                    message:
                        'Error de conexión con el servidor principal. ' +
                        (backendError instanceof Error ? backendError.message : 'Fallo desconocido.'),
                };
            }
        }

        // HubSpot sync: Active in production; simulated/skipped in Preview
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
                    form_source: "Website Contact Form",
                });
            } catch (hsError) {
                console.error("HubSpot sync failed in contact form:", hsError);
            }
        }

        const resend = getResend();

        // 2. Send Auto-Responder Confirmation to CLIENT (same referenceCode, ES/EN/FR)
        try {
            const clientEmailRes = await resend.emails.send({
                from: emailBundle.clientEmail.from,
                to: [policy.clientRecipient],
                subject: emailBundle.clientEmail.subject,
                html: emailBundle.clientEmail.html,
                text: emailBundle.clientEmail.text,
            });

            if (clientEmailRes.error) {
                console.error("Resend Error (Client Autoresponder):", clientEmailRes.error);
            }
        } catch (autoResponderError: any) {
            console.error("Client Autoresponder Exception:", autoResponderError);
        }

        // 3. Send Single Consolidated Admin Notification Email to TEAM via Resend
        try {
            const adminEmailRes = await resend.emails.send({
                from: emailBundle.adminEmail.from,
                to: policy.teamRecipients,
                subject: emailBundle.adminEmail.subject,
                html: emailBundle.adminEmail.html,
                text: emailBundle.adminEmail.text,
            });

            if (adminEmailRes.error) {
                console.error("Resend Error (Admin Notification):", adminEmailRes.error);
            }
        } catch (adminEmailError) {
            console.error("Admin Email Exception:", adminEmailError);
        }

        return {
            success: true,
            message: 'Message sent successfully!',
        };
    } catch (error) {
        console.error("Server Error:", error);
        return {
            success: false,
            message: 'Internal server error. Please try again later.',
        };
    }
}
