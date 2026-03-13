'use server'

import { client } from '@/sanity/lib/client'
import { v4 as uuidv4 } from 'uuid'
import { Resend } from 'resend'

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

        // Expected file fields depending on type
        const fisicaFiles = ['identidadFile', 'estadoCuentaFile', 'comprobanteDomicilioFile', 'certificadoLaboralFile']
        const juridicaFiles = ['commercialRegistryFile', 'legalRepIdFile', 'shareholderAssemblyFile', 'authorizedSignaturesFile', 'shareholderListFile', 'financialStatementsFile']

        const filesToProcess = isFisica ? fisicaFiles : juridicaFiles
        const uploadedUrls: Record<string, string> = {}

        // 1. Upload files to Sanity Assets
        for (const field of filesToProcess) {
            const file = formData.get(field) as File | null
            if (file && file.size > 0) {
                const arrayBuffer = await file.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)

                // Upload to Sanity
                const asset = await writeClient.assets.upload('file', buffer, {
                    filename: file.name,
                    contentType: file.type,
                })
                uploadedUrls[`${field}Url`] = asset.url
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
                console.error("Django KYC Error:", errText)
                return { success: false, error: errText }
            }
        }

        // 4. Send Confirmation Email via Resend
        try {
            await resend.emails.send({
                from: 'Punta Cana Investments <onboarding@resend.dev>',
                to: ['info@puntacanainvestmentsrd.com'],
                subject: `Nuevo KYC Recibido: ${isFisica ? payload.nombres + ' ' + payload.apellidos : payload.razon_social}`,
                html: `
                    <h1>Formulario KYC - Debida Diligencia</h1>
                    <p>Un nuevo formulario de <strong>${type}</strong> ha sido completado.</p>
                    <p>Ya puede revisarlo internamente a través de su Dashboard Administrativo en el Módulo Legal.</p>
                `
            })
        } catch (e) {
            console.error("Resend notification failed:", e)
        }

        return { success: true }
    } catch (error: any) {
        console.error("Error submitting KYC:", error)
        return { success: false, error: error.message || 'Unknown error' }
    }
}
