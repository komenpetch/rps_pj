'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminTable from './components/AdminTable';
import UserTable from './components/UserTable';
import EditUserForm from './components/EditUserForm';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type User = {
    id: string;
    username: string;
    email?: string;
    role: string;
    score: number;
};

export default function Dashboard() {
    const router = useRouter();
    const { toast } = useToast();
    const [user, setUser] = useState<{ username: string; role: string } | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
        try {
            const response = await fetch('/api/users/get');
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch users",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        const session = localStorage.getItem('session');
        if (!session) {
            router.push('/login');
            return;
        }

        setUser(JSON.parse(session));
        fetchUsers();
    }, [router, fetchUsers]);

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch('/api/users/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete user');
            }

            await fetchUsers(); // Refresh the users list
            toast({
                title: "Success",
                description: "User deleted successfully",
            });
        } catch (err) {
            console.error(err);
            toast({
                variant: "destructive",
                title: "Error",
                description: err instanceof Error ? err.message : "Failed to delete user",
            });
        }
    };

    const handleUpdate = async (updatedUser: User) => {
        try {
            const response = await fetch('/api/users/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.error || 'Failed to update user');
            }
    
            // Update the users list
            setUsers(prev => prev.map(user => 
                user.id === updatedUser.id ? updatedUser : user
            ));
    
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

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            localStorage.removeItem('session');
            router.push('/login');
        } catch (err) {
            console.error(err);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to logout",
            });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-gray-400">Welcome back, {user?.username}</p>
                    </div>
                    <Button
                        onClick={handleLogout}
                        variant="destructive"
                        className="flex items-center gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>

                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-gray-200">
                            {user?.role === 'admin' ? 'User Management' : 'Leaderboard'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
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
                                    onEdit={setEditingUser}
                                    onDelete={handleDelete}
                                    setUsers={setUsers}
                                />
                            ) : (
                                <UserTable users={users} />
                            )
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}