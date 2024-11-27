import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const response = NextResponse.json({
            success: true,
            message: 'Logged out successfully'
        });

        response.cookies.set('session', '', {
            httpOnly: true,
            secure: true,
            path: '/',
            maxAge: 0
        });

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ 
            error: 'Failed to logout' 
        }, { status: 500 });
    }
}