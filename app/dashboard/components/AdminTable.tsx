import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type User = {
    id: string;
    username: string;
    email?: string;
    role: string;
    score: number;
};

type AdminTableProps = {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (id: string) => void;
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

export default function AdminTable({ users, onEdit, setUsers }: AdminTableProps) {
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();

    const handleDelete = async () => {
        if (!userToDelete) return;

        setIsDeleting(true);
        try {
            const userToBeDeleted = users.find(user => user.id === userToDelete);
            if (!userToBeDeleted) {
                throw new Error('User not found');
            }

            setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete));

            const response = await fetch('/api/users/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userToDelete }),
            });

            const data = await response.json();

            if (!response.ok) {
                setUsers(prevUsers => [...prevUsers, userToBeDeleted]);
                throw new Error(data.error || 'Failed to delete user');
            }

            toast({
                title: "Success",
                description: "User deleted successfully",
                duration: 3000,
            });

        } catch (error) {
            console.error('Delete error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : 'Failed to delete user',
                duration: 5000,
            });
        } finally {
            setIsDeleting(false);
            setUserToDelete(null);
        }
    };

    // Sort users by score
    const sortedUsers = [...users].sort((a, b) => b.score - a.score);

    return (
        <>
            <div className="rounded-md border border-gray-700">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-gray-400">Rank</TableHead>
                            <TableHead className="text-gray-400">Username</TableHead>
                            <TableHead className="text-gray-400">Email</TableHead>
                            <TableHead className="text-gray-400">Role</TableHead>
                            <TableHead className="text-gray-400 text-right">Score</TableHead>
                            <TableHead className="text-gray-400 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedUsers.map((user, index) => (
                            <TableRow key={user.id} className="hover:bg-gray-800/50">
                                <TableCell className="font-medium text-gray-300">
                                    #{index + 1}
                                </TableCell>
                                <TableCell className="text-gray-300">
                                    {user.username}
                                </TableCell>
                                <TableCell className="text-gray-300">
                                    {user.email || 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        user.role === 'admin' 
                                            ? 'bg-blue-500/20 text-blue-400' 
                                            : 'bg-green-500/20 text-green-400'
                                    }`}>
                                        {user.role}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right text-gray-300">
                                    {user.score}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        onClick={() => onEdit(user)}
                                        variant="ghost"
                                        size="sm"
                                        className="hover:bg-yellow-500/20 text-yellow-400"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        onClick={() => setUserToDelete(user.id)}
                                        variant="ghost"
                                        size="sm"
                                        className="hover:bg-red-500/20 text-red-400"
                                        disabled={isDeleting}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {sortedUsers.length === 0 && (
                            <TableRow>
                                <TableCell 
                                    colSpan={6} 
                                    className="text-center text-gray-400 h-24"
                                >
                                    No users found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={!!userToDelete} onOpenChange={() => !isDeleting && setUserToDelete(null)}>
                <AlertDialogContent className="bg-gray-800 border-gray-700">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-200">
                            Confirm Deletion
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            Are you sure you want to delete this user? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel 
                            disabled={isDeleting}
                            className="bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}