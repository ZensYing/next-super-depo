
"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LayoutDashboard, Package, ShoppingBag, Settings } from "lucide-react";

export default function VendorDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const sidebarItems = [
        {
            icon: LayoutDashboard,
            label: "Dashboard",
            href: "/vendor-dashboard"
        },
        {
            icon: Package,
            label: "Products",
            href: "/vendor-dashboard/products"
        },
        {
            icon: ShoppingBag,
            label: "Orders",
            href: "/vendor-dashboard/orders"
        },
        {
            icon: Settings,
            label: "Settings",
            href: "/vendor-dashboard/settings"
        }
    ];

    return (
        <DashboardLayout
            title="Vendor Portal"
            userRole="Vendor"
            sidebarItems={sidebarItems}
        >
            {children}
        </DashboardLayout>
    );
}
