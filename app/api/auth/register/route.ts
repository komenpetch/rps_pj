import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/app/utils/db';
import { registerSchema } from '@/app/utils/valid';
import { z } from 'zod';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const validatedData = registerSchema.parse(body);
        const { username, email, password } = validatedData;

        const existingUsername = await prisma.user.findUnique({
            where: { username }
        });

        if (existingUsername) {
            return NextResponse.json(
                { error: 'Username already taken' },
                { status: 400 }
            );
        }

        const existingEmail = await prisma.user.findUnique({
            where: { email }
        });

        if (existingEmail) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create the user
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: 'user', // Default role
                scores: {
                    create: {
                        points: 0 // Initial score
                    }
                }
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true
            }
        });

        return NextResponse.json(
            { 
                success: true,
                message: 'Registration successful',
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    role: newUser.role
                }
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Registration error:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            );
        }

        if (error instanceof Error) {
            return NextResponse.json(
                { error: 'Registration failed. Please try again.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}