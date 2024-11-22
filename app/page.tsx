'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MainPage() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if the user is logged in
        const session = localStorage.getItem('session'); // Simulating session storage
        setIsLoggedIn(!!session);
    }, []);

    const handleEnterRPS = () => {
        if (isLoggedIn) {
            router.push('/rps');
        } else {
            router.push('/login'); // Redirect to login if not logged in
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
            <h1 className="text-4xl font-bold mb-6">Welcome to the Game!</h1>
            <button
                onClick={handleEnterRPS}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded"
            >
                Enter Rock Paper Scissors
            </button>
        </div>
    );
}
