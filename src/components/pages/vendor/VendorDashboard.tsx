"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    ClipboardList,
    MessageCircle,
    Settings,
    DollarSign,
    Store
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { AlertCircle, Clock, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function VendorDashboard() {
    const [vendor, setVendor] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                const response = await api.get('/vendors/me');
                setVendor(response.data);
            } catch (error) {
                console.error("Failed to fetch vendor", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchVendor();
    }, []);

    const sidebarItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/vendor/dashboard" },
        ...(vendor?.isApproved ? [
            { icon: Package, label: "My Products", href: "/vendor/products" },
            { icon: ClipboardList, label: "Orders", href: "/vendor/orders" },
            { icon: MessageCircle, label: "Messages", href: "/vendor/messages" },
            { icon: DollarSign, label: "Earnings", href: "/vendor/earnings" },
        ] : []),
        { icon: Settings, label: "Shop Settings", href: "/vendor/settings" },
    ];

    return (
        <ProtectedRoute allowedRoles={['vendor_admin']}>
            <DashboardLayout
                title="Vendor Portal"
                userRole="Depo Owner"
                sidebarItems={sidebarItems}
            >
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold tracking-tight">
                            {vendor?.isApproved ? "Dashboard" : "Vendor Status"}
                        </h2>
                        <Button disabled={!vendor?.isApproved}>Add New Product</Button>
                    </div>

                    {!isLoading && !vendor?.isApproved && (
                        <>
                            <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-800">
                                <Clock className="h-4 w-4 text-blue-600" />
                                <AlertTitle className="font-bold flex items-center gap-2">
                                    Approval Pending
                                </AlertTitle>
                                <AlertDescription className="text-blue-700">
                                    Your vendor application is currently being reviewed by our team.
                                    Some features will be limited until your account is approved.
                                    This process usually takes 12-24 hours.
                                </AlertDescription>
                            </Alert>

                            {/* Show basic shop info while waiting */}
                            <div className="grid gap-6 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Store className="h-5 w-5 text-primary" />
                                            Shop Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <span className="text-muted-foreground">Store Name:</span>
                                            <span className="font-medium">{vendor?.storeName}</span>

                                            <span className="text-muted-foreground">Category:</span>
                                            <span className="font-medium capitalize">{vendor?.category}</span>

                                            <span className="text-muted-foreground">Phone:</span>
                                            <span className="font-medium">{vendor?.phone}</span>

                                            <span className="text-muted-foreground">Address:</span>
                                            <span className="font-medium">{vendor?.address}</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <AlertCircle className="h-5 w-5 text-amber-500" />
                                            What happens next?
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-muted-foreground space-y-3">
                                        <p>1. Our administrators will verify your business license and store details.</p>
                                        <p>2. You may receive a phone call from our verification team.</p>
                                        <p>3. Once approved, you'll receive a notification and full dashboard access will be unlocked.</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}

                    {vendor?.isApproved && (
                        <>
                            <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
                                <ShieldCheck className="h-4 w-4 text-green-600" />
                                <AlertTitle className="font-bold">Account Approved!</AlertTitle>
                                <AlertDescription className="text-green-700">
                                    Congratulations! Your vendor account is fully active. You can now manage your products and receive orders.
                                </AlertDescription>
                            </Alert>

                            {/* Stats Grid - Only show when approved */}
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">$0.00</div>
                                        <p className="text-xs text-muted-foreground">0% from last month</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">0</div>
                                        <p className="text-xs text-muted-foreground">Welcome aboard!</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                                        <Package className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">0</div>
                                        <p className="text-xs text-muted-foreground">Start adding products</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Rating</CardTitle>
                                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">N/A</div>
                                        <p className="text-xs text-muted-foreground">No reviews yet</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Recent Orders - Only show when approved */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Orders</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                                        <h3 className="text-lg font-medium text-muted-foreground">No orders yet</h3>
                                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                            Add your first product to start receiving orders from customers.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
