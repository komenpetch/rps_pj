import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/app/utils/prisma';

export async function POST(req: Request) {
    const { username, email, password } = await req.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
        return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to the database
    try {
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
        return NextResponse.json({ success: true, user: newUser });
    } catch (err) {
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}
