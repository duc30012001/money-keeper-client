import createNextIntlMiddleware from 'next-intl/middleware';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Locale } from './enums/common';
import { AppRoute } from './enums/routes';
import { routing } from './i18n/routing';
import { getToken } from './modules/auth/utils';

const nextIntl = createNextIntlMiddleware(routing);

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    console.log('pathname:', pathname);

    if (pathname.startsWith('/api') && !pathname.startsWith('/api/v1')) {
        return NextResponse.next();
    }

    // 1. Bypass for Next.js internals and your auth callback
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon.ico') ||
        pathname.startsWith('/api/auth')
    ) {
        // skip directly to next-intl (or just return next())
        return nextIntl(req);
    }

    // 2. Do your session check + redirects
    const token = await getToken(req);
    const locale = cookies().get('NEXT_LOCALE')?.value || Locale.EN;
    const onSignInPage = pathname === `/${locale}${AppRoute.SIGN_IN}`;

    if (!token && !onSignInPage) {
        const url = req.nextUrl.clone();
        url.pathname = `/${locale}${AppRoute.SIGN_IN}`;
        return NextResponse.redirect(url);
    }

    if (token && onSignInPage) {
        const url = req.nextUrl.clone();
        url.pathname = `/${locale}${AppRoute.DASHBOARD}`;
        return NextResponse.redirect(url);
    }

    // 3. Proxy Authorization header for your /api/v1 calls
    if (pathname.startsWith('/api/v1') && token?.accessToken) {
        console.log('api call');
        const res = NextResponse.next();
        res.headers.set('Authorization', `Bearer ${token.accessToken}`);
        // *don’t* call nextIntl here—this is an API route
        return res;
    }

    // 4. Finally, hand off to next-intl
    return nextIntl(req);
}

export const config = {
    matcher: [
        // all “page” routes except Next.js internals, trpc, vercel, static files…
        '/((?!trpc|_next|_vercel|.*\\..*).*)',
        // …plus JUST /api/v1 and its sub-paths
        '/api/v1/:path*',
    ],
};
