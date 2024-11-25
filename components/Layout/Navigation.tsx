import { useAuth } from '../../app/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Gamepad2, LayoutDashboard, Trophy } from "lucide-react";

type NavigationProps = {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (value: boolean) => void;
};

export default function Navigation({ isMobileMenuOpen, setIsMobileMenuOpen }: NavigationProps) {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const navigationItems = [
        { path: '/', label: 'Home', icon: Home },
        ...(user ? [
            { path: '/rps', label: 'Play Game', icon: Gamepad2 },
            { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
        ] : []),
    ];

    return (
        <>
            {/* Mobile Navigation */}
            <div className={`lg:hidden bg-[#222222] border-b border-gray-700 menu-enter ${isMobileMenuOpen ? 'menu-enter-active' : ''}`}>
                <div className="px-2 py-3 space-y-1">
                    {navigationItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.path}
                                onClick={() => {
                                    router.push(item.path);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`w-full px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-colors
                                    ${pathname === item.path
                                        ? 'text-white bg-[#444444]'
                                        : 'text-gray-400 hover:text-white hover:bg-[#444444]'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:block bg-[#222222] border-t border-b border-gray-700 px-4">
                <div className="w-full max-w-[1536px] mx-auto">
                    <div className="flex space-x-1">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => router.push(item.path)}
                                    className={`px-4 py-3 text-sm flex items-center gap-2 transition-colors scale-on-hover
                                        ${pathname === item.path
                                            ? 'text-white bg-[#444444]'
                                            : 'text-gray-400 hover:text-white hover:bg-[#444444]'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </nav>
        </>
    );
}