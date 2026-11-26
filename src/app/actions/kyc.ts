'use server'

import { headers } from 'next/headers'
import { Resend } from 'resend'
import { createHubspotContact } from '@/lib/hubspot'
import {
    buildKycEmails,
    generateReferenceCode,
    normalizeLang,
    recordLocalDryRunEmail,
    resolveExecutionPolicy,
    resolveSiteOrigin,
} from '@/lib/formEmails'
import {
    evaluateFormAntispam,
    extractAntispamFromFormData,
} from '@/lib/formSecurity'

function getResend(): Resend {
    return new Resend(process.env.RESEND_API_KEY)
}

function normalizeKycEntityType(raw: unknown): 'Persona Física' | 'Persona Jurídica' {
    const s = String(raw || '').toLowerCase()
    return s.includes('jur') || s.includes('legal') || s.includes('morale')
        ? 'Persona Jurídica'
        : 'Persona Física'
}

export async function precheckKycSubmission(params: {
    email: string;
    formType: string;
    lang?: string;
    honeypot?: string;
    formLoadedAt?: string;
}): Promise<{
    allowed: boolean;
    silentDrop: boolean;
    skipExternalBackend: boolean;
    referenceCode: string;
    error?: string;
}> {
    const lang = normalizeLang(params.lang, 'es')
    const entityType = normalizeKycEntityType(params.formType)
    const cleanEmail = String(params.email || '').trim()

    const antispam = evaluateFormAntispam({
        email: cleanEmail,
        honeypot: params.honeypot,
        formLoadedAt: params.formLoadedAt,
        lang,
        sourceLabel: `KYC (${entityType})`,
    })

    if (antispam.action === 'silent_drop') {
        console.warn(antispam.logMessage)
        return {
            allowed: false,
            silentDrop: true,
            skipExternalBackend: true,
            referenceCode: '',
        }
    }

    if (antispam.action === 'reject') {
        console.warn(antispam.logMessage)
        return {
            allowed: false,
            silentDrop: false,
            skipExternalBackend: true,
            referenceCode: '',
            error: antispam.errorMessage,
        }
    }

    const policy = resolveExecutionPolicy(cleanEmail)
    if (!policy.allowed) {
        console.error(`[FormEmails:${policy.code}] ${policy.error}`)
        return {
            allowed: false,
            silentDrop: false,
            skipExternalBackend: true,
            referenceCode: '',
            error: policy.error,
        }
    }

    const referenceCode = generateReferenceCode('KYC')
    const skipExternalBackend = policy.railwayMode === 'simulated' || policy.mode === 'local_dry_run'
    if (skipExternalBackend) {
        const endpoint = entityType === 'Persona Física' ? '/api/public/kyc/fisica/' : '/api/public/kyc/juridica/'
        console.log(`[PREVIEW-SIMULATED] Railway ${endpoint} skipped [${referenceCode}]`)
    }

    return {
        allowed: true,
        silentDrop: false,
        skipExternalBackend,
        referenceCode,
    }
}

export async function submitKYCFromClient(formData: FormData) {
    try {
        const entityType = normalizeKycEntityType(formData.get('formType'))
        const isFisica = entityType === 'Persona Física'
        const lang = normalizeLang(formData.get('lang'), 'es')

        const clientEmailRaw = String(
            isFisica ? formData.get('email') || '' : formData.get('legalRepEmail') || ''
        ).trim()

        const { honeypot, formLoadedAt } = extractAntispamFromFormData(formData)
        const antispam = evaluateFormAntispam({
            email: clientEmailRaw,
            honeypot,
            formLoadedAt,
            lang,
            sourceLabel: `KYC (${entityType})`,
        })
        if (antispam.action === 'silent_drop') {
            console.warn(antispam.logMessage)
            return { success: true }
        }
        if (antispam.action === 'reject') {
            console.warn(antispam.logMessage)
            return { success: false, error: antispam.errorMessage }
        }

        const policy = resolveExecutionPolicy(clientEmailRaw)
        if (!policy.allowed) {
            console.error(`[FormEmails:${policy.code}] ${policy.error}`)
            return { success: false, error: policy.error }
        }

        const uploadedUrls: Record<string, string> = {}
        const fisicaFiles = ['identidadFile', 'estadoCuentaFile', 'comprobanteDomicilioFile', 'certificadoLaboralFile']
        const juridicaFiles = ['commercialRegistryFile', 'legalRepIdFile', 'shareholderAssemblyFile', 'authorizedSignaturesFile', 'shareholderListFile', 'financialStatementsFile']
        const filesToProcess = isFisica ? fisicaFiles : juridicaFiles

        for (const field of filesToProcess) {
            const url = formData.get(field) as string | null
            if (url && typeof url === 'string' && url.startsWith('http')) {
                uploadedUrls[`${field}Url`] = url
            }
        }

        const payload: any = {
            ingreso_promedio: formData.get('monthlyIncome') || formData.get('averageIncome'),
            ingreso_anual: formData.get('annualIncome'),
            equivalente_usd: formData.get('incomeUSD'),
            es_pep: formData.get('isPEP') === 'si',
            origen_fondos: formData.get('fundsOrigin'),
            declaracion_jurada: (formData.get('declaration1') === 'on' || formData.get('declaration1') === 'true' || formData.get('declaration') === 'on' || formData.get('declaration') === 'true'),
            firma_digital: formData.get('signature'),
        }

        if (formData.get('declaration1') || formData.get('declaration')) {
            payload.declaracion_jurada = true
        }

        if (isFisica) {
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

            payload.doc_identidad_url = uploadedUrls['identidadFileUrl'] || null
            payload.doc_estado_cuenta_url = uploadedUrls['estadoCuentaFileUrl'] || null
            payload.doc_comprobante_domicilio_url = uploadedUrls['comprobanteDomicilioFileUrl'] || null
            payload.doc_certificado_laboral_url = uploadedUrls['certificadoLaboralFileUrl'] || null
        } else {
            payload.codigo_cliente = formData.get('customerCode')
            payload.razon_social = formData.get('companyName')
            payload.nombre_comercial = formData.get('commercialName')
            payload.fecha_constitucion = new Date(formData.get('incorporationDate') as string).toISOString().split('T')[0]
            payload.pais_constitucion = formData.get('constitutionCountry')
            payload.ciudad = formData.get('city')
            payload.rnc = formData.get('rnc')
            const rawSocios = formData.get('socios')
            let parsedSocios: any[] = []
            if (typeof rawSocios === 'string' && rawSocios.trim()) {
                try {
                    const tmp = JSON.parse(rawSocios)
                    if (Array.isArray(tmp)) parsedSocios = tmp
                } catch {
                    parsedSocios = []
                }
            }
            payload.socios = parsedSocios

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

            payload.doc_registro_mercantil_url = uploadedUrls['commercialRegistryFileUrl'] || null
            payload.doc_rep_id_url = uploadedUrls['legalRepIdFileUrl'] || null
            payload.doc_asamblea_url = uploadedUrls['shareholderAssemblyFileUrl'] || null
            payload.doc_firmas_url = uploadedUrls['authorizedSignaturesFileUrl'] || null
            payload.doc_nomina_socios_url = uploadedUrls['shareholderListFileUrl'] || null
            payload.doc_estados_financieros_url = uploadedUrls['financialStatementsFileUrl'] || null
        }

        const referenceCode = generateReferenceCode('KYC')
        const endpoint = isFisica ? '/api/public/kyc/fisica/' : '/api/public/kyc/juridica/'

        if (policy.railwayMode === 'simulated') {
            console.log(`[PREVIEW-SIMULATED] Railway ${endpoint} skipped [${referenceCode}]`)
        } else if (policy.railwayApiUrl) {
            const djangoRes = await fetch(`${policy.railwayApiUrl}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!djangoRes.ok) {
                const errText = await djangoRes.text()
                console.error("Django KYC Status:", djangoRes.status, "Error:", errText)

                let parsedError = errText
                try {
                    const jsonErr = JSON.parse(errText)
                    if (typeof jsonErr === 'object' && jsonErr !== null) {
                        const errorMessages: string[] = []
                        for (const [key, val] of Object.entries(jsonErr)) {
                            if (Array.isArray(val)) {
                                errorMessages.push(`${key}: ${val.join(', ')}`)
                            } else {
                                errorMessages.push(`${key}: ${val}`)
                            }
                        }
                        if (errorMessages.length > 0) {
                            parsedError = errorMessages.join(' | ')
                        }
                    }
                } catch {
                    if (parsedError.length > 200) {
                        parsedError = parsedError.substring(0, 200) + '... (Error truncado por límite de Vercel)'
                    }
                }

                return { success: false, error: parsedError }
            }
        }

        const subjectName = isFisica
            ? `${payload.nombres || ''} ${payload.apellidos || ''}`.trim()
            : String(payload.razon_social || '').trim()

        if (policy.hubspotMode === 'simulated') {
            console.log(`[PREVIEW-SIMULATED] HubSpot contact sync skipped [${referenceCode}]`)
        } else {
            try {
                await createHubspotContact({
                    email: clientEmailRaw,
                    firstname: isFisica ? String(payload.nombres || '').split(' ')[0] : String(payload.rep_nombres || '').split(' ')[0],
                    lastname: isFisica ? String(payload.apellidos || '') : String(payload.rep_apellidos || ''),
                    phone: isFisica ? String(payload.tel_celular || payload.tel_residencia || '') : String(payload.rep_telefono || ''),
                    message: `[Ref: ${referenceCode}] KYC Enviado: ${entityType}`,
                    form_source: 'KYC Form',
                })
            } catch (hsError) {
                console.error('HubSpot sync failed in KYC form:', hsError)
            }
        }

        await sendKYCEmailNotification({
            type: entityType,
            clientEmail: clientEmailRaw,
            subjectName,
            lang,
            referenceCode,
            phone: isFisica ? String(payload.tel_celular || payload.tel_residencia || '') : String(payload.rep_telefono || ''),
            country: isFisica ? String(payload.pais || '') : String(payload.pais_constitucion || ''),
        })

        return { success: true, referenceCode }
    } catch (error: any) {
        console.error('Error submitting KYC:', error)
        return { success: false, error: error.message || 'Unknown error' }
    }
}

export async function sendKYCEmailNotification(params: {
    type: string;
    clientEmail: string;
    subjectName: string;
    lang?: string;
    referenceCode?: string;
    phone?: string;
    country?: string;
    honeypot?: string;
    formLoadedAt?: string;
}) {
    try {
        const entityType = normalizeKycEntityType(params.type)
        const lang = normalizeLang(params.lang, 'es')
        const cleanEmail = String(params.clientEmail || '').trim()
        const cleanSubjectName = String(params.subjectName || '').trim()

        const antispam = evaluateFormAntispam({
            email: cleanEmail,
            honeypot: params.honeypot,
            formLoadedAt: params.formLoadedAt,
            lang,
            sourceLabel: `KYCEmail (${entityType})`,
        })
        if (antispam.action === 'silent_drop') {
            console.warn(antispam.logMessage)
            return { success: true }
        }
        if (antispam.action === 'reject') {
            console.warn(antispam.logMessage)
            return { success: false, error: antispam.errorMessage }
        }

        const policy = resolveExecutionPolicy(cleanEmail)
        if (!policy.allowed) {
            console.error(`[FormEmails:${policy.code}] ${policy.error}`)
            return { success: false, error: policy.error }
        }

        const referenceCode = String(params.referenceCode || '').trim() || generateReferenceCode('KYC')
        const reqHeaders = await headers()
        const siteOrigin = resolveSiteOrigin(reqHeaders)

        const { adminEmail, clientEmail } = buildKycEmails({
            referenceCode,
            lang,
            entityType,
            subjectName: cleanSubjectName,
            clientEmail: policy.clientRecipient,
            phone: params.phone,
            country: params.country,
        })

        if (policy.mode === 'local_dry_run') {
            recordLocalDryRunEmail({
                recordedAt: new Date().toISOString(),
                flow: 'kyc',
                referenceCode,
                lang,
                siteOrigin,
                railwayMode: policy.railwayMode,
                hubspotMode: policy.hubspotMode,
                adminEmail: {
                    ...adminEmail,
                    recipients: policy.teamRecipients,
                },
                clientEmail,
            })
            return { success: true, referenceCode }
        }

        if (policy.hubspotMode === 'simulated') {
            console.log(`[PREVIEW-SIMULATED] HubSpot contact sync skipped [${referenceCode}]`)
        }

        const resend = getResend()

        // 1. Admin / Legal Team Notification (Spanish, verified domain sender)
        try {
            const adminRes = await resend.emails.send({
                from: adminEmail.from,
                to: policy.teamRecipients,
                subject: adminEmail.subject,
                html: adminEmail.html,
                text: adminEmail.text,
            })
            if (adminRes.error) {
                console.error('Resend Error (KYC Admin Notification):', adminRes.error)
            }
        } catch (e) {
            console.error('Resend Admin notification failed:', e)
        }

        // 2. Client Confirmation (ES / EN / FR, verified domain sender)
        if (policy.clientRecipient) {
            try {
                const clientRes = await resend.emails.send({
                    from: clientEmail.from,
                    to: [policy.clientRecipient],
                    subject: clientEmail.subject,
                    html: clientEmail.html,
                    text: clientEmail.text,
                })
                if (clientRes.error) {
                    console.error('Resend Error (KYC Client Confirmation):', clientRes.error)
                }
            } catch (e) {
                console.error('Resend Client notification failed:', e)
            }
        }

        return { success: true, referenceCode }
    } catch (e) {
        console.error('Error in sendKYCEmailNotification:', e)
        return { success: false, error: 'Failed to send KYC notification email.' }
    }
}
