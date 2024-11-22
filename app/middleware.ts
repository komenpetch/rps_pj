import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const session = req.cookies.get('session');

    // Check if the user is logged in
    if (!session && req.nextUrl.pathname === '/rps') {
        // Redirect to the login page if not logged in
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/rps'],
};
