"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Building2, Upload, Save, Camera, X, MapPin, Phone, Mail, FileText, Globe, Store as StoreIcon, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { updateMyStore, createMyStore } from "@/app/[lang]/super-admin-depo/my-store/actions";
import { useLanguage } from "@/contexts/LanguageContext";
import { compressImage, isValidImageType, formatFileSize } from "@/lib/imageCompression";

interface ManageStoreFormProps {
    initialData: any;
    userId: string;
}

const STORAGE_API = process.env.NEXT_PUBLIC_STORAGE_API_URL || 'http://localhost:5001';
const MAX_SIZE_MB = 2;

export default function ManageStoreForm({ initialData, userId }: ManageStoreFormProps) {
    const router = useRouter();
    const { currentLanguage } = useLanguage();
    const language = currentLanguage.code;

    const [isLoading, setIsLoading] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingBanner, setUploadingBanner] = useState(false);
    const [formData, setFormData] = useState({
        vendorName: initialData?.vendorName || "",
        vendorSlug: initialData?.vendorSlug || "",
        description: initialData?.description || "",
        contactPhone: initialData?.contactPhone || "",
        address: initialData?.address || "",
        email: initialData?.email || "",
        logo: initialData?.logo || "",
        banner: initialData?.banner || ""
    });

    const logoInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (file: File, type: 'logo' | 'banner') => {
        const setUploading = type === 'logo' ? setUploadingLogo : setUploadingBanner;
        setUploading(true);

        try {
            // Validate file type
            if (!isValidImageType(file)) {
                toast.error("Please upload a valid image file (JPEG, PNG, GIF, or WebP)");
                return;
            }

            // Compress if over 2MB
            let fileToUpload = file;
            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                toast.info(`Compressing image (${formatFileSize(file.size)})...`);
                fileToUpload = await compressImage(file, { maxSizeMB: MAX_SIZE_MB });
                toast.success(`Compressed to ${formatFileSize(fileToUpload.size)}`);
            }

            const formDataUpload = new FormData();
            formDataUpload.append('file', fileToUpload);

            const res = await fetch(`${STORAGE_API}/api/upload`, {
                method: 'POST',
                body: formDataUpload
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            const imageUrl = data.url || `${STORAGE_API}/uploads/${data.filename}`;

            setFormData(prev => ({ ...prev, [type]: imageUrl }));
            toast.success(`${type === 'logo' ? 'Profile' : 'Cover'} image uploaded successfully`);
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(`Failed to upload ${type} image`);
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file, type);
        }
        // Reset input so the same file can be selected again
        e.target.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let result;
            if (initialData) {
                result = await updateMyStore(formData);
            } else {
                result = await createMyStore({
                    ...formData,
                    vendorName: formData.vendorName,
                    vendorSlug: formData.vendorSlug
                });
            }

            if (result.ok) {
                toast.success(initialData ? "Store updated successfully!" : "Store created successfully!");
                router.refresh();
            } else {
                toast.error(result.error || "Something went wrong");
            }
        } catch (error) {
            console.error("Submit error:", error);
            toast.error("Failed to save store information");
        } finally {
            setIsLoading(false);
        }
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <Building2 className="h-7 w-7 text-primary" />
                        {initialData ? "Manage Your Store" : "Create Your Store"}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {initialData
                            ? "Update your store profile, cover image, and contact information"
                            : "Set up your private store to start selling products"
                        }
                    </p>
                </div>
                <Button type="submit" disabled={isLoading} className="gap-2">
                    <Save className="h-4 w-4" />
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            {/* Cover Image */}
            <Card className="overflow-hidden">
                <div className="relative h-48 md:h-64 bg-muted">
                    {formData.banner ? (
                        <>
                            <img
                                src={formData.banner}
                                alt="Store cover"
                                className="w-full h-full object-cover"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-4 right-4"
                                onClick={() => setFormData(prev => ({ ...prev, banner: "" }))}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <div className="w-full h-full bg-linear-to-br from-primary/10 to-accent/10 flex flex-col items-center justify-center gap-4">
                            <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
                            <p className="text-muted-foreground text-sm">No cover image uploaded</p>
                        </div>
                    )}

                    <input
                        ref={bannerInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'banner')}
                    />

                    <Button
                        type="button"
                        variant="secondary"
                        className="absolute bottom-4 right-4 gap-2 shadow-lg"
                        onClick={() => bannerInputRef.current?.click()}
                    >
                        <Camera className="h-4 w-4" />
                        {formData.banner ? "Change Cover" : "Upload Cover"}
                    </Button>
                </div>

                {/* Logo Section - Overlapping */}
                <div className="px-6 pb-6">
                    <div className="flex items-end gap-6 -mt-16 relative z-10">
                        {/* Logo */}
                        <div className="relative">
                            <div className="h-32 w-32 rounded-2xl bg-card border-4 border-card shadow-xl overflow-hidden flex items-center justify-center">
                                {formData.logo ? (
                                    <img
                                        src={formData.logo}
                                        alt="Store logo"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <StoreIcon className="h-12 w-12 text-muted-foreground/40" />
                                )}
                            </div>

                            <input
                                ref={logoInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, 'logo')}
                            />

                            <Button
                                type="button"
                                size="icon"
                                variant="secondary"
                                className="absolute -bottom-2 -right-2 rounded-full shadow-lg h-8 w-8"
                                onClick={() => logoInputRef.current?.click()}
                            >
                                <Camera className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Store Name Quick View */}
                        <div className="flex-1 pb-4">
                            <h2 className="text-2xl font-bold">{formData.vendorName || "Your Store Name"}</h2>
                            <p className="text-muted-foreground">
                                {initialData?._count?.products || 0} Products
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Store Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Store Information
                    </CardTitle>
                    <CardDescription>Basic information about your store</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="vendorName">Store Name *</Label>
                        <Input
                            id="vendorName"
                            value={formData.vendorName}
                            onChange={(e) => {
                                setFormData(prev => ({
                                    ...prev,
                                    vendorName: e.target.value,
                                    vendorSlug: prev.vendorSlug || generateSlug(e.target.value)
                                }));
                            }}
                            placeholder="Enter your store name"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="vendorSlug">Store URL Slug *</Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                                /vendor/
                            </span>
                            <Input
                                id="vendorSlug"
                                value={formData.vendorSlug}
                                onChange={(e) => setFormData(prev => ({ ...prev, vendorSlug: generateSlug(e.target.value) }))}
                                placeholder="your-store-name"
                                className="rounded-l-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Tell customers about your store..."
                            rows={4}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        Contact Information
                    </CardTitle>
                    <CardDescription>How customers can reach you</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="contactPhone" className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Phone Number
                        </Label>
                        <Input
                            id="contactPhone"
                            value={formData.contactPhone}
                            onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                            placeholder="+855 12 345 678"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="contact@yourstore.com"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Address
                        </Label>
                        <Textarea
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                            placeholder="Enter your store address..."
                            rows={2}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Submit Button (Mobile) */}
            <div className="flex justify-end md:hidden">
                <Button type="submit" disabled={isLoading} className="w-full gap-2">
                    <Save className="h-4 w-4" />
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}
