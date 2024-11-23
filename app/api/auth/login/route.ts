import { NextResponse } from 'next/server';
import { prisma } from '@/app/utils/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        // Find user in the database
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }

        // Compare the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }

        // Create session data
        const session = { username: user.username, role: user.role };

        // Set the cookie with session
        const response = NextResponse.json({ success: true, session });
        response.cookies.set('session', JSON.stringify(session), {
            httpOnly: true,
            secure: true,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
