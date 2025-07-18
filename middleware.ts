import { AppRoute } from '@/constants/sidebar';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from './lib/auth';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 1. Allow static, public and NextAuth-API requests
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api/auth') ||
        pathname.startsWith('/favicon.ico')
    ) {
        return NextResponse.next();
    }

    // 2. Check for a valid session-jwt
    const token = await getToken(req);
    console.log('token:', token);

    const isOnSigninPage = pathname === AppRoute.Signin;

    // 3a. If no session and not on /signin → redirect to /signin
    if (!token && !isOnSigninPage) {
        const signInUrl = req.nextUrl.clone();
        signInUrl.pathname = AppRoute.Signin;
        return NextResponse.redirect(signInUrl);
    }

    // 3b. If has session and on /signin → redirect to /dashboard
    if (token && isOnSigninPage) {
        const dashUrl = req.nextUrl.clone();
        dashUrl.pathname = AppRoute.Dashboard;
        return NextResponse.redirect(dashUrl);
    }

    // const tokenPayload = getDataFromToken(token?.accessToken)

    // const currentRoute = SIDEBAR_ITEMS.find((item) => item.href === pathname);
    // if (token && currentRoute?.role) {
    //     const userRole = tokenPayload?.role;
    //     console.log('userRole:', userRole);
    //     console.log('currentRoute:', currentRoute);
    //     if (userRole !== currentRoute.role) {
    //         const forbiddenUrl = req.nextUrl.clone();
    //         forbiddenUrl.pathname = AppRoute.Forbidden;
    //         return NextResponse.redirect(forbiddenUrl);
    //     }
    // }

    // 4. Otherwise allow
    return NextResponse.next();
}

// Apply this middleware to all routes except Next.js internals:
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)'],
};
