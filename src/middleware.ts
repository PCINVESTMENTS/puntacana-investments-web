import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';

const locales = ['en', 'es'];
const defaultLocale = 'es';

function getLocale(request: NextRequest): string {
    const headers = { 'accept-language': request.headers.get('accept-language') || '' };
    const languages = new Negotiator({ headers }).languages();
    return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ABSOLUTE BYPASS FOR API ROUTES
    if (pathname.startsWith('/api')) {
        return NextResponse.next();
    }
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) return;

    // Avoid redirecting assets, api, or studio
    if (pathname.startsWith('/images') || pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/studio') || pathname.includes('.')) {
        return;
    }

    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    // Only run middleware on paths that are NOT API routes or static assets
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|studio).*)'],
};
