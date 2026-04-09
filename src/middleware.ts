import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';

const locales = ['en', 'es'];
const defaultLocale = 'es';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://puntacana-fortress-production.up.railway.app';
const SUSPICIOUS_PATHS = ['.git', '.env', 'wp-admin', 'wp-login.php', 'config.php', 'phpinfo', 'eval(', 'base64_decode'];

function getLocale(request: NextRequest): string {
    const headers = { 'accept-language': request.headers.get('accept-language') || '' };
    const languages = new Negotiator({ headers }).languages();
    return match(languages, locales, defaultLocale);
}

export async function middleware(request: NextRequest, event: NextFetchEvent) {
    const { pathname } = request.nextUrl;
    const pathLower = pathname.toLowerCase();

    // ABSOLUTE BYPASS FOR API, STUDIO, AND ASSETS
    if (
        pathname.startsWith('/api') || 
        pathname.startsWith('/studio') || 
        pathname.startsWith('/images') || 
        pathname.startsWith('/_next') || 
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }
    
    // --- SECURITY MODULE ---
    // 1. Drop bad bots immediately
    if (SUSPICIOUS_PATHS.some(susp => pathLower.includes(susp))) {
        const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || 'Unknown';
        const country = request.headers.get('x-vercel-ip-country') || 'Unknown';

        event.waitUntil(
            fetch(`${API_URL}/api/security/ingest-edge/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ ip, country, reason: 'Edge Suspicious Access', path: pathname })
            }).catch(() => {})
        );

        return new NextResponse(
            `<!DOCTYPE html><html><head><title>Access Denied</title></head><body style="background:#0a0a0a;color:#ef4444;font-family:monospace;padding:40px;"><h1>403 Forbidden</h1><p>Edge Security WAF: Conexi&oacute;n denegada por comportamiento an&oacute;malo.</p></body></html>`,
            { status: 403, headers: { 'content-type': 'text/html' } }
        );
    }

    // 2. Kill Switch (Panic Mode) via ISR Edge Cache
    if (!pathname.startsWith('/api')) {
        try {
            const configReq = await fetch(`${API_URL}/api/security/config/current/`, {
                next: { revalidate: 30 },
            });
            if (configReq.ok) {
                const config = await configReq.json();
                if (config.panic_mode === true || config.panic_mode === 'true' || config.panic_mode === 'True') {
                     return new NextResponse(
                        `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Mantenimiento Preventivo</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;600&display=swap" rel="stylesheet"></head><body style="background:#050505;color:#e5e5e5;font-family:'Inter',sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;padding:20px;text-align:center;"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:20px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg><h1 style="font-weight:300;font-size:24px;margin-bottom:10px;">Sistema Restringido</h1><p style="font-size:14px;color:#888;max-width:400px;line-height:1.6;">Nuestra plataforma se encuentra bajo protecci&oacute;n defensiva m&aacute;xima (Modo P&aacute;nico) y no acepta conexiones por el momento. Regresaremos en breve.</p></body></html>`,
                        { status: 503, headers: { 'content-type': 'text/html', 'Retry-After': '3600' } }
                    );
                }
            }
        } catch (e) {
            // Fails open silently
        }
    }
    // --- END SECURITY MODULE ---

    if (pathname.startsWith('/api')) {
        return NextResponse.next();
    }
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) {
        return NextResponse.next();
    }

    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    // Only run middleware on paths that are NOT static assets
    matcher: ['/((?!_next/static|_next/image|favicon.ico|images).*)'],
};
