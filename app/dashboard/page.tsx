'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AdminTable from './components/AdminTable';
import UserTable from './components/UserTable';
import StatsCards from './components/StatsCards';
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
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<Stats>({
        totalGames: 0,
        winRate: 0,
        highestScore: 0,
        rank: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication first
    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/users/stats');
            if (!response.ok) {
                throw new Error('Failed to fetch stats');
            }
            const data = await response.json();
            setStats(data.stats);
        } catch (error) {
            console.error('Error fetching stats:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch stats",
            });
        }
    };

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                // Only fetch if user is logged in and component is mounted
                if (!user || !isMounted) return;

                setIsLoading(true);

                // Fetch users
                const usersResponse = await fetch('/api/users/get');
                if (!usersResponse.ok) throw new Error('Failed to fetch users');
                const usersData = await usersResponse.json();
                if (isMounted) {
                    setUsers(usersData);
                }

                // Fetch stats
                await fetchStats();

            } catch (err) {
                if (isMounted) {
                    console.error('Dashboard error:', err);
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Failed to fetch dashboard data",
                    });
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, [user]);

    // Show loading state
    if (!user) {
        return null;
    }

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
                    Welcome back, {user.username}!
                </h1>
                <p className="text-gray-400">
                    Track your progress and compete with other players.
                </p>
            </div>

            {/* Stats Cards */}
            <StatsCards {...stats} />

            {/* User/Admin Table */}
            {user.role === 'admin' ? (
                <AdminTable
                    users={users}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    setUsers={setUsers}
                />
            ) : (
                <UserTable users={users} />
            )}
        </div>
    );
}