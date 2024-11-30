import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Footer() {
    const { user } = useAuth();
    const router = useRouter();

    const navigationItems = [
        { path: '/', label: 'Home' },
        ...(user ? [
            { path: '/rps', label: 'Play Game' },
            { path: '/dashboard', label: 'Dashboard' },
            { path: '/leaderboard', label: 'Leaderboard' },
        ] : []),
    ];

    return (
        <footer className="bg-[#222222] text-gray-400 px-4 py-6 w-full">
            <div className="w-full max-w-[1536px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-white font-semibold mb-3">About</h3>
                        <p className="text-sm">
                            Rock Paper Scissors is a classic game. for an over a decade,
                            people have been playing it. Now,
                            you can play it online with your friends.
                            Compete with others and climb the leaderboard!
                        </p>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-3">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            {navigationItems.map((item) => (
                                <li key={item.path}>
                                    <button
                                        onClick={() => router.push(item.path)}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-3">Connect</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors scale-on-hover">
                                <i className="fab fa-steam"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors scale-on-hover">
                                <i className="fab fa-discord"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors scale-on-hover">
                                <i className="fab fa-github"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-700 text-center text-sm">
                    <p>© 2024 Rock Paper Scissors Games. Built by Komen Nitchaphon.</p>
                </div>
            </div>
        </footer>
    );
}