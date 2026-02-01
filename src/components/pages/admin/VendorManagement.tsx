"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    Store,
    Settings,
    BarChart3,
    DollarSign,
    Package,
    CheckCircle2,
    XCircle,
    Eye,
    ExternalLink,
    Clock,
    ShieldCheck,
    Maximize2,
    FolderTree,
    RefreshCw,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { approveVendor, assignVendorCategory } from "@/app/[lang]/super-admin-depo/depos/actions";
import { env } from "@/config/env";

interface VendorManagementProps {
    initialVendors: any[];
    initialCategories: any[];
}

export default function VendorManagement({ initialVendors, initialCategories }: VendorManagementProps) {
    const { currentLanguage } = useLanguage();
    const [vendors, setVendors] = useState<any[]>(initialVendors);
    const [categories, setCategories] = useState<any[]>(initialCategories);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<any>(null);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);

    const [assignedCategoryId, setAssignedCategoryId] = useState<string>("");
    const [assignedSubCategoryId, setAssignedSubCategoryId] = useState<string>("");

    // Sync with server data
    useEffect(() => {
        setVendors(initialVendors);
    }, [initialVendors]);

    useEffect(() => {
        setCategories(initialCategories);
    }, [initialCategories]);

    const getLocalizedName = (item: any) => {
        if (!item) return "";
        if (currentLanguage.code === 'km') return item.nameKm || item.name;
        if (currentLanguage.code === 'zh') return item.nameZh || item.nameEn || item.name;
        return item.nameEn || item.name;
    };

    const sidebarItems = [
        { icon: LayoutDashboard, label: "Overview", href: "/super-admin-depo" },
        { icon: Users, label: "User Management", href: "/super-admin-depo/users" },
        { icon: Store, label: "Depos (Vendors)", href: "/super-admin-depo/depos", active: true },
        { icon: FolderTree, label: "Categories", href: "/super-admin-depo/categories" },
        { icon: ShoppingBag, label: "Products", href: "/super-admin-depo/products" },
        { icon: DollarSign, label: "Transactions", href: "/super-admin-depo/transactions" },
        { icon: BarChart3, label: "Reports", href: "/super-admin-depo/reports" },
        { icon: Settings, label: "Settings", href: "/super-admin-depo/settings" },
    ];

    useEffect(() => {
        if (selectedVendor) {
            setAssignedCategoryId(selectedVendor.categoryRelation?.id?.toString() || "");
            setAssignedSubCategoryId(selectedVendor.subCategoryRelation?.id?.toString() || "");
        }
    }, [selectedVendor]);

    const handleApprove = async (id: number) => {
        try {
            setIsLoading(true);
            const ok = await approveVendor(id);
            if (ok) {
                toast.success("Success", { description: "Vendor approved successfully" });
                setSelectedVendor(null);
            } else {
                toast.error("Error", { description: "Failed to approve vendor" });
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssignCategory = async () => {
        if (!selectedVendor || !assignedCategoryId) return;
        try {
            setIsLoading(true);
            const ok = await assignVendorCategory(
                selectedVendor.id,
                parseInt(assignedCategoryId),
                assignedSubCategoryId ? parseInt(assignedSubCategoryId) : undefined
            );
            if (ok) {
                toast.success("Success", { description: "Category assigned successfully" });
            } else {
                toast.error("Error", { description: "Failed to assign category" });
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProtectedRoute allowedRoles={['superadmin']}>
            <DashboardLayout
                title="Super Admin"
                userRole="Administrator"
                sidebarItems={sidebarItems}
            >
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Vendor Management</h2>
                            <p className="text-muted-foreground text-sm">Review and categorize registered stores. (Network Safe)</p>
                        </div>
                        <Button variant="outline" onClick={() => window.location.reload()}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                    </div>

                    < Card>
                        <CardHeader>
                            <CardTitle>Vendor Registration Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Store Name</TableHead>
                                        <TableHead>Contact Person</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Date Joined</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {vendors.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No vendors found</TableCell>
                                        </TableRow>
                                    ) : (
                                        vendors.map((vendor) => (
                                            <TableRow key={vendor.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        {vendor.logo ? (
                                                            <div className="relative w-8 h-8 rounded border overflow-hidden">
                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img
                                                                    src={`${env.NEXT_PUBLIC_API_URL}${vendor.logo}`}
                                                                    alt={vendor.storeName}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                                                                <Store className="h-4 w-4 text-primary" />
                                                            </div>
                                                        )}
                                                        {vendor.storeName}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{vendor.firstName} {vendor.lastName}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-medium text-sm">
                                                            {vendor.categoryRelation ? getLocalizedName(vendor.categoryRelation) : vendor.category || "Unassigned"}
                                                        </span>
                                                        {vendor.subCategoryRelation && (
                                                            <span className="text-xs text-muted-foreground bg-muted w-fit px-1.5 rounded">
                                                                {getLocalizedName(vendor.subCategoryRelation)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{new Date(vendor.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    {vendor.isApproved ? (
                                                        <div className="flex items-center gap-1 text-green-600 font-medium text-xs">
                                                            <CheckCircle2 className="h-3 w-3" /> Approved
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1 text-amber-600 font-medium text-xs">
                                                            <Clock className="h-3 w-3" /> Pending
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="ghost" size="sm" onClick={() => setSelectedVendor(vendor)}>
                                                                <Eye className="h-4 w-4 mr-2" /> Review
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-2xl">
                                                            <DialogHeader>
                                                                <DialogTitle>Review Vendor: {vendor.storeName}</DialogTitle>
                                                                <DialogDescription>
                                                                    Verify the information below before approving the store.
                                                                </DialogDescription>
                                                            </DialogHeader>

                                                            <div className="flex flex-col md:flex-row gap-6 py-4">
                                                                <div className="flex flex-col items-center gap-4">
                                                                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider w-full">Store Logo</h4>
                                                                    <div
                                                                        className="relative w-32 h-32 rounded-lg border bg-muted overflow-hidden cursor-zoom-in group"
                                                                        onClick={() => setPreviewSrc(`${env.NEXT_PUBLIC_API_URL}${vendor.logo}`)}
                                                                    >
                                                                        {vendor.logo ? (
                                                                            <>
                                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                                <img
                                                                                    src={`${env.NEXT_PUBLIC_API_URL}${vendor.logo}`}
                                                                                    alt={vendor.storeName}
                                                                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                                                />
                                                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                                    <Maximize2 className="text-white h-6 w-6" />
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <Store className="h-12 w-12 text-muted-foreground" />
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                    <div className="space-y-4">
                                                                        <div>
                                                                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Personal Information</h4>
                                                                            <div className="space-y-1 text-sm">
                                                                                <p><span className="text-muted-foreground">Name:</span> {vendor.firstName} {vendor.lastName}</p>
                                                                                <p><span className="text-muted-foreground">Gender:</span> {vendor.gender}</p>
                                                                                <p><span className="text-muted-foreground">Email:</span> {vendor.user?.email}</p>
                                                                                <p><span className="text-muted-foreground">Phone:</span> {vendor.phone}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Store Details</h4>
                                                                            <div className="space-y-1 text-sm">
                                                                                <p><span className="text-muted-foreground">Category:</span> {vendor.category}</p>
                                                                                <p><span className="text-muted-foreground">Address:</span> {vendor.address}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-4">
                                                                        <div>
                                                                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Business Documents</h4>
                                                                            {vendor.businessLicense ? (
                                                                                <div
                                                                                    onClick={() => setPreviewSrc(`${env.NEXT_PUBLIC_API_URL}${vendor.businessLicense}`)}
                                                                                    className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors cursor-pointer group"
                                                                                >
                                                                                    <ShieldCheck className="h-8 w-8 text-primary" />
                                                                                    <div className="flex-1">
                                                                                        <p className="text-sm font-medium">Business License</p>
                                                                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                                                            <Maximize2 className="h-3 w-3" /> Click to Preview
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            ) : (
                                                                                <p className="text-sm text-destructive">No license uploaded</p>
                                                                            )}
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Location</h4>
                                                                            {vendor.locationLink ? (
                                                                                <a
                                                                                    href={vendor.locationLink}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-primary text-sm hover:underline flex items-center gap-1"
                                                                                >
                                                                                    Google Maps Link <ExternalLink className="h-3 w-3" />
                                                                                </a>
                                                                            ) : (
                                                                                <p className="text-sm text-muted-foreground italic">No location link provided</p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="mt-4 pt-4 border-t space-y-4">
                                                                <div className="flex items-center gap-2">
                                                                    <FolderTree className="h-5 w-5 text-primary" />
                                                                    <h4 className="font-semibold">Assign Business Category</h4>
                                                                </div>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div className="space-y-2">
                                                                        <label className="text-sm font-medium">Main Category</label>
                                                                        <Select
                                                                            value={assignedCategoryId}
                                                                            onValueChange={(val) => {
                                                                                setAssignedCategoryId(val);
                                                                                setAssignedSubCategoryId("");
                                                                            }}
                                                                        >
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Select Category" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                {categories.map(cat => (
                                                                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                                                                        {cat.icon && <span className="mr-2">{cat.icon}</span>}
                                                                                        {getLocalizedName(cat)}
                                                                                    </SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-sm font-medium">Sub-category</label>
                                                                        <Select
                                                                            value={assignedSubCategoryId}
                                                                            onValueChange={setAssignedSubCategoryId}
                                                                            disabled={!assignedCategoryId}
                                                                        >
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Select Sub-category" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                {categories.find(c => c.id.toString() === assignedCategoryId)?.subCategories.map((sub: any) => (
                                                                                    <SelectItem key={sub.id} value={sub.id.toString()}>
                                                                                        {getLocalizedName(sub)}
                                                                                    </SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    className="w-full"
                                                                    onClick={handleAssignCategory}
                                                                    disabled={!assignedCategoryId || isLoading}
                                                                >
                                                                    {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                                                    Update Store Category
                                                                </Button>
                                                            </div>

                                                            <div className="flex justify-end gap-3 pt-4 border-t">
                                                                <Button variant="outline" onClick={() => setSelectedVendor(null)}>Close</Button>
                                                                {!vendor.isApproved && (
                                                                    <Button
                                                                        onClick={() => handleApprove(vendor.id)}
                                                                        disabled={isLoading}
                                                                        className="bg-green-600 hover:bg-green-700"
                                                                    >
                                                                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                                                                        Approve Store
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>

            <Dialog open={!!previewSrc} onOpenChange={(open) => !open && setPreviewSrc(null)}>
                <DialogContent className="max-w-[90vw] max-h-[90vh] p-1 border-none bg-white rounded-lg overflow-hidden">
                    <div className="relative w-full h-full flex flex-col">
                        <div className="flex justify-between items-center p-2 border-b">
                            <h3 className="text-sm font-medium">Document Preview</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPreviewSrc(null)}
                            >
                                Close
                            </Button>
                        </div>
                        <div className="flex-1 w-full h-[80vh] bg-muted/20 flex items-center justify-center overflow-auto">
                            {previewSrc && (
                                previewSrc.toLowerCase().endsWith('.pdf') ? (
                                    <iframe
                                        src={previewSrc}
                                        className="w-full h-full border-none"
                                        title="PDF Preview"
                                    />
                                ) : (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                        src={previewSrc}
                                        alt="Preview"
                                        className="max-w-full max-h-full object-contain shadow-sm"
                                    />
                                )
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </ProtectedRoute>
    );
}
