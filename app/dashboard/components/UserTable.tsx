import { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type User = {
    id: string;
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

    return (
        <div className="rounded-md border border-gray-700">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-gray-800/50">
                        <TableHead className="text-gray-400">Rank</TableHead>
                        <TableHead className="text-gray-400">Username</TableHead>
                        <TableHead className="text-gray-400 text-right">Score</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedUsers.map((user, index) => (
                        <TableRow 
                            key={user.id} 
                            className="hover:bg-gray-800/50"
                        >
                            <TableCell className="font-medium text-gray-300">
                                #{index + 1}
                            </TableCell>
                            <TableCell className="text-gray-300">
                                {user.username}
                            </TableCell>
                            <TableCell className="text-right text-gray-300">
                                {user.score}
                            </TableCell>
                        </TableRow>
                    ))}
                    {sortedUsers.length === 0 && (
                        <TableRow>
                            <TableCell 
                                colSpan={3} 
                                className="text-center text-gray-400 h-24"
                            >
                                No users found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}