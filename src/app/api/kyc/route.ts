import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
    buildKycEmails,
    generateReferenceCode,
    normalizeLang,
    resolveExecutionPolicy,
} from '@/lib/formEmails';
import {
    evaluateFormAntispam,
    extractAntispamFromFormData,
} from '@/lib/formSecurity';

function getResend(): Resend {
    return new Resend(process.env.RESEND_API_KEY);
}

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const rawFormType = String(formData.get('formType') || 'Persona Física');
        const entityType: 'Persona Física' | 'Persona Jurídica' =
            rawFormType.toLowerCase().includes('jur') ? 'Persona Jurídica' : 'Persona Física';
        const lang = normalizeLang(formData.get('lang'), 'es');

        const clientEmail = String(
            entityType === 'Persona Física'
                ? formData.get('email') || ''
                : formData.get('rep_email') || formData.get('legalRepEmail') || ''
        ).trim();

        const { honeypot, formLoadedAt } = extractAntispamFromFormData(formData);
        const antispam = evaluateFormAntispam({
            email: clientEmail,
            honeypot,
            formLoadedAt,
            lang,
            sourceLabel: `API KYC (${entityType})`,
        });
        if (antispam.action === 'silent_drop') {
            console.warn(antispam.logMessage);
            return NextResponse.json({ success: true });
        }
        if (antispam.action === 'reject') {
            console.warn(antispam.logMessage);
            return NextResponse.json({ success: false, error: antispam.errorMessage }, { status: 400 });
        }

        const policy = resolveExecutionPolicy(clientEmail);
        if (!policy.allowed) {
            console.error(`[FormEmails:${policy.code}] ${policy.error}`);
            return NextResponse.json({ success: false, error: policy.error }, { status: 403 });
        }

        const referenceCode = generateReferenceCode('KYC');
        const endpoint =
            entityType === 'Persona Física' ? '/api/public/kyc/fisica/' : '/api/public/kyc/juridica/';

        // Build FormData for Django excluding internal routing/antispam fields
        const djangoFormData = new FormData();
        let subjectName = '';

        for (const [key, value] of formData.entries()) {
            if (['formType', 'lang', 'website_url', 'form_loaded_at'].includes(key)) continue;
            if (key === 'nombres' || key === 'razon_social') {
                subjectName = value.toString();
            }
            if (key === 'apellidos') {
                subjectName += ' ' + value.toString();
            }
            djangoFormData.append(key, value);
        }

        let data: any = { simulated: true, referenceCode };

        if (policy.railwayMode === 'simulated') {
            console.log(`[PREVIEW-SIMULATED] Railway ${endpoint} skipped [${referenceCode}]`);
        } else if (policy.railwayApiUrl) {
            const response = await fetch(`${policy.railwayApiUrl}${endpoint}`, {
                method: 'POST',
                body: djangoFormData,
                headers: {
                    Accept: 'application/json',
                    'X-API-KEY': process.env.API_SHARED_SECRET || '',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Django Error (${response.status}):`, errorText);
                return NextResponse.json({ success: false, error: errorText }, { status: response.status });
            }

            data = await response.json();
        }

        const emailBundle = buildKycEmails({
            referenceCode,
            lang,
            entityType,
            subjectName: subjectName.trim(),
            clientEmail: policy.clientRecipient,
        });

        if (policy.mode !== 'local_dry_run') {
            const resend = getResend();
            try {
                await resend.emails.send({
                    from: emailBundle.adminEmail.from,
                    to: policy.teamRecipients,
                    subject: emailBundle.adminEmail.subject,
                    html: emailBundle.adminEmail.html,
                    text: emailBundle.adminEmail.text,
                });
            } catch (e) {
                console.error('Resend KYC Admin notification failed:', e);
            }
        }

        return NextResponse.json({ success: true, referenceCode, data });
    } catch (error) {
        console.error('KYC API Route Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to process request in Next.js Server.' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json(
        { error: 'Restricted Method. Endpoint configured for POST architecture strictly.' },
        { status: 405 }
    );
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            Allow: 'POST, OPTIONS',
        },
    });
}
