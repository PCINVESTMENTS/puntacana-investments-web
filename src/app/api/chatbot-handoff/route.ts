import { NextResponse } from 'next/server';
import {
  getPhase4BackendBaseUrl,
  getServerStagingApiKey,
  isCloudStagingSimulatedMode,
  isLocalFileSandbox,
} from '@/lib/localSandbox';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const localBackendBase = getPhase4BackendBaseUrl();
    const localApiKey = getServerStagingApiKey();
    const isLocalAllowed =
      isLocalFileSandbox() &&
      Boolean(localBackendBase) &&
      (localBackendBase.startsWith('http://127.0.0.1:') || localBackendBase.startsWith('http://localhost:'));
    const isStagingAllowed =
      isCloudStagingSimulatedMode() &&
      Boolean(localBackendBase) &&
      !localBackendBase.includes('puntacana-fortress-production.up.railway.app');

    if ((!isLocalAllowed && !isStagingAllowed) || !localApiKey) {
      return NextResponse.json(
        { ok: false, error: 'Handoff deshabilitado fuera del entorno aislado/staging.' },
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
