import { NextResponse } from 'next/server';
import { parse } from 'cookie';
import { prisma } from '@/app/utils/db';
import { z } from 'zod';

// Validation
const updateUserSchema = z.object({
    id: z.string().min(1, "User ID is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email format").optional(),
    role: z.enum(['admin', 'user'], {
        required_error: "Role must be either 'admin' or 'user'"
    }),
    score: z.number().int().min(0).optional()
});

export async function POST(req: Request) {
    const cookieHeader = req.headers.get('cookie');
    const cookies = cookieHeader ? parse(cookieHeader) : {};

    const session = cookies.session;
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { role } = JSON.parse(session);

    if (role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const body = await req.json();
        
        // Validate input
        const validatedData = updateUserSchema.parse(body);
        
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: validatedData.id },
            include: { scores: true }
        });

        if (!existingUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Prevent removing last admin
        if (existingUser.role === 'admin' && validatedData.role !== 'admin') {
            const adminCount = await prisma.user.count({
                where: { role: 'admin' }
            });

            if (adminCount <= 1) {
                return NextResponse.json(
                    { error: 'Cannot remove the last admin user' },
                    { status: 400 }
                );
            }
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: validatedData.id },
            data: {
                username: validatedData.username,
                email: validatedData.email,
                role: validatedData.role,
                scores: validatedData.score !== undefined ? {
                    update: {
                        where: { id: existingUser.scores[0]?.id },
                        data: { points: validatedData.score }
                    }
                } : undefined
            },
            include: {
                scores: true
            }
        });

        return NextResponse.json({
            success: true,
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                score: updatedUser.scores[0]?.points || 0
            }
        });
    } catch (error) {
        console.error('Error updating user:', error);
        
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );
    }
}