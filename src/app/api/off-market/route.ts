import { NextResponse } from 'next/server';
import { isLocalSandboxEnabled, upsertSandboxOffMarketApplication } from '@/lib/localSandbox';
import { submitContactForm } from '@/app/actions/contact';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const name = String(body.fullName || body.name || '').trim();
        const company = String(body.companyName || body.company || '').trim();
        const email = String(body.email || '').trim();
        const phone = String(body.phone || '').trim();
        const tab = body.activeTab === 'hoteles' ? 'hoteles' : 'oportunidad';
        const budget = String(body.budget || '').trim();
        const regions = Array.isArray(body.regions) ? body.regions.map(String) : [];
        const details = body.details && typeof body.details === 'object' ? body.details : {};
        const compiledMessage = String(body.compiledMessage || '').trim();
        const lang = ['es', 'en', 'fr'].includes(String(body.lang || '').toLowerCase())
            ? String(body.lang).toLowerCase()
            : 'es';
        const idempotencyKey = String(body.idempotency_key || request.headers.get('x-idempotency-key') || '').trim();
        const simulateEmailFailure = Boolean(
            body.simulate_email_failure ||
            request.headers.get('x-simulate-email-failure') === '1'
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

        // Production path falls back to submitContactForm
        const fd = new FormData();
        fd.append('name', name);
        fd.append('email', email);
        fd.append('phone', phone);
        fd.append('message', compiledMessage);
        fd.append('subject', 'Aplicación a Búsqueda Privada Off-Market');
        fd.append('lang', lang);
        const result = await submitContactForm(null, fd);
        return NextResponse.json(result, { status: result?.success ? 201 : 400 });
    } catch (error) {
        console.error('Off-Market API Error:', error);
        return NextResponse.json(
            { success: false, message: 'Error interno al procesar la solicitud Off-Market.' },
            { status: 500 }
        );
    }
}
