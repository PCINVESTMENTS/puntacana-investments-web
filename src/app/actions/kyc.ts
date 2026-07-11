'use server'

import { client } from '@/sanity/lib/client'
import { v4 as uuidv4 } from 'uuid'
import { Resend } from 'resend'
import { createHubspotContact } from '@/lib/hubspot'

// We need a client with a write token
const writeClient = client.withConfig({
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
})

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitKYCFromClient(formData: FormData) {
    try {
        const type = formData.get('formType') as string
        const isFisica = type === 'Persona Física'

        // The frontend now uploads directly to Sanity via /api/upload-sanity. 
        // We no longer receive File objects, but rather the string URLs returned by Sanity.
        const uploadedUrls: Record<string, string> = {}
        
        // Expected file fields depending on type
        const fisicaFiles = ['identidadFile', 'estadoCuentaFile', 'comprobanteDomicilioFile', 'certificadoLaboralFile']
        const juridicaFiles = ['commercialRegistryFile', 'legalRepIdFile', 'shareholderAssemblyFile', 'authorizedSignaturesFile', 'shareholderListFile', 'financialStatementsFile']

        const filesToProcess = isFisica ? fisicaFiles : juridicaFiles

        // 1. Extract Sanity URLs from FormData
        for (const field of filesToProcess) {
            const url = formData.get(field) as string | null
            if (url && typeof url === 'string' && url.startsWith('http')) {
                uploadedUrls[`${field}Url`] = url
            }
        }

        // 2. Prepare JSON Payload for Django
        const payload: any = {
            ingreso_promedio: formData.get('monthlyIncome') || formData.get('averageIncome'),
            ingreso_anual: formData.get('annualIncome'),
            equivalente_usd: formData.get('incomeUSD'),
            es_pep: formData.get('isPEP') === 'si',
            origen_fondos: formData.get('fundsOrigin'),
            declaracion_jurada: (formData.get('declaration1') === 'on' || formData.get('declaration1') === 'true' || formData.get('declaration') === 'on' || formData.get('declaration') === 'true'),
            firma_digital: formData.get('signature'), // Base64
        }

        // Ensure declaracion_jurada is boolean true if mandatory in frontend
        if (formData.get('declaration1') || formData.get('declaration')) {
            payload.declaracion_jurada = true;
        }

        if (isFisica) {
            // Map Persona Fisica fields
            payload.nombres = formData.get('firstName')
            payload.apellidos = formData.get('lastName')
            payload.pasaporte_cedula = formData.get('idDocument')
            payload.nacionalidad = formData.get('nationality')
            payload.estado_civil = formData.get('maritalStatus')
            payload.fecha_nacimiento = new Date(formData.get('birthDate') as string).toISOString().split('T')[0]
            payload.lugar_nacimiento = formData.get('birthPlace')
            payload.tel_residencia = formData.get('homePhone')
            payload.tel_celular = formData.get('mobilePhone1')
            payload.email = formData.get('email')
            payload.direccion = formData.get('address')
            payload.ciudad = formData.get('province') || formData.get('city')
            payload.pais = formData.get('residenceCountry')
            payload.profesion_ocupacion = formData.get('profession')
            payload.lugar_trabajo = formData.get('company')
            payload.posicion = formData.get('position')
            payload.direccion_trabajo = formData.get('workAddress')
            payload.tel_trabajo = formData.get('workPhone')

            // Map Sanity URLs
            payload.doc_identidad_url = uploadedUrls['identidadFileUrl'] || null
            payload.doc_estado_cuenta_url = uploadedUrls['estadoCuentaFileUrl'] || null
            payload.doc_comprobante_domicilio_url = uploadedUrls['comprobanteDomicilioFileUrl'] || null
            payload.doc_certificado_laboral_url = uploadedUrls['certificadoLaboralFileUrl'] || null
        } else {
            // Map Persona Juridica fields
            payload.codigo_cliente = formData.get('customerCode')
            payload.razon_social = formData.get('companyName')
            payload.nombre_comercial = formData.get('commercialName')
            payload.fecha_constitucion = new Date(formData.get('incorporationDate') as string).toISOString().split('T')[0]
            payload.pais_constitucion = formData.get('constitutionCountry')
            payload.ciudad = formData.get('city')
            payload.rnc = formData.get('rnc')
            payload.socios = [] // Default empty list for now as per dynamic implement note

            payload.rep_nombres = formData.get('legalRepFirstName')
            payload.rep_apellidos = formData.get('legalRepLastName')
            payload.rep_id = formData.get('legalRepId')
            payload.rep_fecha_nacimiento = new Date(formData.get('legalRepBirthDate') as string).toISOString().split('T')[0]
            payload.rep_direccion = formData.get('legalRepAddress')
            payload.rep_telefono = formData.get('legalRepPhone')
            payload.rep_email = formData.get('legalRepEmail')
            payload.rep_profesion = formData.get('legalRepProfession')
            payload.rep_cargo = formData.get('legalRepPosition')
            payload.rep_designacion = formData.get('legalRepDesignation')

            // Map Sanity URLs
            payload.doc_registro_mercantil_url = uploadedUrls['commercialRegistryFileUrl'] || null
            payload.doc_rep_id_url = uploadedUrls['legalRepIdFileUrl'] || null
            payload.doc_asamblea_url = uploadedUrls['shareholderAssemblyFileUrl'] || null
            payload.doc_firmas_url = uploadedUrls['authorizedSignaturesFileUrl'] || null
            payload.doc_nomina_socios_url = uploadedUrls['shareholderListFileUrl'] || null
            payload.doc_estados_financieros_url = uploadedUrls['financialStatementsFileUrl'] || null
        }

        // 3. Post to Django (Fortress)
        // If Vercel env variable is missing or says "undefined", fallback to the known Railway Production URL
        let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://puntacana-fortress-production.up.railway.app'
        
        // Clean trailing slashes or "undefined" strings
        if (apiUrl === 'undefined' || apiUrl === 'null') {
            apiUrl = 'https://puntacana-fortress-production.up.railway.app'
        }
        if (apiUrl.endsWith('/')) {
            apiUrl = apiUrl.slice(0, -1)
        }

        const endpoint = isFisica ? '/api/public/kyc/fisica/' : '/api/public/kyc/juridica/'

        if (!apiUrl.startsWith('http')) {
            console.error("Critical Error: apiUrl does not start with http. Value:", apiUrl)
            return { success: false, error: "Error interno del servidor: URL de API no configurada correctamente en Producción." }
        }

        const djangoRes = await fetch(`${apiUrl}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        if (!djangoRes.ok) {
            const errText = await djangoRes.text()
            console.error("Django KYC Status:", djangoRes.status, "Error:", errText)
            
            let parsedError = errText;
            try {
                const jsonErr = JSON.parse(errText);
                if (typeof jsonErr === 'object' && jsonErr !== null) {
                    const errorMessages = [];
                    for (const [key, val] of Object.entries(jsonErr)) {
                        if (Array.isArray(val)) {
                            errorMessages.push(`${key}: ${val.join(', ')}`);
                        } else {
                            errorMessages.push(`${key}: ${val}`);
                        }
                    }
                    if (errorMessages.length > 0) {
                        parsedError = errorMessages.join(' | ');
                    }
                }
            } catch (parseEx) {
                // If it's pure HTML or huge text
                if (parsedError.length > 200) {
                    parsedError = parsedError.substring(0, 200) + '... (Error truncado por límite de Vercel)';
                }
            }

            return { success: false, error: parsedError }
        }

        // 4. Send Confirmation Email via Resend
        const subjectName = isFisica ? `${payload.nombres || ''} ${payload.apellidos || ''}`.trim() : payload.razon_social;
        const clientEmail = isFisica ? payload.email : payload.rep_email;

        // Admin Notification
        try {
            await resend.emails.send({
                from: 'Punta Cana Investments <onboarding@resend.dev>',
                to: ['info@puntacanainvestmentsrd.com'],
                subject: `Nuevo KYC Recibido: ${subjectName}`,
                html: `
            <html>
                <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #000000; color: #ffffff; max-width: 600px; margin: 0 auto; padding: 0;">
                    <div style="background-color: #111111; padding: 40px 20px; text-align: center; border-bottom: 2px solid #c9ae5d;">
                        <img src="https://puntacanainvestmentsrd.com/images/logo-email.jpg" alt="Punta Cana Investments Logo" style="max-width: 320px; height: auto;" />
                    </div>
                    <div style="padding: 40px 30px; background-color: #0a0a0a;">
                        <h2 style="color: #c9ae5d; text-transform: uppercase; margin-top: 0; font-weight: 400; letter-spacing: 1px; text-align: center;">NUEVO KYC RECIBIDO</h2>
                        <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 20px;">
                            Se ha completado un nuevo formulario de <strong>${type}</strong>.
                        </p>
                        
                        <div style="background-color: #1a1a1a; padding: 20px; border-left: 4px solid #c9ae5d; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0 0 10px 0; color: #c9ae5d; font-size: 15px; font-weight: bold; text-transform: uppercase;">Datos Iniciales</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Cliente/Entidad:</strong> ${subjectName}</p>
                        </div>

                        <p style="font-size: 14px; color: #e0e0e0; text-align: center; margin-top: 30px;">
                            Ya puede revisarlo internamente a través de su Dashboard Administrativo en el Módulo Legal.
                        </p>
                    </div>
                </body>
            </html>
                `
            })
        } catch (e) {
            console.error("Resend Admin notification failed:", e)
        }

        // Client Confirmation
        if (clientEmail) {
            try {
                await resend.emails.send({
                    from: 'Punta Cana Investments <info@puntacanainvestmentsrd.com>',
                    to: [clientEmail],
                    subject: `Confirmación de Recepción - Formulario KYC (${type})`,
                    html: `
            <html>
                <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #000000; color: #ffffff; max-width: 600px; margin: 0 auto; padding: 0;">
                    <div style="background-color: #111111; padding: 40px 20px; text-align: center; border-bottom: 2px solid #c9ae5d;">
                        <img src="https://puntacanainvestmentsrd.com/images/logo-email.jpg" alt="Punta Cana Investments Logo" style="max-width: 320px; height: auto;" />
                    </div>
                    <div style="padding: 40px 30px; background-color: #0a0a0a;">
                        <h2 style="color: #c9ae5d; text-transform: uppercase; margin-top: 0; font-weight: 400; letter-spacing: 1px; text-align: center;">Confirmación de Recepción KYC</h2>
                        <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 20px;">
                            Estimado/a <strong>${subjectName}</strong>,
                        </p>
                        <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 20px;">
                            Hemos recibido exitosamente su Formulario KYC de <strong>${type}</strong>.
                        </p>
                        <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 30px;">
                            Sus datos y documentos han sido encriptados y almacenados de manera segura en nuestra Base de Datos bajo estricta confidencialidad. Nuestro equipo de Cumplimiento Legal evaluará su expediente a la mayor brevedad posible. Si requerimos alguna información adicional, nos pondremos en contacto con usted por esta misma vía.
                        </p>
                    </div>
                    <div style="background-color: #111111; padding: 30px; text-align: center; border-top: 1px solid #333333;">
                        <p style="margin: 0; font-size: 14px; color: #c9ae5d; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">Punta Cana Investments</p>
                        <p style="margin: 10px 0 0 0; font-size: 12px; color: #888888;">Departamento Legal y Cumplimiento</p>
                    </div>
                </body>
            </html>
                    `
                })
            } catch (e) {
                console.error("Resend Client notification failed:", e)
            }
        }

        // HubSpot API Integration (Background sync)
        try {
            await createHubspotContact({
                email: clientEmail || '',
                firstname: isFisica ? (payload.nombres || '').split(' ')[0] : (payload.rep_nombres || '').split(' ')[0],
                lastname: isFisica ? payload.apellidos || '' : payload.rep_apellidos || '',
                phone: isFisica ? payload.tel_celular || payload.tel_residencia : payload.rep_telefono,
                message: `KYC Enviado: ${type}`,
                form_source: "KYC Form"
            });
        } catch (hsError) {
            console.error("HubSpot sync failed in KYC form:", hsError);
        }

        return { success: true }
    } catch (error: any) {
        console.error("Error submitting KYC:", error)
        return { success: false, error: error.message || 'Unknown error' }
    }
}

export async function sendKYCEmailNotification(params: { type: string, clientEmail: string, subjectName: string }) {
    try {
        const { type, clientEmail, subjectName } = params;

        // Admin Notification
        try {
            await resend.emails.send({
                from: 'Punta Cana Investments <info@puntacanainvestmentsrd.com>', // MUST BE verified domain
                to: ['info@puntacanainvestmentsrd.com'],
                subject: `Nuevo KYC Recibido: ${subjectName}`,
                html: `
            <html>
                <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #000000; color: #ffffff; max-width: 600px; margin: 0 auto; padding: 0;">
                    <div style="background-color: #111111; padding: 40px 20px; text-align: center; border-bottom: 2px solid #c9ae5d;">
                        <img src="https://puntacanainvestmentsrd.com/images/logo-email.jpg" alt="Punta Cana Investments Logo" style="max-width: 320px; height: auto;" />
                    </div>
                    <div style="padding: 40px 30px; background-color: #0a0a0a;">
                        <h2 style="color: #c9ae5d; text-transform: uppercase; margin-top: 0; font-weight: 400; letter-spacing: 1px; text-align: center;">NUEVO KYC RECIBIDO</h2>
                        <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 20px;">
                            Se ha completado un nuevo formulario de <strong>${type}</strong>.
                        </p>
                        
                        <div style="background-color: #1a1a1a; padding: 20px; border-left: 4px solid #c9ae5d; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0 0 10px 0; color: #c9ae5d; font-size: 15px; font-weight: bold; text-transform: uppercase;">Datos Iniciales</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Cliente/Entidad:</strong> ${subjectName}</p>
                        </div>

                        <p style="font-size: 14px; color: #e0e0e0; text-align: center; margin-top: 30px;">
                            Ya puede revisarlo internamente a través de su Dashboard Administrativo en el Módulo Legal.
                        </p>
                    </div>
                </body>
            </html>
                `
            })
        } catch (e) {
            console.error("Resend Admin notification failed:", e)
        }

        // Client Confirmation
        if (clientEmail) {
            try {
                await resend.emails.send({
                    from: 'Punta Cana Investments <info@puntacanainvestmentsrd.com>',
                    to: [clientEmail],
                    subject: `Confirmación de Recepción - Formulario KYC (${type})`,
                    html: `
            <html>
                <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #000000; color: #ffffff; max-width: 600px; margin: 0 auto; padding: 0;">
                    <div style="background-color: #111111; padding: 40px 20px; text-align: center; border-bottom: 2px solid #c9ae5d;">
                        <img src="https://puntacanainvestmentsrd.com/images/logo-email.jpg" alt="Punta Cana Investments Logo" style="max-width: 320px; height: auto;" />
                    </div>
                    <div style="padding: 40px 30px; background-color: #0a0a0a;">
                        <h2 style="color: #c9ae5d; text-transform: uppercase; margin-top: 0; font-weight: 400; letter-spacing: 1px; text-align: center;">Confirmación de Recepción KYC</h2>
                        <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 20px;">
                            Estimado/a <strong>${subjectName}</strong>,
                        </p>
                        <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 20px;">
                            Hemos recibido exitosamente su Formulario KYC de <strong>${type}</strong>.
                        </p>
                        <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 30px;">
                            Sus datos y documentos han sido encriptados y almacenados de manera segura en nuestra Base de Datos bajo estricta confidencialidad. Nuestro equipo de Cumplimiento Legal evaluará su expediente a la mayor brevedad posible. Si requerimos alguna información adicional, nos pondremos en contacto con usted por esta misma vía.
                        </p>
                    </div>
                    <div style="background-color: #111111; padding: 30px; text-align: center; border-top: 1px solid #333333;">
                        <p style="margin: 0; font-size: 14px; color: #c9ae5d; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">Punta Cana Investments</p>
                        <p style="margin: 10px 0 0 0; font-size: 12px; color: #888888;">Departamento Legal y Cumplimiento</p>
                    </div>
                </body>
            </html>
                    `
                })
            } catch (e) {
                console.error("Resend Client notification failed:", e)
            }
        }
        return { success: true };
    } catch (e) {
        console.error("Error in sendKYCEmailNotification:", e);
        return { success: false };
    }
}
