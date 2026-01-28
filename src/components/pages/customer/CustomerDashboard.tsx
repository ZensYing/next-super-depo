
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
    LayoutDashboard,
    ShoppingBag,
    Heart,
    Clock,
    User,
    MapPin,
    CreditCard
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CustomerDashboard() {
    const sidebarItems = [
        { icon: LayoutDashboard, label: "My Account", href: "/customer-dashboard" },
        { icon: ShoppingBag, label: "My Orders", href: "/customer-dashboard/orders" },
        { icon: Heart, label: "Wishlist", href: "/customer-dashboard/wishlist" },
        { icon: MapPin, label: "Addresses", href: "/customer-dashboard/addresses" },
        { icon: CreditCard, label: "Payment Methods", href: "/customer-dashboard/payment" },
        { icon: User, label: "Profile", href: "/customer-dashboard/profile" },
    ];

    return (
        <DashboardLayout
            title="My Account"
            userRole="Customer"
            sidebarItems={sidebarItems}
        >
            <div className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Welcome back, John Doe!</h2>
                        <p className="text-muted-foreground">Gold Member</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <Button variant="link" className="px-0 h-auto text-xs">View History</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Wishlist</CardTitle>
                            <Heart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">5 Items</div>
                            <Button variant="link" className="px-0 h-auto text-xs">View Wishlist</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Delivery</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1</div>
                            <p className="text-xs text-muted-foreground">Arriving Tomorrow</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Order Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>Current Order Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            <div className="h-24 w-24 bg-muted rounded-md flex items-center justify-center shrink-0">
                                Product Img
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-lg">Order #ORD-2024-001</h4>
                                <p className="text-sm text-muted-foreground mb-4">Placed on March 15, 2024</p>

                                {/* Progress Bar */}
                                <div className="relative pt-4 pb-2">
                                    <div className="flex mb-2 items-center justify-between text-xs font-semibold tracking-wider uppercase">
                                        <span>Prosessing</span>
                                        <span>Shipped</span>
                                        <span className="text-primary">Out for Delivery</span>
                                        <span className="text-muted-foreground">Delivered</span>
                                    </div>
                                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/20">
                                        <div style={{ width: "75%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                                    </div>
                                </div>
                            </div>
                            <Button>Track Order</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
