'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Don't show layout on login page
    if (pathname === '/login') {
        return <>{children}</>;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#333333]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#333333] flex flex-col">
            {/* Header */}
            <Header 
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                isUserMenuOpen={isUserMenuOpen}
                setIsUserMenuOpen={setIsUserMenuOpen}
            />

            {/* Navigation */}
            <Navigation 
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            />

            {/* Main Content */}
            <main className="flex-grow">
                <div className="w-full max-w-[1536px] mx-auto p-4 animate-fadeIn">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}