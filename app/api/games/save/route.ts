import { NextResponse } from 'next/server';
import { parse } from 'cookie';
import { prisma } from '@/app/utils/prisma';

export async function POST(req: Request) {
    try {
        const cookieHeader = req.headers.get('cookie');
        const cookies = cookieHeader ? parse(cookieHeader) : {};

        const session = cookies.session;
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { username } = JSON.parse(session);
        const { result, points } = await req.json();

        // Get user with their current score
        const user = await prisma.user.findUnique({
            where: { username },
            include: {
                scores: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Update or create score
        if (user.scores.length > 0) {
            await prisma.score.update({
                where: { id: user.scores[0].id },
                data: {
                    points: {
                        increment: points
                    },
                    totalGames: {
                        increment: 1
                    },
                    wins: {
                        increment: result === 'win' ? 1 : 0
                    }
                }
            });
        } else {
            await prisma.score.create({
                data: {
                    userId: user.id,
                    points: points,
                    totalGames: 1,
                    wins: result === 'win' ? 1 : 0
                }
            });
        }

        return NextResponse.json({ 
            success: true,
            message: 'Game saved successfully'
        });

    } catch (error) {
        console.error('Error saving game:', error);
        return NextResponse.json({ 
            error: 'Failed to save game' 
        }, { status: 500 });
    }
}