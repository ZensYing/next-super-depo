"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LayoutDashboard, Store, Tags, Users, Package, Settings, Building2, Image } from "lucide-react";

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const sidebarItems = [
        {
            icon: LayoutDashboard,
            label: "Dashboard",
            href: "/super-admin-depo"
        },
        {
            icon: Users,
            label: "Users",
            href: "/super-admin-depo/users"
        },
        {
            icon: Store,
            label: "Vendors",
            href: "/super-admin-depo/depos"
        },
        {
            icon: Tags,
            label: "Categories",
            href: "/super-admin-depo/categories"
        },
        {
            icon: Image,
            label: "Banners",
            href: "/super-admin-depo/banners"
        },
        {
            icon: Package,
            label: "Products",
            href: "/super-admin-depo/products"
        },
        {
            icon: Building2,
            label: "Manage Store",
            href: "/super-admin-depo/my-store"
        },
        {
            icon: Settings,
            label: "Settings",
            href: "/super-admin-depo/settings"
        }
    ];

    return (
        <DashboardLayout
            title="Super Admin"
            userRole="Super Admin"
            sidebarItems={sidebarItems}
        >
            {children}
        </DashboardLayout>
    );
}
