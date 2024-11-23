'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<{ username: string; role: string } | null>(null);

    // Fetch user session on load
    useEffect(() => {
        const session = localStorage.getItem('session');
        if (!session) {
            router.push('/login');
        } else {
            const parsedSession = JSON.parse(session);
            setUser(parsedSession);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('session');
        router.push('/login');
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard, {user.username}!</h1>

            {/* Admin Section */}
            {user.role === 'admin' && (
                <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4 w-full max-w-md">
                    <h2 className="text-xl font-semibold mb-2">Admin Panel</h2>
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={() => router.push('/')}
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                    Go to Main Page
                </button>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
