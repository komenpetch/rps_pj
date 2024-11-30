import { NextResponse } from 'next/server';
import { parse } from 'cookie';
import { prisma } from '@/app/utils/db';

export async function GET(req: Request) {
    try {
        const cookieHeader = req.headers.get('cookie');
        const cookies = cookieHeader ? parse(cookieHeader) : {};

        const session = cookies.session;
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { username } = JSON.parse(session);

        // Get user with scores
        const user = await prisma.user.findUnique({
            where: { username },
            include: {
                scores: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userScore = user.scores[0];

        // Get all users for ranking
        const allUsers = await prisma.user.findMany({
            include: {
                scores: true
            }
        });

        const sortedUsers = allUsers
            .filter(u => u.scores.length > 0) // Only include users with scores
            .sort((a, b) => (b.scores[0]?.points || 0) - (a.scores[0]?.points || 0));

        const rank = sortedUsers.findIndex(u => u.id === user.id) + 1;

        const stats = {
            totalGames: userScore?.totalGames || 0,
            winRate: userScore?.totalGames ? 
                (userScore.wins / userScore.totalGames) * 100 : 0,
            highestScore: userScore?.points || 0,
            rank: rank || allUsers.length
        };

        return NextResponse.json({ stats });

    } catch (error) {
        console.error('Error fetching user stats:', error);
        return NextResponse.json({ 
            error: 'Failed to fetch user stats' 
        }, { status: 500 });
    }
}