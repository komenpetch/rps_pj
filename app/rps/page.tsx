'use client';

import { useRouter } from 'next/navigation';
import RpsGame from './components/RPSgame';

export default function RPSPage() {
    const router = useRouter();

    const ToDashboard = () => {
        router.push('/dashboard');
    };

    const handleLogout = () => {
        localStorage.removeItem('session');
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-6">Rock Paper Scissors Game</h1>
            
            <div className="flex gap-4">
                {/* Dashboard Button */}
                <button
                    onClick={ToDashboard}
                    className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                    Go to Dashboard
                </button>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                >
                    Logout
                </button>
            </div>
            <RpsGame />
        </div>
    );
}
