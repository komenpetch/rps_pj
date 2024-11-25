'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type User = {
    username: string;
    role: string;
} | null;

type AuthContextType = {
    user: User;
    setUser: (user: User) => void;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const router = useRouter();

    useEffect(() => {
        const checkSession = () => {
            const session = localStorage.getItem('session');
            if (session) {
                setUser(JSON.parse(session));
            } else {
                setUser(null);
            }
        };

        checkSession();
        window.addEventListener('storage', checkSession);
        return () => window.removeEventListener('storage', checkSession);
    }, []);

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            localStorage.removeItem('session');
            setUser(null);
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}