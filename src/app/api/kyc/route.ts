import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const formType = formData.get('formType') as string;
        
        let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://puntacana-fortress-production.up.railway.app';
        if (apiUrl === 'undefined' || apiUrl === 'null') {
            apiUrl = 'https://puntacana-fortress-production.up.railway.app';
        }
        if (apiUrl.endsWith('/')) {
            apiUrl = apiUrl.slice(0, -1);
        }

        const endpoint = formType === 'Persona Física'
            ? '/api/public/kyc/fisica/'
            : '/api/public/kyc/juridica/';
            
        const url = `${apiUrl}${endpoint}`;

        // Create a new FormData to send to Django, excluding internal tracking fields
        const djangoFormData = new FormData();
        
        let subjectName = '';

        for (const [key, value] of formData.entries()) {
            if (key === 'formType') continue; // Skip internal routing field
            if (key === 'nombres' || key === 'razon_social') {
                subjectName = value.toString();
            }
            if (key === 'apellidos') {
                subjectName += ' ' + value.toString();
            }
            djangoFormData.append(key, value);
        }

        const response = await fetch(url, {
            method: 'POST',
            body: djangoFormData,
            headers: {
                'Accept': 'application/json',
                'X-API-KEY': process.env.API_SHARED_SECRET || '',
                // Fetch automatically sets Content-Type to multipart/form-data with boundary when body is FormData
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Django Error (${response.status}):`, errorText);
            return NextResponse.json({ success: false, error: errorText }, { status: response.status });
        }

        const data = await response.json();

        try {
            await resend.emails.send({
                from: 'Punta Cana Investments <onboarding@resend.dev>',
                to: ['info@puntacanainvestmentsrd.com'],
                subject: `Nuevo KYC Recibido: ${subjectName.trim()}`,
                html: `
                    <h1>Formulario KYC - Debida Diligencia</h1>
                    <p>Un nuevo formulario de <strong>${formType}</strong> ha sido completado y procesado de forma segura.</p>
                    <p>Los datos sensibles y documentos han sido almacenados de manera protegida bajo cifrado en la <strong>Bóveda Segura de Fortress CRM</strong>.</p>
                    <p>Ya puede revisarlo internamente a través de su Dashboard Administrativo en el Módulo de Due Diligence.</p>
                `
            });
        } catch (e) {
            console.error("Resend notification failed:", e);
        }

        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error("KYC API Route Error:", error);
        return NextResponse.json({ success: false, error: 'Failed to process request in Next.js Server.' }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ error: "Restricted Method. Endpoint configured for POST architecture strictly." }, { status: 405 });
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Allow': 'POST, OPTIONS'
        }
    });
}
