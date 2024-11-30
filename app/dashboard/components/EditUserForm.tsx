import { useState } from 'react';
import { Crown, User as UserIcon, Save, X } from "lucide-react";

type User = {
    id: string;
    username: string;
    email?: string;
    role: string;
    score: number;
};

type EditUserFormProps = {
    user: User;
    onSave: (updatedUser: User) => Promise<void>;
    onCancel: () => void;
};

export default function EditUserForm({ user, onSave, onCancel }: EditUserFormProps) {
    const [editedUser, setEditedUser] = useState<User>({ ...user });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof User, string>>>({});

    const validateForm = () => {
        const newErrors: Partial<Record<keyof User, string>> = {};

        if (!editedUser.username || editedUser.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (editedUser.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedUser.email)) {
            newErrors.email = 'Invalid email address';
        }

        if (editedUser.score < 0) {
            newErrors.score = 'Score cannot be negative';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            await onSave(editedUser);
        } catch (error) {
            console.error('Failed to save:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#222222] rounded-lg shadow-xl border border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    {editedUser.role === 'admin' ? (
                        <Crown className="w-5 h-5 text-yellow-400" />
                    ) : (
                        <UserIcon className="w-5 h-5 text-blue-400" />
                    )}
                    Edit User: {user.username}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Username</label>
                    <input
                        type="text"
                        value={editedUser.username}
                        onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                        className={`w-full bg-gray-800 border ${errors.username ? 'border-red-500' : 'border-gray-700'} 
                            rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500`}
                    />
                    {errors.username && (
                        <p className="text-red-500 text-sm">{errors.username}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Email</label>
                    <input
                        type="email"
                        value={editedUser.email || ''}
                        onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                        className={`w-full bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-700'} 
                            rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500`}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Role</label>
                    <select
                        value={editedUser.role}
                        onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Score</label>
                    <input
                        type="number"
                        value={editedUser.score}
                        onChange={(e) => setEditedUser({ ...editedUser, score: parseInt(e.target.value) || 0 })}
                        className={`w-full bg-gray-800 border ${errors.score ? 'border-red-500' : 'border-gray-700'} 
                            rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500`}
                    />
                    {errors.score && (
                        <p className="text-red-500 text-sm">{errors.score}</p>
                    )}
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}