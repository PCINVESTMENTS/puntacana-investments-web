import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { isLocalSandboxEnabled } from '@/lib/localSandbox';

const ALLOWED_LOCAL_DD_EXTS = new Set(['.pdf', '.jpg', '.jpeg', '.png', '.webp']);

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
    const fullName = `${nombres} ${apellidos}`.trim();
    const email = getStr('correo_electronico', 'email');
    const phone = getStr('tel_celular', 'telefono_celular', 'telefono', 'phone');
    const rawLang = getStr('lang').toLowerCase();
    const lang = rawLang === 'en' || rawLang === 'fr' ? rawLang : 'es';

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
            original_filename: origName,
            stored_filename: storedName,
            stored_path: storedPath,
            size_bytes: buf.length,
            content_type: fileObj.type || 'application/octet-stream',
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
        documents: savedDocs,
        documents_count: savedDocs.length,
        sandbox_isolated: true,
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
        const formType = formData.get('formType') as string;

        if (isLocalSandboxEnabled()) {
            if (process.env.LOCAL_PROPERTIES_SANDBOX_FILE) {
                const direct = await saveLocalDueDiligenceDirect(formData);
                if ('error' in direct && direct.error) {
                    return NextResponse.json({ success: false, error: direct.error }, { status: direct.status || 400 });
                }
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
            await getResend().emails.send({
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
