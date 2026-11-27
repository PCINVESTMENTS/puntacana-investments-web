import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { isLocalFileSandbox } from '@/lib/localSandbox';
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

const ALLOWED_LOCAL_DD_EXTS = new Set(['.pdf', '.jpg', '.jpeg', '.png', '.webp']);

const KYC_DOC_LABELS: Record<string, string> = {
    doc_identidad_file: 'Fotocopia de documentos de identidad',
    doc_estado_cuenta_file: 'Constancia de fondos / Estado de cuenta',
    doc_bureau_credito_file: 'Bureau de crédito',
    doc_comprobante_domicilio_file: 'Constancia de domicilio',
    doc_certificado_laboral_file: 'Carta de trabajo / Certificación laboral',
    doc_registro_mercantil_file: 'Registro Mercantil',
    doc_rep_id_file: 'ID del Representante Legal',
    doc_asamblea_file: 'Acta de Asamblea o Poder Legal',
    doc_firmas_file: 'ID de Firmantes Autorizados',
    doc_nomina_socios_file: 'Nómina de Accionistas / Socios',
    doc_estados_financieros_file: 'Estados Financieros',
    firma_digital: 'Firma Digital',
};

const JSON_ARRAY_KEYS = new Set([
    'socios',
    'referencias_personales',
    'referencias_comerciales',
    'referencias_bancarias',
]);

const BOOLEAN_KEYS = new Set([
    'es_pep',
    'tiene_otros_ingresos',
    'declaracion_jurada',
    'declaracion_licitud_fondos',
    'autorizacion_compartir_info',
    'declaracion_veracidad',
]);

async function saveLocalDueDiligenceDirect(formData: FormData) {
    const catalogFile = process.env.LOCAL_PROPERTIES_SANDBOX_FILE;
    if (!catalogFile) {
        throw new Error('LOCAL_PROPERTIES_SANDBOX_FILE no configurado.');
    }
    const sandboxDir = path.dirname(catalogFile);
    const p7File = path.join(sandboxDir, 'phase7_investments_live.json');
    if (!fs.existsSync(p7File)) {
        throw new Error('Archivo local phase7_investments_live.json no encontrado.');
    }
    const state = JSON.parse(fs.readFileSync(p7File, 'utf-8'));
    const ddCfg = state.due_diligence || {};

    const subId = `KYC-LOC-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const getStr = (...keys: string[]) => {
        for (const k of keys) {
            const v = formData.get(k);
            if (typeof v === 'string' && v.trim()) return v.trim();
        }
        return '';
    };

    const formType = getStr('formType', 'form_type') || 'Persona Física';
    const nombres = getStr('nombres', 'razon_social', 'nombre') || 'Inversor Local';
    const apellidos = getStr('apellidos');
    const fullName = formType.toLowerCase().includes('jur') ? nombres : `${nombres} ${apellidos}`.trim();
    const email = getStr('correo_electronico', 'email', 'rep_email');
    const phone = getStr('tel_celular', 'rep_telefono', 'telefono_celular', 'telefono', 'phone');
    const rawLang = getStr('lang').toLowerCase();
    const lang = rawLang === 'en' || rawLang === 'fr' ? rawLang : 'es';

    // Capture 100% of submitted text, date, boolean and JSON-array fields (zero dropped fields)
    const capturedFields: Record<string, any> = {};
    for (const [key, val] of formData.entries()) {
        if (typeof val !== 'string') continue;
        if (key === 'formType' || key === 'form_type' || key === 'lang') continue;
        const trimmed = val.trim();
        if (JSON_ARRAY_KEYS.has(key)) {
            try {
                const parsed = JSON.parse(trimmed || '[]');
                capturedFields[key] = Array.isArray(parsed) ? parsed : [];
            } catch {
                capturedFields[key] = [];
            }
        } else if (BOOLEAN_KEYS.has(key)) {
            capturedFields[key] = trimmed === 'true' || trimmed === 'on' || trimmed === '1';
        } else if (trimmed !== '') {
            capturedFields[key] = trimmed;
        }
    }

    const maxBytes = Number(ddCfg.max_file_mb || 5) * 1024 * 1024;
    const destDir = path.join(sandboxDir, 'media', 'due_diligence_local', subId);
    const savedDocs: Record<string, any>[] = [];
    const nowIso = new Date().toISOString();

    for (const [fieldName, value] of formData.entries()) {
        if (typeof value === 'string' || !value || typeof (value as any).arrayBuffer !== 'function') continue;
        const fileObj = value as unknown as File;
        if (!fileObj.size) continue;
        if (ddCfg.enable_document_uploads === false) {
            return { error: 'La carga de documentos de Debida Diligencia está deshabilitada temporalmente.', status: 400 };
        }
        const origName = fileObj.name || `${fieldName}.pdf`;
        const ext = path.extname(origName).toLowerCase();
        if (!ALLOWED_LOCAL_DD_EXTS.has(ext)) {
            return { error: `Formato no permitido en '${fieldName}': ${origName}. Solo PDF, JPG, PNG o WebP.`, status: 400 };
        }
        const buf = Buffer.from(await fileObj.arrayBuffer());
        if (buf.length === 0) continue;
        if (buf.length > maxBytes) {
            return { error: `El archivo '${origName}' excede el límite de ${ddCfg.max_file_mb || 5} MB.`, status: 400 };
        }
        if (ext === '.pdf' && !buf.subarray(0, 5).equals(Buffer.from('%PDF-'))) {
            return { error: `El archivo '${origName}' no tiene una cabecera PDF válida (%PDF-).`, status: 400 };
        }
        fs.mkdirSync(destDir, { recursive: true });
        const safeField = fieldName.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40) || 'doc';
        const storedName = `${safeField}-${crypto.randomBytes(3).toString('hex')}${ext}`;
        const storedPath = path.join(destDir, storedName);
        fs.writeFileSync(storedPath, buf);
        savedDocs.push({
            field_name: safeField,
            label: KYC_DOC_LABELS[safeField] || safeField,
            original_filename: origName,
            stored_filename: storedName,
            stored_path: storedPath,
            size_bytes: buf.length,
            content_type:
                ext === '.pdf'
                    ? 'application/pdf'
                    : ext === '.png'
                    ? 'image/png'
                    : ext === '.webp'
                    ? 'image/webp'
                    : ext === '.jpg' || ext === '.jpeg'
                    ? 'image/jpeg'
                    : fileObj.type || 'application/octet-stream',
            uploaded_at: nowIso,
        });
    }

    const submission = {
        id: subId,
        form_type: formType,
        full_name: fullName,
        email,
        phone,
        lang,
        status: 'Recibido',
        created_at: nowIso,
        fields: capturedFields,
        fields_count: Object.keys(capturedFields).length,
        socios: Array.isArray(capturedFields.socios) ? capturedFields.socios : [],
        documents: savedDocs,
        documents_count: savedDocs.length,
        sandbox_isolated: true,
        encryption_at_rest: false,
        storage_mode: 'local_isolated_unencrypted_sandbox',
        email_sent: false,
        email_note: 'Modo local aislado: no se envió correo electrónico externo.',
    };

    const prevSubs = Array.isArray(ddCfg.submissions) ? ddCfg.submissions : [];
    state.due_diligence = {
        ...ddCfg,
        submissions: [submission, ...prevSubs].slice(0, 100),
    };
    state.version = Number(state.version || 1) + 1;
    state.updated_at_iso = nowIso;

    const tmpFile = `${p7File}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(state, null, 2), 'utf-8');
    fs.renameSync(tmpFile, p7File);
    return { submission, status: 201 };
}

let _resendClient: Resend | null = null;
function getResend(): Resend {
    if (!_resendClient) {
        _resendClient = new Resend(process.env.RESEND_API_KEY);
    }
    return _resendClient;
}

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const formType = String(formData.get('formType') || 'Persona Física');
        const entityType: 'Persona Física' | 'Persona Jurídica' =
            formType.toLowerCase().includes('jur') ? 'Persona Jurídica' : 'Persona Física';
        const lang = normalizeLang(formData.get('lang'), 'es');
        const clientEmail = String(
            entityType === 'Persona Física'
                ? formData.get('email') || formData.get('correo_electronico') || ''
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

        if (isLocalFileSandbox()) {
            const { recordLocalServerOutboundEvent } = await import('@/lib/localSandbox');
            if (process.env.LOCAL_PROPERTIES_SANDBOX_FILE) {
                const direct = await saveLocalDueDiligenceDirect(formData);
                if ('error' in direct && direct.error) {
                    return NextResponse.json({ success: false, error: direct.error }, { status: direct.status || 400 });
                }
                const kycRef = String(direct.submission?.reference_code || direct.submission?.id || '');
                recordLocalServerOutboundEvent({
                    flow: 'kyc_due_diligence',
                    provider: 'hubspot',
                    target_url: 'https://api.hubapi.com/crm/v3/objects/contacts',
                    method: 'POST',
                    blocked: true,
                    simulated: false,
                    status_code: 0,
                    reference_code: kycRef,
                    reason: 'HUBSPOT_DISABLED_LOCAL',
                });
                recordLocalServerOutboundEvent({
                    flow: 'kyc_due_diligence',
                    provider: 'resend',
                    target_url: 'https://api.resend.com/emails',
                    method: 'POST',
                    blocked: true,
                    simulated: true,
                    status_code: 0,
                    reference_code: kycRef,
                    reason: 'RESEND_SIMULATED_LOCAL_OUTBOX',
                });
                return NextResponse.json({
                    success: true,
                    sandbox_isolated: true,
                    data: direct.submission,
                }, { status: 201 });
            }
            const sandboxApi = process.env.LOCAL_PROPERTIES_SANDBOX_URL || 'http://127.0.0.1:8110';
            const localResp = await fetch(`${sandboxApi}/api/phase7-sandbox/due-diligence/submit/`, {
                method: 'POST',
                body: formData,
            });
            const localJson = await localResp.json().catch(() => ({}));
            if (!localResp.ok) {
                return NextResponse.json(
                    { success: false, error: localJson.error || 'Error guardando Debida Diligencia en local.' },
                    { status: localResp.status }
                );
            }
            return NextResponse.json({
                success: true,
                sandbox_isolated: true,
                data: localJson.submission || localJson,
            }, { status: 201 });
        }
        
        const policy = resolveExecutionPolicy(clientEmail);
        if (!policy.allowed) {
            console.error(`[FormEmails:${policy.code}] ${policy.error}`);
            return NextResponse.json({ success: false, error: policy.error }, { status: 403 });
        }

        const referenceCode = generateReferenceCode('KYC');
        const endpoint = entityType === 'Persona Física'
            ? '/api/public/kyc/fisica/'
            : '/api/public/kyc/juridica/';

        // Create a new FormData to send to Django, excluding internal tracking/antispam fields
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
                    'Accept': 'application/json',
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
            try {
                await getResend().emails.send({
                    from: emailBundle.adminEmail.from,
                    to: policy.teamRecipients,
                    subject: emailBundle.adminEmail.subject,
                    html: emailBundle.adminEmail.html,
                    text: emailBundle.adminEmail.text,
                });
            } catch (e) {
                console.error("Resend notification failed:", e);
            }
        }

        return NextResponse.json({ success: true, referenceCode, data });

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
