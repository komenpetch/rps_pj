'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import Game from './components/Game';

export default function RPSPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        setIsLoading(false);
    }, [user, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#333333]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="flex-grow min-h-[calc(100vh-14rem)] flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <Game />
            </div>
        </div>
    );
}