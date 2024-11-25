// app/api/games/save/route.ts
import { NextResponse } from 'next/server';
import { parse } from 'cookie';
import { prisma } from '@/app/utils/prisma';
import { z } from 'zod';

const gameResultSchema = z.object({
    playerChoice: z.enum(['rock', 'paper', 'scissors']),
    computerChoice: z.enum(['rock', 'paper', 'scissors']),
    result: z.enum(['win', 'lose', 'draw']),
    points: z.number().int().min(0)
});

export async function POST(req: Request) {
    try {
        const cookieHeader = req.headers.get('cookie');
        const cookies = cookieHeader ? parse(cookieHeader) : {};

        const session = cookies.session;
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: userId } = JSON.parse(session);
        const body = await req.json();
        const validatedData = gameResultSchema.parse(body);

        // Update user's score
        await prisma.$transaction(async (tx) => {
            // Get current score
            const currentScore = await tx.score.findFirst({
                where: { userId }
            });

            if (currentScore) {
                // Update existing score
                await tx.score.update({
                    where: { id: currentScore.id },
                    data: {
                        points: currentScore.points + validatedData.points
                    }
                });
            } else {
                // Create new score
                await tx.score.create({
                    data: {
                        userId,
                        points: validatedData.points
                    }
                });
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Save game error:', error);
        
        if (error instanceof z.ZodError) {
            return NextResponse.json({ 
                error: error.errors[0].message 
            }, { status: 400 });
        }

        return NextResponse.json({ 
            error: 'Failed to save game result' 
        }, { status: 500 });
    }
}