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

    const getStr = (...keys: string[]) => {
        for (const k of keys) {
            const v = formData.get(k);
            if (typeof v === 'string' && v.trim()) return v.trim();
        }
        return '';
    };

    const formType = getStr('formType', 'form_type') || 'Persona Física';
    const isJuridica = formType.toLowerCase().includes('jur');
    const nombres = getStr('nombres', 'razon_social', 'nombre') || 'Inversor Local';
    const apellidos = getStr('apellidos');
    const fullName = isJuridica ? nombres : `${nombres} ${apellidos}`.trim();
    const email = getStr('correo_electronico', 'email', 'rep_email');
    const phone = getStr('tel_celular', 'rep_telefono', 'telefono_celular', 'telefono', 'phone');
    const idNumber = isJuridica ? getStr('rnc') : getStr('pasaporte_cedula');
    const country = isJuridica ? getStr('pais_constitucion') : getStr('pais');
    const idemKey = getStr('idempotency_key');
    const rawLang = getStr('lang').toLowerCase();
    const lang = rawLang === 'en' || rawLang === 'fr' ? rawLang : 'es';

    const fpSource = [
        isJuridica ? 'juridica' : 'fisica',
        idNumber.toLowerCase(),
        email.toLowerCase(),
        fullName.toLowerCase(),
    ].join('|');
    const kycFingerprint = crypto.createHash('sha256').update(fpSource, 'utf-8').digest('hex');

    const prevSubs: Record<string, any>[] = Array.isArray(ddCfg.submissions) ? ddCfg.submissions : [];
    const nowIso = new Date().toISOString();

    // Idempotent retry lookup: match by idempotency_key OR deterministic identity fingerprint
    const existingIdx = prevSubs.findIndex((existing) => {
        if (!existing || typeof existing !== 'object') return false;
        if (idemKey && existing.idempotency_key && String(existing.idempotency_key) === idemKey) return true;
        if (kycFingerprint && existing.kyc_fingerprint && String(existing.kyc_fingerprint) === kycFingerprint) return true;
        // Also match historical submissions lacking kyc_fingerprint by exact (formType, idNumber, email)
        const exJur = String(existing.form_type || '').toLowerCase().includes('jur');
        const exId = String(exJur ? existing.fields?.rnc : existing.fields?.pasaporte_cedula || '').trim().toLowerCase();
        const exEmail = String(existing.email || '').trim().toLowerCase();
        if (exJur === isJuridica && idNumber && exId && exId === idNumber.toLowerCase() && email && exEmail === email.toLowerCase()) {
            return true;
        }
        return false;
    });

    if (existingIdx !== -1) {
        const existingSub = prevSubs[existingIdx];
        existingSub.duplicate_attempts_blocked = Number(existingSub.duplicate_attempts_blocked || 0) + 1;
        existingSub.last_retry_at = nowIso;
        existingSub.deduplicated = true;
        if (idemKey && !existingSub.idempotency_key) {
            existingSub.idempotency_key = idemKey;
        }
        if (!existingSub.kyc_fingerprint) {
            existingSub.kyc_fingerprint = kycFingerprint;
        }
        state.due_diligence = { ...ddCfg, submissions: prevSubs };
        state.version = Number(state.version || 1) + 1;
        state.updated_at_iso = nowIso;
        const tmpFile = `${p7File}.${process.pid}.${Date.now()}.tmp`;
        fs.writeFileSync(tmpFile, JSON.stringify(state, null, 2), 'utf-8');
        fs.renameSync(tmpFile, p7File);
        return {
            submission: existingSub,
            deduplicated: true,
            idNumber,
            country,
            status: 200,
        };
    }

    const subId = `KYC-LOC-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    // Capture 100% of submitted text, date, boolean and JSON-array fields (zero dropped fields)
    const capturedFields: Record<string, any> = {};
    for (const [key, val] of formData.entries()) {
        if (typeof val !== 'string') continue;
        if (['formType', 'form_type', 'lang', 'idempotency_key', 'website_url', 'form_loaded_at'].includes(key)) continue;
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
        const isPngMagic = buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
        const isJpegMagic = buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
        const isWebpMagic = buf.length >= 12 && buf.subarray(0, 4).equals(Buffer.from('RIFF')) && buf.subarray(8, 12).equals(Buffer.from('WEBP'));
        if (ext === '.pdf' && !buf.subarray(0, 5).equals(Buffer.from('%PDF-'))) {
            return { error: `El archivo '${origName}' no tiene una cabecera PDF válida (%PDF-).`, status: 400 };
        }
        if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext) && !(isPngMagic || isJpegMagic || isWebpMagic)) {
            return { error: `El archivo '${origName}' no tiene una cabecera de imagen válida (PNG/JPEG/WebP).`, status: 400 };
        }
        const effectiveExt = ext === '.pdf' ? '.pdf' : isPngMagic ? '.png' : isJpegMagic ? '.jpg' : isWebpMagic ? '.webp' : ext;
        fs.mkdirSync(destDir, { recursive: true });
        const safeField = fieldName.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40) || 'doc';
        const storedName = `${safeField}-${crypto.randomBytes(3).toString('hex')}${effectiveExt}`;
        const storedPath = path.join(destDir, storedName);
        fs.writeFileSync(storedPath, buf);
        savedDocs.push({
            field_name: safeField,
            label: KYC_DOC_LABELS[safeField] || safeField,
            original_filename: origName,
            stored_filename: storedName,
            stored_path: storedPath,
            size_bytes: buf.length,
            sha256: crypto.createHash('sha256').update(buf).digest('hex'),
            content_type:
                effectiveExt === '.pdf'
                    ? 'application/pdf'
                    : effectiveExt === '.png'
                    ? 'image/png'
                    : effectiveExt === '.webp'
                    ? 'image/webp'
                    : effectiveExt === '.jpg' || effectiveExt === '.jpeg'
                    ? 'image/jpeg'
                    : fileObj.type || 'application/octet-stream',
            uploaded_at: nowIso,
        });
    }

    const submission: Record<string, any> = {
        id: subId,
        company_code: 'PCI-RE',
        form_type: formType,
        full_name: fullName,
        email,
        phone,
        lang,
        status: 'Recibido',
        created_at: nowIso,
        idempotency_key: idemKey,
        kyc_fingerprint: kycFingerprint,
        deduplicated: false,
        duplicate_attempts_blocked: 0,
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

    state.due_diligence = {
        ...ddCfg,
        submissions: [submission, ...prevSubs].slice(0, 100),
    };
    state.version = Number(state.version || 1) + 1;
    state.updated_at_iso = nowIso;

    const tmpFile = `${p7File}.${process.pid}.${Date.now()}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(state, null, 2), 'utf-8');
    fs.renameSync(tmpFile, p7File);
    return { submission, deduplicated: false, idNumber, country, status: 201 };
}

function attachClientLinkToLocalKyc(subId: string, crmClientId: number, crmClientName: string) {
    const catalogFile = process.env.LOCAL_PROPERTIES_SANDBOX_FILE;
    if (!catalogFile || !subId) return;
    const p7File = path.join(path.dirname(catalogFile), 'phase7_investments_live.json');
    if (!fs.existsSync(p7File)) return;
    try {
        const state = JSON.parse(fs.readFileSync(p7File, 'utf-8'));
        const subs = state?.due_diligence?.submissions;
        if (!Array.isArray(subs)) return;
        const target = subs.find((s: any) => s && s.id === subId);
        if (!target) return;
        target.crm_client_id = crmClientId;
        target.crm_client_name = crmClientName;
        target.opportunity_created = false;
        const tmpFile = `${p7File}.${process.pid}.${Date.now()}.tmp`;
        fs.writeFileSync(tmpFile, JSON.stringify(state, null, 2), 'utf-8');
        fs.renameSync(tmpFile, p7File);
    } catch {
        // Non-blocking metadata enrichment
    }
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
            const { getPhase4BackendBaseUrl, recordLocalServerOutboundEvent } = await import('@/lib/localSandbox');
            if (process.env.LOCAL_PROPERTIES_SANDBOX_FILE) {
                const direct = await saveLocalDueDiligenceDirect(formData);
                if ('error' in direct && direct.error) {
                    return NextResponse.json({ success: false, error: direct.error }, { status: direct.status || 400 });
                }
                const kycRef = String(direct.submission?.reference_code || direct.submission?.id || '');
                const isDedup = Boolean(direct.deduplicated);

                // Link KYC dossier to unified CRM V2 Client WITHOUT creating any commercial Opportunity
                let crmClientId: number | null = direct.submission?.crm_client_id || null;
                let crmClientName = String(direct.submission?.crm_client_name || '');
                const localBackendBase = getPhase4BackendBaseUrl();
                const localApiKey = String(process.env.API_SHARED_SECRET || process.env.DASHBOARD_AUTH_API_KEY || '').trim();
                if (
                    localBackendBase &&
                    (localBackendBase.startsWith('http://127.0.0.1:') || localBackendBase.startsWith('http://localhost:')) &&
                    localApiKey
                ) {
                    try {
                        const linkRes = await fetch(`${localBackendBase}/api/crm-v2/legal/kyc/link-client/`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-API-KEY': localApiKey,
                            },
                            body: JSON.stringify({
                                dossier_id: kycRef,
                                form_type: direct.submission?.form_type || entityType,
                                full_name: direct.submission?.full_name || '',
                                email: direct.submission?.email || clientEmail,
                                phone: direct.submission?.phone || '',
                                id_number: direct.idNumber || '',
                                country: direct.country || '',
                                lang,
                                deduplicated: isDedup,
                            }),
                        });
                        const linkJson = await linkRes.json().catch(() => ({}));
                        if (linkRes.ok && linkJson?.client_id) {
                            crmClientId = Number(linkJson.client_id);
                            crmClientName = String(linkJson.client_name || '');
                            attachClientLinkToLocalKyc(kycRef, crmClientId, crmClientName);
                            direct.submission.crm_client_id = crmClientId;
                            direct.submission.crm_client_name = crmClientName;
                            direct.submission.opportunity_created = false;
                        }
                    } catch (linkErr) {
                        console.warn('Local KYC -> CRM V2 Client link skipped:', linkErr);
                    }
                }

                if (!isDedup) {
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
                }
                return NextResponse.json({
                    success: true,
                    sandbox_isolated: true,
                    deduplicated: isDedup,
                    opportunity_created: false,
                    crm_client_id: crmClientId,
                    data: direct.submission,
                }, { status: isDedup ? 200 : 201 });
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
