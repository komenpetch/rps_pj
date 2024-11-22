import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ success: true });
    response.cookies.set('session', '', { httpOnly: true, secure: true, path: '/', maxAge: 0 });
    return response;
}
