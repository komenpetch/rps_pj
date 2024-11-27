import { useMemo } from 'react';
import { Trophy } from "lucide-react";

type User = {
    id?: string;
    username: string;
    score: number;
};

type UserTableProps = {
    users: User[];
};

export default function UserTable({ users }: UserTableProps) {
    const sortedUsers = useMemo(() => {
        return [...users].sort((a, b) => b.score - a.score);
    }, [users]);

    const getRankColor = (index: number) => {
        switch(index) {
            case 0: return 'bg-yellow-500/20 text-yellow-400'; // Gold
            case 1: return 'bg-gray-400/20 text-gray-300';    // Silver
            case 2: return 'bg-orange-500/20 text-orange-400'; // Bronze
            default: return 'bg-blue-500/20 text-blue-400';
        }
    };

    return (
        <div className="bg-[#222222] rounded-lg shadow-xl border border-gray-700">
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Leaderboard
                </h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-gray-400 text-sm uppercase">
                            <th className="py-3 px-4 text-left">Rank</th>
                            <th className="py-3 px-4 text-left">Player</th>
                            <th className="py-3 px-4 text-right">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedUsers.map((user, index) => (
                            <tr 
                                key={user.id || `user-${index}`}
                                className="border-t border-gray-700 hover:bg-gray-800/50 transition-colors"
                            >
                                <td className="py-3 px-4">
                                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${getRankColor(index)}`}>
                                        {index + 1}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-white">
                                    {user.username}
                                </td>
                                <td className="py-3 px-4 text-right font-mono text-gray-300">
                                    {user.score.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                        {sortedUsers.length === 0 && (
                            <tr>
                                <td 
                                    colSpan={3} 
                                    className="py-8 text-center text-gray-400"
                                >
                                    No players found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}