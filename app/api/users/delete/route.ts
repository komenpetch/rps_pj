import { NextResponse } from 'next/server';
import { parse } from 'cookie';
import { prisma } from '@/app/utils/prisma';
import { Prisma } from '@prisma/client';

export async function POST(req: Request) {
    try {
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

        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Check if user exists
        const userExists = await prisma.user.findUnique({
            where: { id },
            include: { scores: true }
        });

        if (!userExists) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if trying to delete the last admin
        if (userExists.role === 'admin') {
            const adminCount = await prisma.user.count({
                where: { role: 'admin' }
            });

            if (adminCount <= 1) {
                return NextResponse.json(
                    { error: 'Cannot delete the last admin user' },
                    { status: 400 }
                );
            }
        }

        await prisma.$transaction([
            prisma.score.deleteMany({
                where: { userId: id }
            }),
            prisma.user.delete({
                where: { id }
            })
        ]);

        return NextResponse.json({ 
            success: true,
            message: 'User deleted successfully',
            deletedUserId: id
        });

    } catch (error) {
        console.error('Delete error:', error);
        
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return NextResponse.json({ 
                error: 'Database error',
                details: error.message 
            }, { status: 400 });
        }

        return NextResponse.json({ 
            error: 'Failed to delete user',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}