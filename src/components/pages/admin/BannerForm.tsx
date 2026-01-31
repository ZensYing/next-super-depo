"use client";

import { useState } from "react";
import { Save, Package, UploadCloud, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createBanner, updateBanner } from "@/app/[lang]/super-admin-depo/banners/actions";
import { toast } from "sonner";
import { LocalizedLink as Link } from "@/components/LocalizedLink";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { compressImage, isValidImageType, formatFileSize } from "@/lib/imageCompression";

const MAX_SIZE_MB = 2;

interface BannerFormProps {
    initialData?: any;
}

export default function BannerForm({ initialData }: BannerFormProps) {
    const router = useRouter();
    const { currentLanguage } = useLanguage();
    const language = currentLanguage.code;
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState(initialData || {
        title: "",
        description: "",
        link: "",
        sort: "0",
        status: "active",
        thumbnail: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (initialData?.id) {
                const res = await updateBanner(initialData.id, formData);
                if (res.ok) {
                    toast.success("Banner updated successfully");
                    router.push(`/${language}/super-admin-depo/banners`);
                } else {
                    toast.error(res.error || "Failed to update banner");
                }
            } else {
                const res = await createBanner(formData);
                if (res.ok) {
                    toast.success("Banner created successfully");
                    router.push(`/${language}/super-admin-depo/banners`);
                } else {
                    toast.error(res.error || "Failed to create banner");
                }
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-20">
            <div className="flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 py-4 border-b">
                <div className="flex items-center gap-4">
                    <Link to="/super-admin-depo/banners">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">{initialData?.id ? "Edit Banner" : "Create New Banner"}</h1>
                        <p className="text-sm text-muted-foreground">Manage banner details and image.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link to="/super-admin-depo/banners">
                        <Button variant="outline" type="button">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 min-w-[120px]">
                        {isLoading ? (
                            <Package className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        {initialData?.id ? "Save Changes" : "Create Banner"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Details */}
                <div className="md:col-span-2 space-y-8">
                    <Card className="border-none shadow-sm ring-1 ring-gray-100">
                        <CardHeader>
                            <CardTitle>Banner Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Title (Optional)</Label>
                                <Input
                                    value={formData.title || ""}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Summer Sale"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description (Optional)</Label>
                                <Textarea
                                    value={formData.description || ""}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="e.g. Get 50% off on all items..."
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Target Link (Optional)</Label>
                                <Input
                                    value={formData.link || ""}
                                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                                    placeholder="e.g. /category/electronics or https://..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Sort Order</Label>
                                    <Input
                                        type="number"
                                        value={formData.sort}
                                        onChange={e => setFormData({ ...formData, sort: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={v => setFormData({ ...formData, status: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Image */}
                <div className="space-y-8">
                    <Card className="border-none shadow-sm ring-1 ring-gray-100">
                        <CardHeader>
                            <CardTitle>Banner Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {formData.thumbnail ? (
                                    <div className="relative aspect-video w-full rounded-lg overflow-hidden border bg-muted group">
                                        <img src={formData.thumbnail} alt="Banner" className="w-full h-full object-cover" />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => setFormData({ ...formData, thumbnail: "" })}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Tabs defaultValue="upload" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2 mb-4">
                                            <TabsTrigger value="upload">Upload</TabsTrigger>
                                            <TabsTrigger value="url">URL</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="upload" className="mt-0">
                                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/30 transition-all border-gray-200 hover:border-primary/50">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                                                    <UploadCloud className="w-10 h-10 mb-2 text-primary/40" />
                                                    <p className="text-xs font-medium">Click to upload</p>
                                                    <p className="text-[10px]">Max 2MB</p>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        let file = e.target.files?.[0];
                                                        if (!file) return;

                                                        if (!isValidImageType(file)) {
                                                            toast.error("Invalid image type");
                                                            return;
                                                        }

                                                        const loadingToast = toast.loading("Processing...");
                                                        try {
                                                            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                                                                file = await compressImage(file, { maxSizeMB: MAX_SIZE_MB });
                                                            }

                                                            const data = new FormData();
                                                            data.append("file", file);
                                                            const storageUrl = process.env.NEXT_PUBLIC_STORAGE_API_URL || "http://localhost:5001";
                                                            const res = await fetch(`${storageUrl}/api/upload`, { method: "POST", body: data });
                                                            const json = await res.json();
                                                            setFormData({ ...formData, thumbnail: json.url });
                                                            toast.success("Uploaded!");
                                                        } catch (err) { toast.error("Upload failed"); }
                                                        finally { toast.dismiss(loadingToast); e.target.value = ''; }
                                                    }}
                                                />
                                            </label>
                                        </TabsContent>
                                        <TabsContent value="url" className="mt-0">
                                            <Input
                                                placeholder="https://..."
                                                value={formData.thumbnail}
                                                onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
                                            />
                                        </TabsContent>
                                    </Tabs>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
