"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { user, isAuthenticated, isInitialized } = useAuth();
    const router = useRouter();
    const { getLocalizedPath } = useLanguage();

    useEffect(() => {
        if (isInitialized) {
            if (!isAuthenticated) {
                router.push(getLocalizedPath("/login"));
            } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
                // Redirect to their default dashboard if role not allowed
                if (user.role === 'superadmin') {
                    router.push(getLocalizedPath("/super-admin-depo"));
                } else if (user.role === 'vendor_admin') {
                    router.push(getLocalizedPath("/super-depo"));
                } else {
                    router.push(getLocalizedPath("/customer-dashboard"));
                }
            }
        }
    }, [isInitialized, isAuthenticated, user, allowedRoles, router, getLocalizedPath]);

    // Zero-flash: Hide UI until initialized AND authenticated AND authorized
    if (!isInitialized || !isAuthenticated || (allowedRoles && user && !allowedRoles.includes(user.role))) {
        return <div className="min-h-screen bg-background" />;
    }

    return <>{children}</>;
};
