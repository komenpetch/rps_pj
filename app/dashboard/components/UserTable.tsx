'use client';

type User = {
    id: string;
    username: string;
    score: number;
};

type UserTableProps = {
    users: User[];
};

export default function UserTable({ users }: UserTableProps) {
    return (
        <table className="w-full text-left text-sm border-collapse border border-gray-700">
            <thead>
                <tr>
                    <th className="border border-gray-700 py-2 px-4">Username</th>
                    <th className="border border-gray-700 py-2 px-4">Score</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user, index) => (
                    <tr key={`${user.id}-${index}`}>
                        <td className="border border-gray-700 py-2 px-4">{user.username}</td>
                        <td className="border border-gray-700 py-2 px-4">{user.score}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}