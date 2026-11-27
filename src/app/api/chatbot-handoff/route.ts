import { NextResponse } from 'next/server';
import { getPhase4BackendBaseUrl, isLocalFileSandbox } from '@/lib/localSandbox';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const localBackendBase = getPhase4BackendBaseUrl();
    const localApiKey = String(process.env.API_SHARED_SECRET || process.env.DASHBOARD_AUTH_API_KEY || '').trim();

    if (
      !isLocalFileSandbox() ||
      !localBackendBase ||
      !(localBackendBase.startsWith('http://127.0.0.1:') || localBackendBase.startsWith('http://localhost:')) ||
      !localApiKey
    ) {
      return NextResponse.json(
        { ok: false, error: 'Handoff local deshabilitado fuera del entorno aislado.' },
        { status: 503 }
      );
    }

    const res = await fetch(`${localBackendBase}/api/crm-v2/omnichannel/chatbot/handoff/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': localApiKey,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: 'Error conectando handoff de Asistente IA: ' + (err?.message || String(err)) },
      { status: 500 }
    );
  }
}
