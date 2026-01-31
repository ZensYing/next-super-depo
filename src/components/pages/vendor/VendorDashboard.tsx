
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    ClipboardList,
    MessageCircle,
    Settings,
    DollarSign
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VendorDashboard() {
    const sidebarItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/super-depo" },
        { icon: Package, label: "My Products", href: "/super-depo/products" },
        { icon: ClipboardList, label: "Orders", href: "/super-depo/orders" },
        { icon: MessageCircle, label: "Messages", href: "/super-depo/messages" },
        { icon: DollarSign, label: "Earnings", href: "/super-depo/earnings" },
        { icon: Settings, label: "Shop Settings", href: "/super-depo/settings" },
    ];

    return (
        <DashboardLayout
            title="Vendor Portal"
            userRole="Depo Owner"
            sidebarItems={sidebarItems}
        >
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <Button>Add New Product</Button>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$12,345.00</div>
                            <p className="text-xs text-muted-foreground">+15% from last month</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">23</div>
                            <p className="text-xs text-muted-foreground">5 urgent</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">45</div>
                            <p className="text-xs text-muted-foreground">3 low stock</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rating</CardTitle>
                            <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">4.8</div>
                            <p className="text-xs text-muted-foreground">Based on 120 reviews</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-xs font-medium">
                                            Item
                                        </div>
                                        <div>
                                            <p className="font-medium">Order #ORD-{1000 + i}</p>
                                            <p className="text-sm text-muted-foreground">2 items • $120.00</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
                                            Pending
                                        </span>
                                        <Button variant="outline" size="sm">View</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
