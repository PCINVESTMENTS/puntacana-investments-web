import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const formType = payload.formType;

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

        const isFisica = formType === 'Persona Física';

        const mappedPayload: any = {
            ingreso_promedio: payload.monthlyIncome || payload.averageIncome,
            ingreso_anual: payload.annualIncome,
            equivalente_usd: payload.incomeUSD,
            es_pep: payload.isPEP === 'si',
            origen_fondos: payload.fundsOrigin,
            declaracion_jurada: payload.declaration1 === true || payload.declaration === true,
            firma_digital: payload.signature,
        };

        if (isFisica) {
            mappedPayload.nombres = payload.firstName;
            mappedPayload.apellidos = payload.lastName;
            mappedPayload.pasaporte_cedula = payload.idDocument;
            mappedPayload.nacionalidad = payload.nationality;
            mappedPayload.estado_civil = payload.maritalStatus;
            mappedPayload.fecha_nacimiento = payload.birthDate;
            mappedPayload.lugar_nacimiento = payload.birthPlace;
            mappedPayload.tel_residencia = payload.homePhone;
            mappedPayload.tel_celular = payload.mobilePhone1;
            mappedPayload.email = payload.email;
            mappedPayload.direccion = payload.address;
            mappedPayload.ciudad = payload.province || payload.city;
            mappedPayload.pais = payload.residenceCountry;
            mappedPayload.profesion_ocupacion = payload.profession;
            mappedPayload.lugar_trabajo = payload.company;
            mappedPayload.posicion = payload.position;
            mappedPayload.direccion_trabajo = payload.workAddress;
            mappedPayload.tel_trabajo = payload.workPhone;

            mappedPayload.doc_identidad_url = payload.identidadFile || null;
            mappedPayload.doc_estado_cuenta_url = payload.estadoCuentaFile || null;
            mappedPayload.doc_comprobante_domicilio_url = payload.comprobanteDomicilioFile || null;
            mappedPayload.doc_certificado_laboral_url = payload.certificadoLaboralFile || null;
        } else {
            mappedPayload.codigo_cliente = payload.customerCode;
            mappedPayload.razon_social = payload.companyName;
            mappedPayload.nombre_comercial = payload.commercialName;
            mappedPayload.fecha_constitucion = payload.incorporationDate;
            mappedPayload.pais_constitucion = payload.constitutionCountry;
            mappedPayload.ciudad = payload.city;
            mappedPayload.rnc = payload.rnc;
            mappedPayload.socios = [];

            mappedPayload.rep_nombres = payload.legalRepFirstName;
            mappedPayload.rep_apellidos = payload.legalRepLastName;
            mappedPayload.rep_id = payload.legalRepId;
            mappedPayload.rep_fecha_nacimiento = payload.legalRepBirthDate;
            mappedPayload.rep_direccion = payload.legalRepAddress;
            mappedPayload.rep_telefono = payload.legalRepPhone;
            mappedPayload.rep_email = payload.legalRepEmail;
            mappedPayload.rep_profesion = payload.legalRepProfession;
            mappedPayload.rep_cargo = payload.legalRepPosition;
            mappedPayload.rep_designacion = payload.legalRepDesignation;

            mappedPayload.doc_registro_mercantil_url = payload.commercialRegistryFile || null;
            mappedPayload.doc_rep_id_url = payload.legalRepIdFile || null;
            mappedPayload.doc_asamblea_url = payload.shareholderAssemblyFile || null;
            mappedPayload.doc_firmas_url = payload.authorizedSignaturesFile || null;
            mappedPayload.doc_nomina_socios_url = payload.shareholderListFile || null;
            mappedPayload.doc_estados_financieros_url = payload.financialStatementsFile || null;
        }

        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(mappedPayload),
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

        try {
            await resend.emails.send({
                from: 'Punta Cana Investments <onboarding@resend.dev>',
                to: ['info@puntacanainvestmentsrd.com'],
                subject: `Nuevo KYC Recibido: ${isFisica ? payload.firstName + ' ' + payload.lastName : payload.companyName}`,
                html: `
                    <h1>Formulario KYC - Debida Diligencia</h1>
                    <p>Un nuevo formulario de <strong>${formType}</strong> ha sido completado y subido correctamente a la bóveda de Sanity.</p>
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
