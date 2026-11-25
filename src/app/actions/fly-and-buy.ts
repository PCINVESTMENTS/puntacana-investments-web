'use server'

import { headers } from 'next/headers';
import { Resend } from 'resend';
import { createHubspotContact } from '@/lib/hubspot';
import {
    buildFlyAndBuyEmails,
    generateReferenceCode,
    getTeamRecipients,
    isLocalDryRunEnabled,
    normalizeLang,
    recordLocalDryRunEmail,
    resolveSiteOrigin,
} from '@/lib/formEmails';

function getResend(): Resend {
    return new Resend(process.env.RESEND_API_KEY);
}

export async function submitFlyAndBuyForm(prevState: any, formData: FormData) {
    // Obligamos a la acción a ir directo a Railway, ignorando NEXT_PUBLIC_API_URL de Vercel.
    const apiUrl = "https://puntacana-fortress-production.up.railway.app";

    // Extract data from FormData
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const country = String(formData.get('country') || '').trim();
    const comments = String(formData.get('comments') || '').trim();
    const lang = normalizeLang(formData.get('lang'), 'es');

    // Additional fields
    const experience = String(formData.get('experience') || 'N/A');
    const horizon = String(formData.get('horizon') || 'N/A');
    const visited = String(formData.get('visited') || 'N/A');

    // Arrays for multiple checkboxes
    const objectivesList = formData.getAll('objective').map((v) => String(v));
    const propertyTypesList = formData.getAll('propertyType').map((v) => String(v));
    const investmentFocusList = formData.getAll('investmentFocus').map((v) => String(v));
    const motivationList = formData.getAll('motivation').map((v) => String(v));

    // Check dynamic select/input correctly
    const propertySelection = String(formData.get('specificPropertySelect') || '');
    const propertyInput = String(formData.get('specificPropertyName') || '');
    const specificProperty =
        propertySelection === 'other' || !propertySelection ? propertyInput : propertySelection;

    const referenceCode = generateReferenceCode('FB');
    const reqHeaders = await headers();
    const siteOrigin = resolveSiteOrigin(reqHeaders);

    const { adminEmail, clientEmail, questionnaireEs } = buildFlyAndBuyEmails({
        referenceCode,
        lang,
        name,
        email,
        phone,
        country,
        proposedDates: 'Por Definir',
        objectives: objectivesList,
        propertyTypes: propertyTypesList,
        investmentFocus: investmentFocusList,
        experience,
        horizon,
        visited,
        motivation: motivationList,
        specificProperty,
        comments,
    });

    const teamRecipients = getTeamRecipients();

    // Local isolated dry-run mode (never active on Vercel / production)
    if (isLocalDryRunEnabled()) {
        recordLocalDryRunEmail({
            recordedAt: new Date().toISOString(),
            flow: 'fly_and_buy',
            referenceCode,
            lang,
            siteOrigin,
            adminEmail: {
                ...adminEmail,
                recipients: teamRecipients,
            },
            clientEmail,
        });

        return {
            success: true,
            message: 'Request sent successfully!',
            referenceCode,
        };
    }

    const readableNotes = [
        `[Ref: ${referenceCode}]`,
        `Comentarios (${lang.toUpperCase()}): ${comments || 'Sin comentarios'}`,
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

    const cleanedApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    try {
        const res = await fetch(`${cleanedApiUrl}/api/public/fly-buy/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tripData),
        });

        // Cortocircuito de éxito inmediato si el servidor responde 200 o 201
        if (res.ok || res.status === 201 || res.status === 200) {
            // HubSpot API Integration (Background sync)
            try {
                await createHubspotContact({
                    email,
                    firstname: name.split(' ')[0],
                    lastname: name.split(' ').slice(1).join(' '),
                    phone,
                    message: tripData.notes,
                    form_source: "Fly & Buy Form",
                });
            } catch (hsError) {
                console.error("HubSpot sync failed in Fly&Buy form:", hsError);
            }

            const resend = getResend();

            // Send localized Auto-Responder Confirmation to CLIENT via Resend (same referenceCode)
            try {
                const { error } = await resend.emails.send({
                    from: clientEmail.from,
                    to: [clientEmail.to],
                    subject: clientEmail.subject,
                    html: clientEmail.html,
                    text: clientEmail.text,
                });

                if (error) {
                    console.error("Resend internal autoresponder failed:", error);
                }
            } catch (emailErr: any) {
                console.error("Resend internal autoresponder exception:", emailErr);
            }

            // Send Spanish-labeled Admin Notification Email to TEAM via Resend (same referenceCode)
            try {
                const { error } = await resend.emails.send({
                    from: adminEmail.from,
                    to: teamRecipients,
                    subject: adminEmail.subject,
                    html: adminEmail.html,
                    text: adminEmail.text,
                });

                if (error) {
                    console.error("Resend Admin notification failed (Fly&Buy):", error);
                }
            } catch (adminEmailError) {
                console.error("Admin Email Exception:", adminEmailError);
            }

            return {
                success: true,
                message: 'Request sent successfully!',
                referenceCode,
            };
        }

        const errorText = await res.text();
        console.error("Backend Error:", res.status, errorText);
        return { success: false, message: `Rechazado por el servidor: ${res.status} - ${errorText}` };
    } catch (error: any) {
        console.error("Server Action Error:", error);
        return { success: false, message: `Error de red: ${error.message}` };
    }
}
