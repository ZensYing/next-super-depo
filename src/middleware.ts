import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const isAuthRoute = nextUrl.pathname.startsWith('/api/auth');
    const isGuestRoute = nextUrl.pathname.includes('/login') || nextUrl.pathname.includes('/register');
    const isAdminRoute = nextUrl.pathname.includes('/admin');

    // Allow API Auth routes
    if (isAuthRoute) {
        return NextResponse.next();
    }

    // Redirect logged-in users away from login/register
    if (isLoggedIn && isGuestRoute) {
        const segments = nextUrl.pathname.split('/');
        const lang = segments[1] || 'en'; // Default to en if missing
        // Check if lang is actually a lang code (2 chars) or part of the path
        const validLang = ['en', 'km', 'ko'].includes(lang) ? lang : 'en';
        return NextResponse.redirect(new URL(`/${validLang}`, nextUrl));
    }

    // Protect Admin routes
    if (isAdminRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL('/en/login', nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    // Matcher ignoring static files and api (except auth)
    matcher: ['/((?!api/products|api/start|_next/static|_next/image|favicon.ico).*)'],
};
