"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession, signOut as nextAuthSignOut, signIn as nextAuthSignIn } from "next-auth/react";

interface User {
    id: string;
    email: string;
    role: string;
    fullName?: string;
    vendorId?: string | null;
}

interface AuthContextType {
    user: User | null;
    login: (token: string, userData: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<User | null>(null);
    const { getLocalizedPath } = useLanguage();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            setUser({
                id: session.user.id || '',
                email: session.user.email || '',
                // @ts-ignore
                role: session.user.role || 'customer',
                fullName: session.user.name || '',
                // @ts-ignore
                vendorId: session.user.vendorId || null
            });
        } else if (status === 'unauthenticated') {
            setUser(null);
        }
    }, [session, status]);

    // Legacy login support (will be replaced by direct signIn calls in components)
    // But keeping signature compatible for now to avoid breaking changes elsewhere
    const login = async (token: string, userData: User) => {
        // In NextAuth world, login is handled by signIn(), which refreshes session
        // This function is kept for compatibility but might trigger a full reload or re-auth
        // Ideally, components should call signIn() directly.

        // Since we are already moving towards NextAuth, we'll just set the user state locally
        // if this is called manually, but the source of truth is the session.
        setUser(userData);
    };

    const logout = async () => {
        await nextAuthSignOut({ redirect: false });
        setUser(null);
        router.push(getLocalizedPath('/login'));
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated: status === 'authenticated',
            isInitialized: status !== 'loading'
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
