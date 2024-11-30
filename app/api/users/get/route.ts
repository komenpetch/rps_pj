import { NextResponse } from 'next/server';
import { parse } from 'cookie';
import { prisma } from '@/app/utils/db';

export async function GET(req: Request) {
    const cookieHeader = req.headers.get('cookie');
    const cookies = cookieHeader ? parse(cookieHeader) : {};

    const session = cookies.session;
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { role } = JSON.parse(session);

        // For admin - return all user details
        if (role === 'admin') {
            const users = await prisma.user.findMany({
                include: {
                    scores: true,
                },
            });

            // Format the response to include the score
            const formattedUsers = users.map(user => ({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                score: user.scores.length > 0 ? user.scores[0].points : 0
            }));

            // Sort by score
            formattedUsers.sort((a, b) => b.score - a.score);

            return NextResponse.json(formattedUsers);
        }
        
        // For regular users - return limited information
        const users = await prisma.user.findMany({
            select: {
                username: true,
                scores: {
                    select: {
                        points: true
                    }
                }
            }
        });

        const formattedUsers = users.map(user => ({
            username: user.username,
            score: user.scores.length > 0 ? user.scores[0].points : 0
        }));

        // Sort by score
        formattedUsers.sort((a, b) => b.score - a.score);

        return NextResponse.json(formattedUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' }, 
            { status: 500 }
        );
    }
}