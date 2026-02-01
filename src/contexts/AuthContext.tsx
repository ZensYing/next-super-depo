"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

// Simple cookie helper
const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

interface User {
    id: number;
    email: string;
    role: string;
    fullName?: string;
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
    const [user, setUser] = useState<User | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const router = useRouter();
    const { getLocalizedPath } = useLanguage();

    useEffect(() => {
        // Check for token on initial load
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            try {
                // Assuming storedUser is the JSON string of the User object
                // If the intent is to decode the token, the logic would be different.
                // For now, we'll parse storedUser as a User object.
                const parsedUser: User = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (e) {
                console.error("Failed to parse user data", e);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setIsInitialized(true);
    }, []);

    const login = (token: string, userData: User) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setCookie('token', token, 7); // Set token in cookie for middleware
        setUser(userData);
        // You might want to navigate here, but it's often better to let the component handle navigation
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        deleteCookie('token'); // Remove token from cookie
        setUser(null);
        router.push(getLocalizedPath('/login'));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isInitialized }}>
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
