"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Package, Save, PlusCircle, X, UploadCloud, Languages, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { translateText } from "@/app/actions/translate";
import { createProduct, updateProduct, deleteProduct } from "@/app/[lang]/super-admin-depo/products/actions";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { LocalizedLink as Link } from "@/components/LocalizedLink";
import { useRouter } from "next/navigation";

interface ProductManagementProps {
    initialProducts: any[];
    metaData: {
        categories: any[];
        typeFoods: any[];
        currencies: any[];
    };
    isVendorView?: boolean;
    currentVendorId?: string;
}
export default function ProductManagement({ initialProducts, metaData, isVendorView, currentVendorId }: ProductManagementProps) {
    const { currentLanguage } = useLanguage();
    const language = currentLanguage.code;
    const router = useRouter();
    const [products, setProducts] = useState(initialProducts);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleEdit = (product: any) => {
        router.push(`/${language}/super-admin-depo/products/edit/${product.id}`);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const success = await deleteProduct(id);
        if (success) {
            setProducts(products.filter((p: any) => p.id !== id));
            toast.success("Product deleted");
        } else {
            toast.error("Delete failed");
        }
    };

    const filteredProducts = products.filter((p: any) =>
        p.productNameKh?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.productNameEn?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Product Management</h2>
                    <p className="text-muted-foreground">Manage inventory, pricing, and details.</p>
                </div>
                <Link to="/super-admin-depo/products/create">
                    <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                        <Plus className="h-4 w-4 mr-2" /> New Product
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Category</TableHead>
                                {!isVendorView && <TableHead>Vendor</TableHead>}
                                <TableHead>Stock</TableHead>
                                <TableHead>Price Info</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No products found</TableCell>
                                </TableRow>
                            ) : (
                                filteredProducts.map((p: any) => (
                                    <TableRow key={p.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                                                    {p.mainImage ? (
                                                        <img src={p.mainImage} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="h-5 w-5 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{p.productNameKh}</span>
                                                    <div className="flex flex-wrap gap-x-2 text-[11px] text-muted-foreground">
                                                        {p.productNameEn && <span>{p.productNameEn}</span>}
                                                        {p.productNameKo && <span className="text-violet-600">• {p.productNameKo}</span>}
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground uppercase mt-1 tracking-tighter">{p.slug}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {p.category?.nameEn || p.category?.nameKh}
                                            {p.subCategory && <span className="text-xs text-muted-foreground block">/ {p.subCategory.nameEn || p.subCategory.nameKh}</span>}
                                        </TableCell>
                                        {!isVendorView && <TableCell>{p.vendor?.vendorName}</TableCell>}
                                        <TableCell>
                                            {p.unlimitedStock ? <Badge variant="secondary">Unlimited</Badge> : p.stockQuantity}
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {p.productPrices?.length > 0 ? (
                                                <div className="flex flex-col gap-1">
                                                    {p.productPrices.slice(0, 2).map((pp: any) => (
                                                        <div key={pp.id} className="whitespace-nowrap">
                                                            {pp.price} {pp.currency?.title} / {pp.unitLabel || pp.typeFood?.title}
                                                        </div>
                                                    ))}
                                                    {p.productPrices.length > 2 && <span className="text-muted-foreground">+{p.productPrices.length - 2} more</span>}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground italic">No prices</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={p.status === 'published' ? 'default' : 'secondary'}>{p.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(p.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
