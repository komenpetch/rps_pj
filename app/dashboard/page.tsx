'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
    id?: string;
    username: string;
    email?: string;
    role: string;
};

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<{ username: string; role: string } | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const session = localStorage.getItem('session');
        if (!session) {
            router.push('/login'); // Redirect to login if not logged in
        } else {
            const parsedSession = JSON.parse(session);
            setUser(parsedSession);

            fetchUsers();
        }
    }, [router]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users/get');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch users');
            }
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError('Failed to fetch users.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('session');
        router.push('/login'); // Redirect to login
    };

    if (!user) return <div>Loading...</div>;

    const isAdmin = user.role === 'admin';

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
            <h1 className="text-3xl font-bold mb-6">Welcome, {user.username}!</h1>
            <p className="mb-4">Role: {user.role}</p>

            <div className="w-full max-w-4xl bg-gray-800 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">All Users</h2>
                {error && <p className="text-red-500">{error}</p>}
                {users.length > 0 ? (
                    <table className="w-full text-left text-sm border-collapse border border-gray-700">
                        <thead>
                            <tr>
                                <th className="border border-gray-700 py-2 px-4">Username</th>
                                {isAdmin && <th className="border border-gray-700 py-2 px-4">Email</th>}
                                <th className="border border-gray-700 py-2 px-4">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id || user.username}>
                                    <td className="border border-gray-700 py-2 px-4">{user.username}</td>
                                    {isAdmin && (
                                        <td className="border border-gray-700 py-2 px-4">
                                            {user.email || 'N/A'}
                                        </td>
                                    )}
                                    <td className="border border-gray-700 py-2 px-4">{user.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No users found.</p>
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