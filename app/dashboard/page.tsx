'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<{ username: string; role: string } | null>(null);

    useEffect(() => {
        const session = localStorage.getItem('session');
        if (!session) {
            router.push('/login'); // Redirect to login if not logged in
        } else {
            const parsedSession = JSON.parse(session);
            setUser(parsedSession); // Set user data
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('session');
        router.push('/login'); // Redirect to login
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-6">Welcome, {user.username}!</h1>
            <p className="mb-4 text-lg">Role: {user.role}</p>

            <button
                onClick={handleLogout}
                className="mt-4 bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
                Logout
            </button>
        </div>
    );
}
