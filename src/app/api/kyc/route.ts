import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const formType = payload.formType;

        const url = formType === 'Persona Física'
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/public/kyc/fisica/`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/public/kyc/juridica/`;

        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Django Error (${response.status}):`, errorText);
            return NextResponse.json({ success: false, error: errorText }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error("KYC API Route Error:", error);
        return NextResponse.json({ success: false, error: 'Failed to process request in Next.js Server.' }, { status: 500 });
    }
}
