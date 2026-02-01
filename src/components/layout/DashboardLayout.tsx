"use client";

import { useState } from "react";
import { LocalizedLink as Link } from "@/components/LocalizedLink";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    User
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface SidebarItem {
    icon: any;
    label: string;
    href: string;
}

interface DashboardLayoutProps {
    children: React.ReactNode;
    sidebarItems: SidebarItem[];
    title: string;
    userRole: string; // "Admin" | "Vendor" | "Customer"
}

export const DashboardLayout = ({
    children,
    sidebarItems,
    title,
    userRole
}: DashboardLayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-muted/20 flex">
            {/* Sidebar */}
            <aside
                className={cn(
                    "bg-card border-r fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="h-full flex flex-col">
                    {/* Sidebar Header */}
                    <div className="h-16 border-b flex items-center px-6">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                                SD
                            </div>
                            <span className="font-bold text-lg">{title}</span>
                        </Link>
                    </div>

                    {/* Sidebar Nav */}
                    <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                            >
                                <Button
                                    variant={pathname === item.href ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-3",
                                        pathname === item.href && "bg-primary/10 text-primary hover:bg-primary/15"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.label}
                                </Button>
                            </Link>
                        ))}
                    </div>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t">
                        <Button variant="outline" className="w-full gap-2 justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 bg-card border-b px-4 flex items-center justify-between gap-4 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                        <h1 className="text-xl font-semibold hidden md:block">
                            {sidebarItems.find(i => i.href === pathname)?.label || "Dashboard"}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="pl-9 h-9 bg-muted/50"
                            />
                        </div>

                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive"></span>
                        </Button>

                        <div className="flex items-center gap-2 border-l pl-4 ml-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium">Demo User</p>
                                <p className="text-xs text-muted-foreground">{userRole}</p>
                            </div>
                            <Button variant="secondary" size="icon" className="rounded-full">
                                <User className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                    {children}
                </main>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};
