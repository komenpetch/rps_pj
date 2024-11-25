// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const session = req.cookies.get('session');

    // Public paths that don't require authentication
    const publicPaths = ['/login', '/'];
    if (publicPaths.includes(req.nextUrl.pathname)) {
        return NextResponse.next();
    }

    // Check if the user is logged in
    if (!session) {
        // Redirect to login page if not logged in
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // For admin-only routes
    if (req.nextUrl.pathname.startsWith('/dashboard/admin')) {
        const sessionData = JSON.parse(session.value);
        if (sessionData.role !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/rps/:path*',
        '/dashboard/:path*',
        '/login',
    ],
};