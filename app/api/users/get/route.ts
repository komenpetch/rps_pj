import { NextResponse } from 'next/server';
import { parse } from 'cookie';
import { prisma } from '@/app/utils/prisma';

export async function GET(req: Request) {
    // Get cookies from headers
    const cookieHeader = req.headers.get('cookie');
    const cookies = cookieHeader ? parse(cookieHeader) : {};

    // Check if session exists
    const session = cookies.session;
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { role } = JSON.parse(session);

    // Only allow admin users
    if (role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch all users
    const users = await prisma.user.findMany({
        select: { id: true, username: true, email: true, role: true },
    });

    return NextResponse.json(users);
}
