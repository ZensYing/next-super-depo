import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware restricts authenticated users from accessing login/register pages
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;

    // List of guest-only paths (ignoring the language prefix for now)
    const isGuestOnlyPage = pathname.endsWith('/login') || pathname.endsWith('/register');

    if (token && isGuestOnlyPage) {
        // Find the language prefix to redirect to the correct home page
        const segments = pathname.split('/');
        const lang = segments[1]; // Usually 'km', 'en', or 'zh'

        // Redirect to the localized home page if authenticated
        return NextResponse.redirect(new URL(`/${lang}`, request.url));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
