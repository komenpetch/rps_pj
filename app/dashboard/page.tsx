'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import AdminTable from '@/app/dashboard/components/AdminTable';
import UserTable from '@/app/dashboard/components/UserTable';
import EditUserForm from '@/app/dashboard/components/EditUserForm';
import StatsCards from '@/app/dashboard/components/StatsCards';
import { toast } from "@/components/ui/use-toast";

type User = {
    id: string;
    username: string;
    email?: string;
    role: string;
    score: number;
};

type Stats = {
    totalGames: number;
    winRate: number;
    highestScore: number;
    rank: number;
};

export default function Dashboard() {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<Stats>({
        totalGames: 0,
        winRate: 0,
        highestScore: 0,
        rank: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch users
                const usersResponse = await fetch('/api/users/get');
                if (!usersResponse.ok) throw new Error('Failed to fetch users');
                const usersData = await usersResponse.json();
                setUsers(usersData);

                // Fetch stats
                const statsResponse = await fetch('/api/users/stats');
                if (!statsResponse.ok) throw new Error('Failed to fetch stats');
                const { stats: statsData } = await statsResponse.json();
                setStats(statsData);

            } catch (err) {
                console.error(err);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to fetch dashboard data",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEdit = (user: User) => {
        setEditingUser(user);
    };

    const handleUpdate = async (updatedUser: User) => {
        try {
            const response = await fetch('/api/users/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update user');
            }

            // Update users list with new data
            setUsers(prev => prev.map(user => 
                user.id === updatedUser.id ? updatedUser : user
            ));

            // Close edit form
            setEditingUser(null);

            toast({
                title: "Success",
                description: "User updated successfully",
            });
        } catch (error) {
            console.error('Update error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : 'Failed to update user',
            });
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
                throw new Error('Failed to delete user');
            }

            setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
            toast({
                title: "Success",
                description: "User deleted successfully",
            });
        } catch (error) {
            console.error('Delete error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete user",
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-[#222222] rounded-lg p-6 border border-gray-700">
                <h1 className="text-2xl font-bold text-white mb-2">
                    Welcome back, {user?.username}!
                </h1>
                <p className="text-gray-400">
                    Track your progress and compete with other players.
                </p>
            </div>

            {/* Stats Cards */}
            <StatsCards {...stats} />

            {/* User/Admin Table */}
            {editingUser ? (
                <EditUserForm
                    user={editingUser}
                    onSave={handleUpdate}
                    onCancel={() => setEditingUser(null)}
                />
            ) : (
                user?.role === 'admin' ? (
                    <AdminTable
                        users={users}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        setUsers={setUsers}
                    />
                ) : (
                    <UserTable users={users} />
                )
            )}
        </div>
    );
}