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

    // Simulate session handling
    const session = { id: user.id, username: user.username };
    return NextResponse.json({ success: true, session });
}
