import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';

const locales = ['en', 'es'];
const defaultLocale = 'en';

// Safely parse API_URL to prevent double-slash errors (e.g. https://...//api/)
let API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://puntacana-fortress-production.up.railway.app';
if (API_URL.endsWith('/')) {
    API_URL = API_URL.slice(0, -1);
}

const SUSPICIOUS_PATHS = ['.git', '.env', 'wp-admin', 'wp-login.php', 'config.php', 'phpinfo', 'eval(', 'base64_decode'];

// In-Memory map for Edge Rate Limiting. Resets naturally as isolates are born and die, acting as a perfect zero-cost shock absorber.
const ipCache = new Map();

function getLocale(request: NextRequest): string {
    const headers = { 'accept-language': request.headers.get('accept-language') || '' };
    const languages = new Negotiator({ headers }).languages();
    return match(languages, locales, defaultLocale);
}

export async function middleware(request: NextRequest, event: NextFetchEvent) {
    const { pathname } = request.nextUrl;
    const pathLower = pathname.toLowerCase();
    
    // Safely parse API_URL to prevent double-slash errors (e.g. https://...//api/)
    // Removed duplicate API_URL logic here.

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
    const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || 'Unknown';
    const country = request.headers.get('x-vercel-ip-country') || 'Unknown';
    const userAgent = request.headers.get('user-agent') || '';
    const isBot = /googlebot|google-inspectiontool|bingbot|yandexbot|duckduckbot|slurp|baiduspider/i.test(userAgent);

    // 1. Drop bad bots immediately
    if (SUSPICIOUS_PATHS.some(susp => pathLower.includes(susp))) {
        event.waitUntil(
            fetch(`${API_URL}/api/security/ingest-edge/`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json',
                    'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || 'c8f9d2a1b4e6g7h8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f1'
                },
                body: JSON.stringify({ ip, country, reason: 'Edge Suspicious Access', path: pathname })
            }).catch(() => {})
        );

        return new NextResponse(
            `<!DOCTYPE html><html><head><title>Access Denied</title></head><body style="background:#0a0a0a;color:#ef4444;font-family:monospace;padding:40px;"><h1>403 Forbidden</h1><p>Edge Security WAF: Conexi&oacute;n denegada por comportamiento an&oacute;malo.</p></body></html>`,
            { status: 403, headers: { 'content-type': 'text/html' } }
        );
    }

    // 2. Kill Switch & Geo-Block via ISR Edge Cache
    if (!pathname.startsWith('/api') && !isBot) {
        try {
            const configReq = await fetch(`${API_URL}/api/security/config/current/`, {
                next: { revalidate: 30 },
                headers: {
                    'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || 'c8f9d2a1b4e6g7h8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f1'
                }
            });
            if (configReq.ok) {
                const config = await configReq.json();
                
                // Panic Mode
                if (config.panic_mode === true || config.panic_mode === 'true' || config.panic_mode === 'True') {
                     return new NextResponse(
                        `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Mantenimiento Preventivo</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;600&display=swap" rel="stylesheet"></head><body style="background:#050505;color:#e5e5e5;font-family:'Inter',sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;padding:20px;text-align:center;"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:20px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg><h1 style="font-weight:300;font-size:24px;margin-bottom:10px;">Sistema Restringido</h1><p style="font-size:14px;color:#888;max-width:400px;line-height:1.6;">Nuestra plataforma se encuentra bajo protecci&oacute;n defensiva m&aacute;xima (Modo P&aacute;nico) y no acepta conexiones por el momento. Regresaremos en breve.</p></body></html>`,
                        { status: 503, headers: { 'content-type': 'text/html', 'Retry-After': '3600' } }
                    );
                }

                // Geo-Blocking
                if (config.blocked_countries && country !== 'Unknown') {
                    const blockList = config.blocked_countries.split(',').map((c: string) => c.trim().toUpperCase());
                    if (blockList.includes(country.toUpperCase())) {
                        
                        // Fire-and-forget telemetry
                        event.waitUntil(
                            fetch(`${API_URL}/api/security/ingest-edge/`, {
                                method: 'POST',
                                headers: { 
                                    'Content-Type': 'application/json', 
                                    'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || 'c8f9d2a1b4e6g7h8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f1'
                                },
                                body: JSON.stringify({ ip, country, reason: 'Geo-Block Restringido', path: pathname })
                            }).catch(() => {})
                        );

                        return new NextResponse(
                            `<!DOCTYPE html><html><head><title>Access Denied</title></head><body style="background:#0a0a0a;color:#ef4444;font-family:monospace;padding:40px;"><h1>403 Forbidden</h1><p>Edge Security WAF: Conexi&oacute;n denegada desde tu regi&oacute;n geogr&aacute;fica (${country}).</p></body></html>`,
                            { status: 403, headers: { 'content-type': 'text/html' } }
                        );
                    }
                }
                // Rate Limiting (In-Memory Fast Check)
                if (config.rate_limiting === true || config.rate_limiting === 'true' || config.rate_limiting === 'True') {
                    if (ip !== 'Unknown') {
                        const now = Date.now();
                        const windowMs = 60000;
                        const reqLimit = 30; // 30 req/min per isolate
                        let ipData = ipCache.get(ip) || { count: 0, startTime: now };
                        if (now - ipData.startTime > windowMs) {
                            ipData = { count: 1, startTime: now };
                        } else {
                            ipData.count++;
                        }
                        ipCache.set(ip, ipData);

                        if (ipData.count > reqLimit) {
                            event.waitUntil(
                                fetch(`${API_URL}/api/security/ingest-edge/`, {
                                    method: 'POST',
                                    headers: { 
                                        'Content-Type': 'application/json', 
                                        'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || 'c8f9d2a1b4e6g7h8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f1'
                                    },
                                    body: JSON.stringify({ ip, country, reason: 'Rate Limit Excedido', path: pathname })
                                }).catch(() => {})
                            );
                            return new NextResponse(
                                `<!DOCTYPE html><html><head><title>Too Many Requests</title></head><body style="background:#0a0a0a;color:#eab308;font-family:monospace;padding:40px;"><h1>429 Too Many Requests</h1><p>Edge Security WAF: Has excedido el l&iacute;mite de peticiones permitidas por minuto.</p></body></html>`,
                                { status: 429, headers: { 'content-type': 'text/html', 'Retry-After': '60' } }
                            );
                        }
                    }
                }

                // JS-Challenge (Smart Captcha Invisible)
                if (config.smart_captcha === true || config.smart_captcha === 'true' || config.smart_captcha === 'True') {
                    const hasHumanCookie = request.cookies.get('x-human-verified');
                    if (!hasHumanCookie) {
                        event.waitUntil(
                            fetch(`${API_URL}/api/security/ingest-edge/`, {
                                method: 'POST',
                                headers: { 
                                    'Content-Type': 'application/json', 
                                    'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || 'c8f9d2a1b4e6g7h8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f1'
                                },
                                body: JSON.stringify({ ip, country, reason: 'Smart Captcha Triggered', path: pathname })
                            }).catch(() => {})
                        );

                        const htmlCaptcha = `<!DOCTYPE html>
<html>
<head>
    <title>Safe Connection Check</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>body{background:#000;color:#fff;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;} .loader {border: 4px solid #333; border-top: 4px solid #D4AF37; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin-bottom:15px; margin-left:auto; margin-right:auto;} @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
</head>
<body>
    <div style="text-align:center;">
        <div class="loader"></div>
        <p style="color:#888;font-size:14px;letter-spacing:1px;font-weight:300;">Validando conexi&oacute;n segura...</p>
    </div>
    <script>
        setTimeout(function(){
            document.cookie = "x-human-verified=true; path=/; max-age=86400; SameSite=Lax";
            window.location.reload();
        }, 300);
    </script>
</body>
</html>`;
                        return new NextResponse(htmlCaptcha, { status: 200, headers: { 'content-type': 'text/html' } });
                    }
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
