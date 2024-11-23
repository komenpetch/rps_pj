import { NextResponse } from 'next/server';
import { parse } from 'cookie';
import { prisma } from '@/app/utils/prisma';

export async function GET(req: Request) {
    const cookieHeader = req.headers.get('cookie');
    const cookies = cookieHeader ? parse(cookieHeader) : {};

    const session = cookies.session;
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const users = await prisma.user.findMany({
            select: { id: true, username: true, email: true, role: true },
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
