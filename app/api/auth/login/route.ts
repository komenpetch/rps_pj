import { prisma } from '@/app/utils/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
    const { username, password } = await req.json();

    // Find user in the database
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
        return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, user });
    response.cookies.set('session', JSON.stringify({ id: user.id, username: user.username }), {
        httpOnly: true,
        secure: true,
        path: '/',
    });

    return response;
}
