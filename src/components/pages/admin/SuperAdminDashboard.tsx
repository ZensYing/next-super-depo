
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    Store,
    Settings,
    BarChart3,
    DollarSign,
    Package
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SuperAdminDashboard() {
    const sidebarItems = [
        { icon: LayoutDashboard, label: "Overview", href: "/super-admin-depo" },
        { icon: Users, label: "User Management", href: "/super-admin-depo/users" },
        { icon: Store, label: "Depos (Vendors)", href: "/super-admin-depo/depos" },
        { icon: ShoppingBag, label: "Products", href: "/super-admin-depo/products" },
        { icon: DollarSign, label: "Transactions", href: "/super-admin-depo/transactions" },
        { icon: BarChart3, label: "Reports", href: "/super-admin-depo/reports" },
        { icon: Settings, label: "Settings", href: "/super-admin-depo/settings" },
    ];

    return (
        <DashboardLayout
            title="Super Admin"
            userRole="Administrator"
            sidebarItems={sidebarItems}
        >
            <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$45,231.89</div>
                            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Depos</CardTitle>
                            <Store className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">124</div>
                            <p className="text-xs text-muted-foreground">+12 new depos this month</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12,234</div>
                            <p className="text-xs text-muted-foreground">+2,341 active now</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">6,543</div>
                            <p className="text-xs text-muted-foreground">+345 added this week</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity / Content */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Recent Revenue</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                            <p className="text-muted-foreground">Chart Visualization Placeholder</p>
                        </CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Recent Depos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                            D{i}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Depo Store {i}</p>
                                            <p className="text-xs text-muted-foreground">Joined 2 days ago</p>
                                        </div>
                                        <div className="text-sm font-medium text-green-600">Active</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
