import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Home, LogOut } from "lucide-react";

export default function GameLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<{ username: string; role: string } | null>(null);

    useEffect(() => {
        const session = localStorage.getItem('session');
        if (session) {
            setUser(JSON.parse(session));
        }
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            localStorage.removeItem('session');
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            {/* Navigation */}
            <nav className="bg-gray-800 border-b border-gray-700 px-4 py-3">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            className="text-gray-200 hover:text-white"
                            onClick={() => router.push('/')}
                        >
                            <Home className="h-5 w-5" />
                        </Button>
                        {user && (
                            <span className="text-gray-200">
                                Welcome, {user.username}
                            </span>
                        )}
                    </div>
                    {user && (
                        <Button
                            variant="ghost"
                            className="text-gray-200 hover:text-white"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-5 w-5" />
                        </Button>
                    )}
                </div>
            </nav>

            {/* Main content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 border-t border-gray-700 py-4">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
                    <p>© 2024 Rock Paper Scissors Game. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}