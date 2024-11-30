import { useState } from 'react';
import { 
    Edit, 
    Trash2, 
    Search,
    ChevronUp,
    ChevronDown,
    Crown,
    User as UserIcon
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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

type SortField = 'username' | 'email' | 'role' | 'score';
type SortDirection = 'asc' | 'desc';

export default function AdminTable({ users, onEdit, onDelete, setUsers }: AdminTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<SortField>('score');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();

    // Sorting function
    const sortUsers = (a: User, b: User, field: SortField): number => {
        const direction = sortDirection === 'asc' ? 1 : -1;
        
        switch (field) {
            case 'score':
                return (a.score - b.score) * direction;
            case 'username':
            case 'email':
            case 'role':
                const aValue = a[field] || '';
                const bValue = b[field] || '';
                return aValue.localeCompare(bValue) * direction;
            default:
                return 0;
        }
    };

    // Filter and sort users
    const filteredUsers = users
        .filter(user => {
            const searchLower = searchTerm.toLowerCase();
            return (
                user.username.toLowerCase().includes(searchLower) ||
                (user.email?.toLowerCase().includes(searchLower) || '') ||
                user.role.toLowerCase().includes(searchLower)
            );
        })
        .sort((a, b) => sortUsers(a, b, sortField));

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleDelete = async () => {
        if (!userToDelete) return;
        
        setIsDeleting(true);
        try {
            const response = await fetch('/api/users/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userToDelete }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete user');
            }

            setUsers(prev => prev.filter(user => user.id !== userToDelete));
            toast({
                title: "Success",
                description: "User deleted successfully",
            });
        } catch (error) {
            console.error('Delete error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : 'Failed to delete user',
            });
        } finally {
            setIsDeleting(false);
            setUserToDelete(null);
        }
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
    };

    return (
        <div className="bg-[#222222] rounded-lg shadow-xl border border-gray-700">
            {/* Table Header */}
            <div className="p-4 border-b border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl font-semibold text-white">
                        User Management
                    </h2>
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-800/50">
                            <th className="px-4 py-3 text-left text-gray-400 font-medium">
                                <button
                                    onClick={() => handleSort('username')}
                                    className="flex items-center gap-1 hover:text-white"
                                >
                                    Username
                                    <SortIcon field="username" />
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left text-gray-400 font-medium">
                                <button
                                    onClick={() => handleSort('email')}
                                    className="flex items-center gap-1 hover:text-white"
                                >
                                    Email
                                    <SortIcon field="email" />
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left text-gray-400 font-medium">
                                <button
                                    onClick={() => handleSort('role')}
                                    className="flex items-center gap-1 hover:text-white"
                                >
                                    Role
                                    <SortIcon field="role" />
                                </button>
                            </th>
                            <th className="px-4 py-3 text-right text-gray-400 font-medium">
                                <button
                                    onClick={() => handleSort('score')}
                                    className="flex items-center gap-1 hover:text-white ml-auto"
                                >
                                    Score
                                    <SortIcon field="score" />
                                </button>
                            </th>
                            <th className="px-4 py-3 text-right text-gray-400 font-medium">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr 
                                key={user.id}
                                className="border-t border-gray-700 hover:bg-gray-800/50 transition-colors"
                            >
                                <td className="px-4 py-3 text-white">
                                    {user.username}
                                </td>
                                <td className="px-4 py-3 text-gray-300">
                                    {user.email || 'N/A'}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        {user.role === 'admin' ? (
                                            <Crown className="w-4 h-4 text-yellow-400" />
                                        ) : (
                                            <UserIcon className="w-4 h-4 text-blue-400" />
                                        )}
                                        <span className={`text-sm ${
                                            user.role === 'admin' ? 'text-yellow-400' : 'text-blue-400'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right font-mono text-gray-300">
                                    {user.score.toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-right space-x-2">
                                    <button
                                        onClick={() => onEdit(user)}
                                        className="text-gray-400 hover:text-yellow-400 transition-colors"
                                        title="Edit user"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setUserToDelete(user.id)}
                                        className="text-gray-400 hover:text-red-400 transition-colors"
                                        title="Delete user"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                                    {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {userToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#222222] rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-semibold text-white mb-4">
                            Confirm Deletion
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Are you sure you want to delete this user? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setUserToDelete(null)}
                                disabled={isDeleting}
                                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}