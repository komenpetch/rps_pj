'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminTable from './components/AdminTable';
import UserTable from './components/UserTable';

type User = {
    id: string;
    username: string;
    email?: string;
    role: string;
    score: number;
};

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<{ username: string; role: string } | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
        try {
            const response = await fetch('/api/users/get');
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            // Ensure each user has an id
            const usersWithIds = data.map((user: User, index: number) => ({
                ...user,
                id: user.id || `temp-id-${index}`
            }));
            setUsers(usersWithIds);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        let mounted = true;

        const initialize = async () => {
            const session = localStorage.getItem('session');
            if (!session) {
                router.push('/login');
                return;
            }

            if (mounted) {
                setUser(JSON.parse(session));
                await fetchUsers();
            }
        };

        initialize();

        return () => {
            mounted = false;
        };
    }, [router, fetchUsers]);

    const handleLogout = () => {
        localStorage.removeItem('session');
        router.push('/login');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <p>Unauthorized. Redirecting to login...</p>
            </div>
        );
    }

    const isAdmin = user.role === 'admin';

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
            <h1 className="text-3xl font-bold mb-6">Welcome, {user.username}!</h1>
            <p className="mb-4">Role: {user.role}</p>

            <div className="w-full max-w-4xl bg-gray-800 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">All Users</h2>
                {isAdmin ? (
                    <AdminTable users={users} setUsers={setUsers} />
                ) : (
                    <UserTable users={users} />
                )}
            </div>

            <button
                onClick={handleLogout}
                className="mt-4 bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
                Logout
            </button>
        </div>
    );
}