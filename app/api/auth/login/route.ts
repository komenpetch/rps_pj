import { NextResponse } from 'next/server';
import { prisma } from '@/app/utils/prisma';
import bcrypt from 'bcrypt';
import { loginSchema } from '@/app/utils/valid';
import { z } from 'zod';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const validatedData = loginSchema.parse(body);
        const { username, password } = validatedData;

        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                password: true,
                role: true,
                email: true
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid username or password' },
                { status: 401 }
            );
        }

        // Compare the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Invalid username or password' },
                { status: 401 }
            );
        }

        const session = {
            id: user.id,
            username: user.username,
            role: user.role
        };

        const response = NextResponse.json(
            { success: true, session },
            { status: 200 }
        );

        return response;

    } catch (error) {
        console.error('Login error:', error);
        
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}