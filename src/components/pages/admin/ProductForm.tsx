"use client";

import { useState } from "react";
import {
    Save,
    X,
    UploadCloud,
    Languages,
    Sparkles,
    Package,
    PlusCircle,
    ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { translateText } from "@/app/actions/translate";
import { createProduct, updateProduct } from "@/app/[lang]/super-admin-depo/products/actions";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { LocalizedLink as Link } from "@/components/LocalizedLink";
import { useRouter } from "next/navigation";
import DepoSetupDialog from "./DepoSetupDialog";
import { compressImage, isValidImageType, formatFileSize } from "@/lib/imageCompression";

const MAX_SIZE_MB = 2;

interface ProductFormProps {
    initialData?: any;
    metaData: {
        categories: any[];
        vendors: any[];
        typeFoods: any[];
        currencies: any[];
    };
    userRole?: string;
    userVendorId?: string;
}

export default function ProductForm({
    initialData,
    metaData,
    userRole,
    userVendorId
}: ProductFormProps) {
    const router = useRouter();
    const { currentLanguage } = useLanguage();
    const language = currentLanguage.code;
    const [isLoading, setIsLoading] = useState(false);
    const [isDepoDialogOpen, setIsDepoDialogOpen] = useState(false);
    const [localVendors, setLocalVendors] = useState(metaData.vendors || []);

    // Form State
    const [formData, setFormData] = useState<any>(initialData || {
        productNameKh: "",
        productNameEn: "",
        productNameKo: "",
        slug: "",
        description: "",
        categoryId: "",
        subCategoryId: "",
        stockQuantity: "0",
        unlimitedStock: false,
        weight: "0",
        discount: "0",
        status: "draft",
        mainImage: "",
        subImages: [],
        prices: []
    });

    const toSlug = (text: string) => {
        return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    };

    const getLocalizedName = (item: any) => {
        if (!item) return "";
        switch (language) {
            case 'km': return item.nameKh || item.nameEn || item.title || "";
            case 'ko': return item.nameKo || item.nameEn || item.title || "";

            default: return item.nameEn || item.nameKh || item.title || "";
        }
    };

    const ensureLocalImage = async (icon: string) => {
        if (!icon) return "";
        const storageUrl = process.env.NEXT_PUBLIC_STORAGE_API_URL || "http://localhost:5001";
        if (icon.startsWith('http') && !icon.includes(storageUrl)) {
            try {
                const res = await fetch(`${storageUrl}/api/upload-url`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: icon })
                });
                const data = await res.json();
                if (data.success) return data.url;
            } catch (error) {
                console.error("Localize image failed:", error);
            }
        }
        return icon;
    };

    const ensureLocalImages = async (icons: string[]) => {
        if (!icons || icons.length === 0) return [];
        return Promise.all(icons.map(icon => ensureLocalImage(icon)));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const localizedMainImage = await ensureLocalImage(formData.mainImage);
            const localizedSubImages = await ensureLocalImages(formData.subImages);

            const submitData = {
                ...formData,
                mainImage: localizedMainImage,
                subImages: localizedSubImages
            };

            if (initialData?.id) {
                const res = await updateProduct(initialData.id, submitData);
                if (res.ok) {
                    toast.success("Product updated successfully");
                    router.push(`/${language}/super-admin-depo/products`);
                } else {
                    toast.error(res.error || "Failed to update product");
                }
            } else {
                const res = await createProduct(submitData);
                if (res.ok) {
                    toast.success("Product created successfully");
                    router.push(`/${language}/super-admin-depo/products`);
                } else {
                    toast.error(res.error || "Failed to create product");
                }
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const addPriceRow = () => {
        setFormData({
            ...formData,
            prices: [...formData.prices, {
                typeFoodId: metaData.typeFoods[0]?.id || "",
                currencyId: metaData.currencies[0]?.id || "",
                price: 0,
                unitLabel: ""
            }]
        });
    };

    const removePriceRow = (index: number) => {
        const newPrices = [...formData.prices];
        newPrices.splice(index, 1);
        setFormData({ ...formData, prices: newPrices });
    };

    const updatePriceRow = (index: number, field: string, value: any) => {
        const newPrices = [...formData.prices];
        newPrices[index] = { ...newPrices[index], [field]: value };
        setFormData({ ...formData, prices: newPrices });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-20">
            <div className="flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 py-4 border-b">
                <div className="flex items-center gap-4">
                    <Link to="/super-admin-depo/products">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">{initialData?.id ? "Edit Product" : "Create New Product"}</h1>
                        <p className="text-sm text-muted-foreground">Fill in the details to list your product.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link to="/super-admin-depo/products">
                        <Button variant="outline" type="button">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 min-w-[120px]">
                        {isLoading ? (
                            <Package className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        {initialData?.id ? "Save Changes" : "Create Product"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <Card className="border-none shadow-sm ring-1 ring-gray-100">
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Name (Khmer) *</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            required
                                            value={formData.productNameKh}
                                            onChange={e => setFormData({ ...formData, productNameKh: e.target.value })}
                                            placeholder="ឈ្មោះផលិតផល..."
                                            className="h-11 shadow-sm border-gray-200 focus-visible:ring-primary"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="h-11 w-11 shrink-0"
                                            onClick={async () => {
                                                if (!formData.productNameKh) return toast.error("Please enter a Khmer name first");
                                                const loading = toast.loading("Translating...");
                                                try {
                                                    const [en, ko] = await Promise.all([
                                                        translateText(formData.productNameKh, "en"),
                                                        translateText(formData.productNameKh, "ko")
                                                    ]);
                                                    setFormData((prior: any) => ({
                                                        ...prior,
                                                        productNameEn: en || prior.productNameEn,
                                                        productNameKo: ko || prior.productNameKo,
                                                        slug: (en && !prior.slug) ? toSlug(en) : prior.slug
                                                    }));
                                                    toast.success("Translated!");
                                                } catch (e) {
                                                    toast.error("Translation failed");
                                                } finally {
                                                    toast.dismiss(loading);
                                                }
                                            }}
                                        >
                                            <Languages className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">Name (English)</Label>
                                        <Input
                                            value={formData.productNameEn}
                                            onChange={e => {
                                                const val = e.target.value;
                                                setFormData((prior: any) => ({
                                                    ...prior,
                                                    productNameEn: val,
                                                    slug: (!prior.slug || prior.slug === toSlug(prior.productNameEn)) ? toSlug(val) : prior.slug
                                                }));
                                            }}
                                            placeholder="Product Name..."
                                            className="h-11 shadow-sm border-gray-200 focus-visible:ring-primary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">Name (Korean)</Label>
                                        <Input
                                            value={formData.productNameKo || ""}
                                            onChange={e => setFormData({ ...formData, productNameKo: e.target.value })}
                                            placeholder="제품명..."
                                            className="h-11 shadow-sm border-gray-200 focus-visible:ring-primary"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Slug (URL) *</Label>
                                    <Input
                                        required
                                        value={formData.slug}
                                        onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                        className="h-11 shadow-sm border-gray-200 focus-visible:ring-primary font-mono text-sm"
                                        placeholder="product-unique-slug"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Description</Label>
                                    <Textarea
                                        rows={5}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe your product here..."
                                        className="shadow-sm border-gray-200 focus-visible:ring-primary"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing */}
                    <Card className="border-none shadow-sm ring-1 ring-gray-100">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Pricing & Units</CardTitle>
                            <Button type="button" variant="outline" size="sm" onClick={addPriceRow} className="text-primary border-primary/20 hover:bg-primary/5">
                                <PlusCircle className="h-4 w-4 mr-2" /> Add Price Option
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.prices.length === 0 && (
                                <div className="text-center py-10 border-2 border-dashed rounded-xl bg-gray-50/50">
                                    <p className="text-sm text-muted-foreground">No price options added yet. Products need at least one price.</p>
                                    <Button type="button" variant="link" onClick={addPriceRow} className="mt-2">Add your first price</Button>
                                </div>
                            )}

                            {formData.prices.map((price: any, index: number) => (
                                <div key={index} className="relative group grid grid-cols-1 md:grid-cols-12 gap-4 p-5 bg-gray-50/50 rounded-xl border border-gray-100 items-end">
                                    <div className="md:col-span-3 space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Unit Type</Label>
                                        <Select value={price.typeFoodId} onValueChange={v => updatePriceRow(index, 'typeFoodId', v)}>
                                            <SelectTrigger className="h-10 bg-white"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {metaData.typeFoods.map((t: any) => (
                                                    <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Currency</Label>
                                        <Select value={price.currencyId} onValueChange={v => updatePriceRow(index, 'currencyId', v)}>
                                            <SelectTrigger className="h-10 bg-white"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {metaData.currencies.map((c: any) => (
                                                    <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="md:col-span-3 space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Price</Label>
                                        <Input className="h-10 bg-white" type="number" step="0.01" value={price.price} onChange={e => updatePriceRow(index, 'price', parseFloat(e.target.value))} />
                                    </div>
                                    <div className="md:col-span-3 space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Label (e.g. 1kg)</Label>
                                        <Input className="h-10 bg-white" placeholder="1kg" value={price.unitLabel} onChange={e => updatePriceRow(index, 'unitLabel', e.target.value)} />
                                    </div>
                                    <div className="md:col-span-1 flex justify-center pb-1">
                                        <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full" onClick={() => removePriceRow(index)}>
                                            <X className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Media */}
                    <Card className="border-none shadow-sm ring-1 ring-gray-100">
                        <CardHeader>
                            <CardTitle>Product Images</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {/* Main Image */}
                            <div className="space-y-4">
                                <Label className="text-sm font-semibold">Main Display Image</Label>
                                {formData.mainImage ? (
                                    <div className="relative aspect-video w-full max-w-md rounded-2xl overflow-hidden border bg-muted shadow-inner group">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={formData.mainImage} alt="Main" className="w-full h-full object-contain" />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-4 right-4 w-9 h-9 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => setFormData({ ...formData, mainImage: "" })}
                                        >
                                            <X className="h-5 w-5" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Tabs defaultValue="upload" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2 mb-4 max-w-[400px]">
                                            <TabsTrigger value="upload">Upload File</TabsTrigger>
                                            <TabsTrigger value="url">Paste URL</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="upload" className="mt-0">
                                            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-muted/30 transition-all border-gray-200 hover:border-primary/50">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                                                    <UploadCloud className="w-12 h-12 mb-3 text-primary/40" />
                                                    <p className="text-sm font-medium">Click to upload main image</p>
                                                    <p className="text-xs">PNG, JPG or WebP (auto-compresses if &gt;2MB)</p>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        let file = e.target.files?.[0];
                                                        if (!file) return;

                                                        if (!isValidImageType(file)) {
                                                            toast.error("Please upload a valid image file");
                                                            return;
                                                        }

                                                        const loadingToast = toast.loading("Processing image...");
                                                        try {
                                                            // Compress if over 2MB
                                                            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                                                                toast.loading(`Compressing (${formatFileSize(file.size)})...`, { id: loadingToast });
                                                                file = await compressImage(file, { maxSizeMB: MAX_SIZE_MB });
                                                            }

                                                            const data = new FormData();
                                                            data.append("file", file);
                                                            toast.loading("Uploading...", { id: loadingToast });
                                                            const storageUrl = process.env.NEXT_PUBLIC_STORAGE_API_URL || "http://localhost:5001";
                                                            const res = await fetch(`${storageUrl}/api/upload`, { method: "POST", body: data });
                                                            const json = await res.json();
                                                            setFormData({ ...formData, mainImage: json.url });
                                                            toast.success("Uploaded!");
                                                        } catch (err) { toast.error("Upload failed"); }
                                                        finally { toast.dismiss(loadingToast); e.target.value = ''; }
                                                    }}
                                                />
                                            </label>
                                        </TabsContent>
                                        <TabsContent value="url" className="mt-0">
                                            <Input
                                                placeholder="https://example.com/image.png"
                                                value={formData.mainImage}
                                                onChange={e => setFormData({ ...formData, mainImage: e.target.value })}
                                                className="h-11 shadow-sm border-gray-200"
                                            />
                                        </TabsContent>
                                    </Tabs>
                                )}
                            </div>

                            {/* Sub Images */}
                            <div className="space-y-4">
                                <Label className="text-sm font-semibold">Gallery Images</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {formData.subImages && formData.subImages.map((img: string, idx: number) => (
                                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border bg-muted shadow-sm group">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={img} alt={`Sub ${idx}`} className="w-full h-full object-cover" />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-1 right-1 w-6 h-6 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity scale-90"
                                                onClick={() => {
                                                    const newSub = [...formData.subImages];
                                                    newSub.splice(idx, 1);
                                                    setFormData({ ...formData, subImages: newSub });
                                                }}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button type="button" className="aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-gray-50 hover:bg-white hover:border-primary/50 transition-all text-muted-foreground hover:text-primary gap-1">
                                                <PlusCircle className="h-6 w-6 opacity-40 group-hover:opacity-100" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Add More</span>
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader><DialogTitle>Add Gallery Image</DialogTitle></DialogHeader>
                                            <Tabs defaultValue="upload" className="w-full">
                                                <TabsList className="grid w-full grid-cols-2 mb-4">
                                                    <TabsTrigger value="upload">Upload</TabsTrigger>
                                                    <TabsTrigger value="url">Link</TabsTrigger>
                                                </TabsList>
                                                <TabsContent value="upload">
                                                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/30 transition-all border-gray-200">
                                                        <UploadCloud className="h-10 w-10 text-primary/40 mb-2" />
                                                        <span className="text-sm font-medium">Select Image File</span>
                                                        <input
                                                            type="file" className="hidden" accept="image/*"
                                                            onChange={async (e) => {
                                                                let file = e.target.files?.[0];
                                                                if (!file) return;

                                                                if (!isValidImageType(file)) {
                                                                    toast.error("Please upload a valid image file");
                                                                    return;
                                                                }

                                                                const loadingToken = toast.loading("Processing...");
                                                                try {
                                                                    // Compress if over 2MB
                                                                    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                                                                        toast.loading(`Compressing (${formatFileSize(file.size)})...`, { id: loadingToken });
                                                                        file = await compressImage(file, { maxSizeMB: MAX_SIZE_MB });
                                                                    }

                                                                    const data = new FormData();
                                                                    data.append("file", file);
                                                                    toast.loading("Uploading...", { id: loadingToken });
                                                                    const storageUrl = process.env.NEXT_PUBLIC_STORAGE_API_URL || "http://localhost:5001";
                                                                    const res = await fetch(`${storageUrl}/api/upload`, { method: "POST", body: data });
                                                                    const json = await res.json();
                                                                    setFormData((prev: any) => ({ ...prev, subImages: [...prev.subImages, json.url] }));
                                                                    toast.success("Added!");
                                                                } catch (e) { toast.error("Failed"); }
                                                                finally { toast.dismiss(loadingToken); e.target.value = ''; }
                                                            }}
                                                        />
                                                    </label>
                                                </TabsContent>
                                                <TabsContent value="url">
                                                    <div className="space-y-4">
                                                        <Input
                                                            placeholder="Paste image URL here..."
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    const val = (e.target as HTMLInputElement).value;
                                                                    if (val) {
                                                                        setFormData((prev: any) => ({ ...prev, subImages: [...prev.subImages, val] }));
                                                                        (e.target as HTMLInputElement).value = "";
                                                                        toast.success("Added!");
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                        <p className="text-[10px] text-muted-foreground text-center">Press Enter to add the link to gallery.</p>
                                                    </div>
                                                </TabsContent>
                                            </Tabs>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    {/* Organization */}
                    <Card className="border-none shadow-sm ring-1 ring-gray-100">
                        <CardHeader>
                            <CardTitle>Organization</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Vendor selection only for SuperAdmins without an assigned userVendorId or to support multiple stores */}
                            {userRole === 'superadmin' && (
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Pick your Depo</Label>

                                    {localVendors.length > 0 ? (
                                        <Select value={formData.vendorId} onValueChange={val => setFormData({ ...formData, vendorId: val })}>
                                            <SelectTrigger className="h-11 bg-white shadow-sm border-gray-200">
                                                <SelectValue placeholder="Select Depo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {localVendors.map((v: any) => (
                                                    <SelectItem key={v.id} value={v.id}>{v.vendorName}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg text-amber-700 text-sm">
                                            <span><strong>No Depos Found:</strong> Please create a Depo in "Manage Store" first.</span>
                                        </div>
                                    )}
                                    <p className="text-[10px] text-muted-foreground">Select which store this product belongs to.</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Category</Label>
                                <Select value={formData.categoryId} onValueChange={val => setFormData({ ...formData, categoryId: val, subCategoryId: "" })}>
                                    <SelectTrigger className="h-11 bg-white shadow-sm border-gray-200">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {metaData.categories.map((c: any) => (
                                            <SelectItem key={c.id} value={c.id}>{getLocalizedName(c)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Sub Category</Label>
                                <Select value={formData.subCategoryId} onValueChange={val => setFormData({ ...formData, subCategoryId: val })} disabled={!formData.categoryId}>
                                    <SelectTrigger className="h-11 bg-white shadow-sm border-gray-200">
                                        <SelectValue placeholder="Select Sub Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(() => {
                                            const selectedCat = metaData.categories.find((c: any) => c.id === formData.categoryId);
                                            const subs = selectedCat?.subCategories || [];
                                            return subs.length > 0 ? (
                                                subs.map((s: any) => (
                                                    <SelectItem key={s.id} value={s.id}>{getLocalizedName(s)}</SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-2 text-xs text-muted-foreground text-center">No sub-categories</div>
                                            );
                                        })()}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Inventory Stats */}
                    <Card className="border-none shadow-sm ring-1 ring-gray-100">
                        <CardHeader>
                            <CardTitle>Inventory & Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-semibold">Unlimited Stock</Label>
                                    <p className="text-[10px] text-muted-foreground italic">Skip inventory tracking</p>
                                </div>
                                <Switch checked={formData.unlimitedStock} onCheckedChange={checked => setFormData({ ...formData, unlimitedStock: checked })} />
                            </div>

                            {!formData.unlimitedStock && (
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Available Stock</Label>
                                    <Input
                                        type="number"
                                        value={formData.stockQuantity}
                                        onChange={e => setFormData({ ...formData, stockQuantity: e.target.value })}
                                        className="h-11 bg-white shadow-sm border-gray-200"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Weight (KG)</Label>
                                    <Input
                                        type="number" step="0.01"
                                        value={formData.weight}
                                        onChange={e => setFormData({ ...formData, weight: e.target.value })}
                                        className="h-11 bg-white shadow-sm border-gray-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Discount (%)</Label>
                                    <Input
                                        type="number" step="0.01"
                                        value={formData.discount}
                                        onChange={e => setFormData({ ...formData, discount: e.target.value })}
                                        className="h-11 bg-white shadow-sm border-gray-200 text-green-600 font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 pt-2 border-t mt-4">
                                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Listing Status</Label>
                                <Select value={formData.status} onValueChange={val => setFormData({ ...formData, status: val })}>
                                    <SelectTrigger className="h-11 bg-white shadow-sm border-primary/20 ring-primary/10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft" className="text-muted-foreground">Draft</SelectItem>
                                        <SelectItem value="published" className="text-primary font-bold">Published</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-[10px] text-muted-foreground">Draft products won't be visible to customers.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <DepoSetupDialog
                open={isDepoDialogOpen}
                onOpenChange={setIsDepoDialogOpen}
                onSuccess={(newDepo) => {
                    setLocalVendors([...localVendors, newDepo]);
                    setFormData({ ...formData, vendorId: newDepo.id });
                }}
            />
        </form>
    );
}
