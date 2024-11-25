'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from "lucide-react";

export default function MainPage() {
    const router = useRouter();
    const [user, setUser] = useState<{ username: string; role: string } | null>(null);

    useEffect(() => {
        const session = localStorage.getItem('session');
        if (session) {
            setUser(JSON.parse(session));
        }
    }, []);

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-14rem)]">
            <div className="bg-[#222222] text-gray-200 rounded-lg p-8 w-full max-w-md shadow-2xl shadow-black">
                <h2 className="text-2xl font-bold text-center mb-6 text-zinc-400">
                    Welcome to Rock Paper Scissors
                </h2>

                <div className="space-y-6">
                    {user ? (
                        <div className="text-center space-y-4">
                            <p className="text-lg text-gray-400">
                                Ready to play, {user.username}?
                            </p>
                            <button
                                onClick={() => router.push('/rps')}
                                className="w-full bg-[#444444] text-white py-3 rounded-md hover:bg-gray-700 transition-all font-semibold"
                            >
                                Start Playing
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-center text-gray-400">
                                Sign in to start playing and track your scores
                            </p>
                            <button
                                onClick={() => router.push('/login')}
                                className="w-full bg-[#444444] text-white py-3 rounded-md hover:bg-gray-700 transition-all font-semibold flex items-center justify-center gap-2"
                            >
                                <LogIn className="w-5 h-5" />
                                Sign In
                            </button>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-700">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 text-gray-400">
                                <i className="fas fa-gamepad text-sm w-5"></i>
                                <span>Play anytime, anywhere</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-400">
                                <i className="fas fa-chart-bar text-sm w-5"></i>
                                <span>Track your performance</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-400">
                                <i className="fas fa-trophy text-sm w-5"></i>
                                <span>Compete on the leaderboard</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}