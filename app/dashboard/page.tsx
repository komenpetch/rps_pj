'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
    id: string;
    username: string;
    email?: string;
    role: string;
};

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<{ username: string; role: string } | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState('');
    const [editUser, setEditUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users/get');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch users');
            }
            const data = await response.json();

            const usersWithIds = data.map((user: User, index: number) => ({
                ...user,
                id: user.id || `temp-id-${index}`
            }));
            setUsers(usersWithIds);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError('Failed to fetch users.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const checkSession = () => {
            const session = localStorage.getItem('session');
            if (!session) {
                router.push('/login');
                return;
            }
            const parsedSession = JSON.parse(session);
            setUser(parsedSession);
        };

        checkSession();
        fetchUsers();
    }, [router]);

    const handleUpdate = async () => {
        if (!editUser) return;

        try {
            const response = await fetch('/api/users/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editUser),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update user');
            }

            await fetchUsers();
            setEditUser(null);
            alert('User updated successfully!');
        } catch (err) {
            console.error('Failed to update user:', err);
            setError('Failed to update user.');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch('/api/users/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete user');
            }

            setUsers((prev) => prev.filter((user) => user.id !== id));
            alert('User deleted successfully');
        } catch (err) {
            console.error('Failed to delete user:', err);
            setError('Failed to delete user.');
        }
    };

    const handleEditChange = (field: keyof User, value: string) => {
        if (editUser) {
            setEditUser({ ...editUser, [field]: value });
        }
    };

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
            <h1 className="text-3xl font-bold mb-6">
                Welcome, {user.username}!
            </h1>
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
                                {isAdmin && <th className="border border-gray-700 py-2 px-4">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((userData, index) => (
                                <tr key={userData.id || `temp-id-${index}`}>
                                    {editUser?.id === userData.id ? (
                                        <>
                                            <td className="border border-gray-700 py-2 px-4">
                                                <input
                                                    type="text"
                                                    value={editUser?.username || ''}
                                                    onChange={(e) => handleEditChange('username', e.target.value)}
                                                    className="w-full bg-gray-800 border border-gray-600 text-white p-1 rounded"
                                                />
                                            </td>
                                            {isAdmin && (
                                                <td className="border border-gray-700 py-2 px-4">
                                                    <input
                                                        type="email"
                                                        value={editUser?.email || ''}
                                                        onChange={(e) => handleEditChange('email', e.target.value)}
                                                        className="w-full bg-gray-800 border border-gray-600 text-white p-1 rounded"
                                                    />
                                                </td>
                                            )}
                                            <td className="border border-gray-700 py-2 px-4">
                                                <input
                                                    type="text"
                                                    value={editUser?.role || ''}
                                                    onChange={(e) => handleEditChange('role', e.target.value)}
                                                    className="w-full bg-gray-800 border border-gray-600 text-white p-1 rounded"
                                                />
                                            </td>
                                            <td className="border border-gray-700 py-2 px-4">
                                                <button
                                                    onClick={handleUpdate}
                                                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditUser(null)}
                                                    className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-md ml-2"
                                                >
                                                    Cancel
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="border border-gray-700 py-2 px-4">{userData.username}</td>
                                            {isAdmin && (
                                                <td className="border border-gray-700 py-2 px-4">
                                                    {userData.email || 'N/A'}
                                                </td>
                                            )}
                                            <td className="border border-gray-700 py-2 px-4">{userData.role}</td>
                                            {isAdmin && (
                                                <td className="border border-gray-700 py-2 px-4">
                                                    <button
                                                        onClick={() => setEditUser(userData)}
                                                        className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded-md"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(userData.id)}
                                                        className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md ml-2"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            )}
                                        </>
                                    )}
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