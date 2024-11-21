import { NextResponse } from 'next/server';
const users: { username: string; email: string; password: string }[] = [];

export async function POST(req: Request) {
    const { username, email, password } = await req.json();

    // Registration
    if (req.url.includes('register')) {
        if (users.find((u) => u.username === username)) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }
        users.push({ username, email, password });
        return NextResponse.json({ success: true });
    }

    // Login
    if (req.url.includes('login')) {
        const user = users.find((u) => u.username === username && u.password === password);
        if (!user) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}
