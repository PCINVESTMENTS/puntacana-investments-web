import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createHubspotContact } from '@/lib/hubspot';
import { isLocalSandboxEnabled, upsertSandboxOffMarketApplication } from '@/lib/localSandbox';
import { buildOffMarketEmails, generateProductionRefCode, normalizeLang } from '@/lib/formEmails';

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

        if (isLocalSandboxEnabled()) {
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

            const emailFailed = saved.email_status === 'failed_simulated';
            const message = emailFailed
                ? lang === 'en'
                    ? `Your Off-Market request was safely registered under reference ${saved.reference_code}. However, we could not send the confirmation email at this moment (simulated provider failure); our private investment committee already has your dossier.`
                    : lang === 'fr'
                    ? `Votre demande Off-Market a bien été enregistrée sous la référence ${saved.reference_code}. Toutefois, l'e-mail de confirmation n'a pas pu être envoyé pour le moment (panne simulée) ; notre comité d'investissement dispose déjà de votre dossier.`
                    : `Tu requerimiento Off-Market quedó guardado en el registro local bajo el código ${saved.reference_code}. Sin embargo, el correo de confirmación no pudo enviarse en este momento (fallo de correo simulado); nuestro comité privado ya recibió tu solicitud.`
                : lang === 'en'
                ? `Your Off-Market request has been registered locally under reference ${saved.reference_code} (isolated local mode: no real email dispatched).`
                : lang === 'fr'
                ? `Votre demande Off-Market a été enregistrée localement sous la référence ${saved.reference_code} (mode local isolé : aucun e-mail réel envoyé).`
                : `Tu requerimiento Off-Market quedó registrado en local bajo el código ${saved.reference_code} (modo local aislado: sin envío real de correo).`;

            return NextResponse.json(
                {
                    success: true,
                    sandbox_isolated: true,
                    id: saved.id,
                    reference_code: saved.reference_code,
                    deduplicated: saved.deduplicated,
                    email_sent: false,
                    email_failed: emailFailed,
                    email_status: saved.email_status,
                    email_error: saved.email_error,
                    message,
                },
                { status: saved.deduplicated ? 200 : 201 }
            );
        }

        // Production path: reuses exact same Railway /api/public/leads/, HubSpot, and Resend integration
        const referenceCode = generateProductionRefCode('OM');
        const built = buildOffMarketEmails({
            referenceCode,
            lang,
            name,
            company,
            email,
            phone,
            tab,
            budget,
            regions,
            details,
            freeText,
        });

        const apiUrl = 'https://puntacana-fortress-production.up.railway.app';
        const leadRes = await fetch(`${apiUrl}/api/public/leads/`, {
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

        // Client Autoresponder (ES/EN/FR + matching referenceCode) via existing Resend integration
        try {
            const clientRes = await getResend().emails.send({
                from: built.clientEmail.from,
                to: [built.clientEmail.to],
                subject: built.clientEmail.subject,
                html: built.clientEmail.html,
                text: built.clientEmail.text,
            });
            if (clientRes.error) console.error('Resend Error (Off-Market Client):', clientRes.error);
        } catch (err) {
            console.error('Off-Market Client Autoresponder Exception:', err);
        }

        // Team Notification (Spanish structured choices + original free text + refCode) via existing Resend integration
        try {
            const adminRes = await getResend().emails.send({
                from: built.adminEmail.from,
                to: [built.adminEmail.to],
                subject: built.adminEmail.subject,
                html: built.adminEmail.html,
                text: built.adminEmail.text,
            });
            if (adminRes.error) console.error('Resend Error (Off-Market Admin):', adminRes.error);
        } catch (err) {
            console.error('Off-Market Admin Email Exception:', err);
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
