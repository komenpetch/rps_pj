'use client';

import { useState } from 'react';
import EditUserForm from './EditUserForm';

type User = {
    id: string;
    username: string;
    email?: string;
    role: string;
    score: number;
};

type AdminTableProps = {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

export default function AdminTable({ users, setUsers }: AdminTableProps) {
    const [editUser, setEditUser] = useState<User | null>(null);

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch('/api/users/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (!response.ok) throw new Error('Failed to delete user');
            setUsers((prev) => prev.filter((user) => user.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            {editUser ? (
                <EditUserForm
                    editUser={editUser}
                    setEditUser={setEditUser}
                    setUsers={setUsers}
                />
            ) : (
                <table className="w-full text-left text-sm border-collapse border border-gray-700">
                    <thead>
                        <tr>
                            <th className="border border-gray-700 py-2 px-4">Username</th>
                            <th className="border border-gray-700 py-2 px-4">Score</th>
                            <th className="border border-gray-700 py-2 px-4">Email</th>
                            <th className="border border-gray-700 py-2 px-4">Role</th>
                            <th className="border border-gray-700 py-2 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={`${user.id}-${index}`}>
                                <td className="border border-gray-700 py-2 px-4">{user.username}</td>
                                <td className="border border-gray-700 py-2 px-4">{user.score}</td>
                                <td className="border border-gray-700 py-2 px-4">{user.email || 'N/A'}</td>
                                <td className="border border-gray-700 py-2 px-4">{user.role}</td>
                                <td className="border border-gray-700 py-2 px-4">
                                    <button
                                        onClick={() => setEditUser(user)}
                                        className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded-md"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md ml-2"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
}