import { User, Menu, X, Settings, LogOut } from "lucide-react";
import { useAuth } from '../../app/contexts/AuthContext';
import { useRouter } from "next/navigation";

type HeaderProps = {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (value: boolean) => void;
    isUserMenuOpen: boolean;
    setIsUserMenuOpen: (value: boolean) => void;
};

export default function Header({ 
    isMobileMenuOpen, 
    setIsMobileMenuOpen,
    isUserMenuOpen,
    setIsUserMenuOpen 
}: HeaderProps) {
    const { user, logout } = useAuth();
    const router = useRouter();

    return (
        <header className="bg-[#222222] shadow-md px-4 py-3 relative z-50">
            <div className="w-full max-w-[1536px] mx-auto flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden text-gray-400 hover:text-white transition-colors"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                    <h1 className="text-xl font-bold text-zinc-400">
                        Rock Paper Scissors
                    </h1>
                </div>

                {user && (
                    <div className="relative">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors p-2 rounded-md"
                        >
                            <div className="w-8 h-8 rounded-full bg-[#444444] flex items-center justify-center">
                                <User className="w-5 h-5" />
                            </div>
                            <span className="hidden md:block">{user.username}</span>
                        </button>

                        {isUserMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-[#222222] rounded-md shadow-lg py-1 border border-gray-700 animate-slideDown">
                                <div className="px-4 py-2 border-b border-gray-700">
                                    <p className="text-white">{user.username}</p>
                                    <p className="text-sm text-gray-400">{user.role}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsUserMenuOpen(false);
                                        router.push('/settings');
                                    }}
                                    className="w-full text-left px-4 py-2 text-gray-400 hover:bg-[#444444] hover:text-white flex items-center gap-2 transition-colors"
                                >
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </button>
                                <button
                                    onClick={() => {
                                        setIsUserMenuOpen(false);
                                        logout();
                                    }}
                                    className="w-full text-left px-4 py-2 text-gray-400 hover:bg-[#444444] hover:text-white flex items-center gap-2 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}