"use client";

import React, { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import {
    Plus,
    Pencil,
    Trash2,
    ChevronRight,
    Search,
    Loader2,
    Database,
    Languages,
    Upload,
    Link,
    ImageIcon,
    X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import {
    submitCategory,
    deleteCategory,
    submitSubCategory,
    deleteSubCategory,
    seedCategories
} from "@/app/[lang]/super-admin-depo/categories/actions";
import { translateText } from "@/app/actions/translate";

interface SubCategory {
    id: string;
    nameKh: string;
    nameEn: string | null;
    nameKo?: string | null;
    slug: string;
    image?: string | null;
}

interface Category {
    id: string;
    nameKh: string;
    nameEn: string | null;
    nameKo?: string | null;
    slug: string;
    image?: string | null;
    subCategories: SubCategory[];
}

interface CategoryManagementProps {
    initialData: Category[];
}

export default function CategoryManagement({ initialData }: CategoryManagementProps) {
    const { currentLanguage } = useLanguage();
    const [categories, setCategories] = useState<Category[]>(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [isSeeding, setIsSeeding] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setCategories(initialData);
    }, [initialData]);

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editingSubCategory, setEditingSubCategory] = useState<{ id: string, categoryId: string } | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    const [categoryNameKh, setCategoryNameKh] = useState("");
    const [categoryNameEn, setCategoryNameEn] = useState("");
    const [categoryNameKo, setCategoryNameKo] = useState("");
    const [categorySlug, setCategorySlug] = useState("");
    const [categoryIcon, setCategoryIcon] = useState("");

    const [subCategoryNameKh, setSubCategoryNameKh] = useState("");
    const [subCategoryNameEn, setSubCategoryNameEn] = useState("");
    const [subCategoryNameKo, setSubCategoryNameKo] = useState("");
    const [subCategorySlug, setSubCategorySlug] = useState("");
    const [subCategoryIcon, setSubCategoryIcon] = useState("");

    const toSlug = (text: string) => {
        return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    };

    const ensureLocalImage = async (icon: string) => {
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

    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);

            // Localize external URL if needed
            const localizedIcon = await ensureLocalImage(categoryIcon);

            const res = await submitCategory({
                nameKh: categoryNameKh,
                nameEn: categoryNameEn,
                nameKo: categoryNameKo,
                slug: categorySlug || toSlug(categoryNameEn),
                image: localizedIcon
            }, editingCategory?.id);

            if (res.ok) {
                toast.success(editingCategory ? "Category updated" : "Category created");
                setIsCategoryModalOpen(false);
                resetCategoryForm();
            } else {
                toast.error((res.data as any)?.error || "Operation failed");
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const loadingToast = toast.loading("Uploading image...");
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const storageUrl = process.env.NEXT_PUBLIC_STORAGE_API_URL || "http://localhost:5001";
            const res = await fetch(`${storageUrl}/api/upload`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (data.success) {
                setCategoryIcon(data.url);
                toast.success("Image uploaded successfully");
            } else {
                toast.error(data.error || "Upload failed");
            }
        } catch (error) {
            toast.error("Upload failed");
        } finally {
            setIsUploading(false);
            toast.dismiss(loadingToast);
        }
    };

    const handleSubCategoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const loadingToast = toast.loading("Uploading image...");
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const storageUrl = process.env.NEXT_PUBLIC_STORAGE_API_URL || "http://localhost:5001";
            const res = await fetch(`${storageUrl}/api/upload`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (data.success) {
                setSubCategoryIcon(data.url);
                toast.success("Image uploaded successfully");
            } else {
                toast.error(data.error || "Upload failed");
            }
        } catch (error) {
            toast.error("Upload failed");
        } finally {
            setIsUploading(false);
            toast.dismiss(loadingToast);
        }
    };

    const handleSubCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);

            // Localize external URL if needed
            const localizedIcon = await ensureLocalImage(subCategoryIcon);

            const body = editingSubCategory
                ? {
                    nameKh: subCategoryNameKh,
                    nameEn: subCategoryNameEn,
                    nameKo: subCategoryNameKo,
                    slug: subCategorySlug || toSlug(subCategoryNameEn),
                    image: localizedIcon
                }
                : {
                    nameKh: subCategoryNameKh,
                    nameEn: subCategoryNameEn,
                    nameKo: subCategoryNameKo,
                    slug: subCategorySlug || toSlug(subCategoryNameEn),
                    image: localizedIcon,
                    categoryId: selectedCategoryId
                };

            const res = await submitSubCategory(body, editingSubCategory?.id);

            if (res.ok) {
                toast.success(editingSubCategory ? "Sub-category updated" : "Sub-category created");
                setIsSubCategoryModalOpen(false);
                resetSubCategoryForm();
            } else {
                toast.error((res.data as any)?.error || "Operation failed");
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Are you sure? All sub-categories will be deleted.")) return;
        try {
            const ok = await deleteCategory(id);
            if (ok) toast.success("Category deleted");
            else toast.error("Delete failed");
        } catch (error) {
            toast.error("Network error");
        }
    };

    const handleDeleteSubCategory = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const ok = await deleteSubCategory(id);
            if (ok) toast.success("Sub-category deleted");
            else toast.error("Delete failed");
        } catch (error) {
            toast.error("Network error");
        }
    };

    const handleSeed = async () => {
        try {
            setIsSeeding(true);
            const ok = await seedCategories();
            if (ok) toast.success("Seeding completed successfully");
            else toast.error("Failed to seed categories");
        } catch (error) {
            toast.error("Error during seeding");
        } finally {
            setIsSeeding(false);
        }
    };

    const resetCategoryForm = () => {
        setEditingCategory(null);
        setCategoryNameKh("");
        setCategoryNameEn("");
        setCategoryNameKo("");
        setCategorySlug("");
        setCategoryIcon("");
    };

    const resetSubCategoryForm = () => {
        setEditingSubCategory(null);
        setSubCategoryNameKh("");
        setSubCategoryNameEn("");
        setSubCategoryNameKo("");
        setSubCategorySlug("");
        setSubCategoryIcon("");
        setSelectedCategoryId(null);
    };

    const getLocalizedName = (item: any) => {
        if (currentLanguage.code === 'km') return item.nameKh || item.name;
        if (currentLanguage.code === 'ko') return item.nameKo || item.nameEn || item.name;
        return item.nameEn || item.name;
    };

    const filteredCategories = categories.filter(c =>
        c.nameKh.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.nameEn || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ProtectedRoute allowedRoles={['superadmin']}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
                        <p className="text-muted-foreground">Define business categories and sub-categories for vendors.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleSeed} disabled={isSeeding}>
                            {isSeeding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Database className="h-4 w-4 mr-2" />}
                            Seed Data
                        </Button>
                        <Dialog open={isCategoryModalOpen} onOpenChange={(open) => {
                            setIsCategoryModalOpen(open);
                            if (!open) resetCategoryForm();
                        }}>
                            <DialogTrigger asChild>
                                <Button className="bg-primary hover:bg-primary/90">
                                    <Plus className="h-4 w-4 mr-2" /> New Category
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>{editingCategory ? "Update Category" : "Create New Category"}</DialogTitle>
                                    <DialogDescription>Add localized titles and an icon.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCategorySubmit} className="space-y-4 pt-4">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <Label>Name (Khmer)</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    value={categoryNameKh}
                                                    onChange={(e) => setCategoryNameKh(e.target.value)}
                                                    placeholder="ម៉ូតបុរស"
                                                    required
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={async () => {
                                                        if (!categoryNameKh) return toast.error("Enter Khmer name first");
                                                        const loading = toast.loading("Translating...");
                                                        try {
                                                            const [en, ko] = await Promise.all([
                                                                translateText(categoryNameKh, "en"),
                                                                translateText(categoryNameKh, "ko")
                                                            ]);
                                                            if (en) setCategoryNameEn(en);
                                                            if (ko) setCategoryNameKo(ko);
                                                            if (en && !categorySlug) setCategorySlug(toSlug(en));
                                                            toast.success("Translated");
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
                                        <div className="space-y-2">
                                            <Label>Name (English)</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    value={categoryNameEn}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setCategoryNameEn(val);
                                                        if (!categorySlug) setCategorySlug(toSlug(val));
                                                    }}
                                                    placeholder="Men's Fashion"
                                                    required
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={async () => {
                                                        if (!categoryNameEn) return toast.error("Enter English name first");
                                                        const loading = toast.loading("Translating...");
                                                        try {
                                                            const [kh, ko] = await Promise.all([
                                                                translateText(categoryNameEn, "km"),
                                                                translateText(categoryNameEn, "ko")
                                                            ]);
                                                            if (kh) setCategoryNameKh(kh);
                                                            if (ko) setCategoryNameKo(ko);
                                                            toast.success("Translated");
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
                                        <div className="space-y-2">
                                            <Label>Slug (URL)</Label>
                                            <Input
                                                value={categorySlug}
                                                onChange={(e) => setCategorySlug(toSlug(e.target.value))}
                                                placeholder="mens-fashion"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Name (Korean)</Label>
                                            <Input
                                                value={categoryNameKo}
                                                onChange={(e) => setCategoryNameKo(e.target.value)}
                                                placeholder="남성 패션"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label>Category Image / Icon</Label>
                                            <Tabs defaultValue="url" className="w-full">
                                                <TabsList className="grid grid-cols-2 w-full">
                                                    <TabsTrigger value="url" className="flex items-center gap-2">
                                                        <Link className="h-3 w-3" /> URL
                                                    </TabsTrigger>
                                                    <TabsTrigger value="upload" className="flex items-center gap-2">
                                                        <Upload className="h-3 w-3" /> Device
                                                    </TabsTrigger>
                                                </TabsList>
                                                <TabsContent value="url" className="space-y-2 pt-2">
                                                    <Input
                                                        value={categoryIcon}
                                                        onChange={(e) => setCategoryIcon(e.target.value)}
                                                        placeholder="Paste image URL or Emoji"
                                                    />
                                                </TabsContent>
                                                <TabsContent value="upload" className="space-y-2 pt-2">
                                                    <div className="flex flex-col gap-2">
                                                        <Input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImageUpload}
                                                            disabled={isUploading}
                                                            className="cursor-pointer"
                                                        />
                                                        {isUploading && <p className="text-xs text-muted-foreground animate-pulse">Uploading...</p>}
                                                    </div>
                                                </TabsContent>
                                            </Tabs>

                                            {categoryIcon && (
                                                <div className="relative mt-2 w-20 h-20 rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                                                    {categoryIcon.startsWith('/') || categoryIcon.startsWith('http') ? (
                                                        <img
                                                            src={categoryIcon}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = 'https://placehold.co/100?text=Error';
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="text-3xl">{categoryIcon}</span>
                                                    )}
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-0 right-0 h-5 w-5 rounded-none rounded-bl"
                                                        onClick={() => setCategoryIcon("")}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setIsCategoryModalOpen(false)}>Cancel</Button>
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                            {editingCategory ? "Update" : "Create"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Catalog Hierarchy</CardTitle>
                                <CardDescription>Click categories to manage their sub-items.</CardDescription>
                            </div>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search categories..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading && !isCategoryModalOpen && !isSubCategoryModalOpen ? (
                            <div className="flex items-center justify-center py-10">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredCategories.length === 0 ? (
                                    <div className="text-center py-10 border rounded-lg border-dashed">
                                        <p className="text-muted-foreground text-sm">No categories found.</p>
                                    </div>
                                ) : (
                                    filteredCategories.map(category => (
                                        <div key={category.id} className="border rounded-lg overflow-hidden border-border/60">
                                            <div className="flex items-center justify-between p-4 bg-muted/30">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded bg-white flex items-center justify-center border shadow-sm text-lg overflow-hidden shrink-0">
                                                        {category.image ? (
                                                            category.image.startsWith('/') || category.image.startsWith('http') ? (
                                                                <img
                                                                    src={category.image}
                                                                    alt=""
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <span>{category.image}</span>
                                                            )
                                                        ) : (
                                                            <Database className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold">{getLocalizedName(category)}</h3>
                                                        <div className="flex gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
                                                            <span>{category.nameEn}</span>
                                                            <span>•</span>
                                                            <span>{category.nameKh}</span>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-2">
                                                        {category.subCategories.length} Sub-categories
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            setSelectedCategoryId(category.id);
                                                            setIsSubCategoryModalOpen(true);
                                                        }}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            setEditingCategory(category);
                                                            setCategoryNameKh(category.nameKh);
                                                            setCategoryNameEn(category.nameEn || "");
                                                            setCategoryNameKo(category.nameKo || "");
                                                            setCategorySlug(category.slug || "");
                                                            setCategoryIcon(category.image || "");
                                                            setIsCategoryModalOpen(true);
                                                        }}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => handleDeleteCategory(category.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="bg-white p-2">
                                                {category.subCategories.length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-2">
                                                        {category.subCategories.map(sub => (
                                                            <div key={sub.id} className="flex items-center justify-between p-3 rounded-md bg-muted/20 border border-transparent hover:border-primary/20 transition-all">
                                                                <div className="flex flex-col">
                                                                    <div className="flex items-center gap-2">
                                                                        <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                                                        <span className="text-sm font-medium">{getLocalizedName(sub)}</span>
                                                                    </div>
                                                                    <span className="text-[10px] text-muted-foreground ml-5">{sub.nameEn} / {sub.nameKh}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-7 w-7"
                                                                        onClick={() => {
                                                                            setEditingSubCategory({ id: sub.id, categoryId: category.id });
                                                                            setSubCategoryNameKh(sub.nameKh);
                                                                            setSubCategoryNameEn(sub.nameEn || "");
                                                                            setSubCategoryNameKo(sub.nameKo || "");
                                                                            setSubCategorySlug(sub.slug || "");
                                                                            setSubCategoryIcon(sub.image || "");
                                                                            setIsSubCategoryModalOpen(true);
                                                                        }}
                                                                    >
                                                                        <Pencil className="h-3 w-3" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-7 w-7 text-destructive/70 hover:text-destructive"
                                                                        onClick={() => handleDeleteSubCategory(sub.id)}
                                                                    >
                                                                        <Trash2 className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground italic p-4">No sub-categories yet.</p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Dialog open={isSubCategoryModalOpen} onOpenChange={(open) => {
                    setIsSubCategoryModalOpen(open);
                    if (!open) resetSubCategoryForm();
                }}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>{editingSubCategory ? "Update Sub-category" : "Create New Sub-category"}</DialogTitle>
                            <DialogDescription>Add localized titles for this sub-item.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubCategorySubmit} className="space-y-4 pt-4">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label>Name (Khmer)</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={subCategoryNameKh}
                                            onChange={(e) => setSubCategoryNameKh(e.target.value)}
                                            placeholder="គ្រឿងសំណង់"
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={async () => {
                                                if (!subCategoryNameKh) return toast.error("Enter Khmer name first");
                                                const loading = toast.loading("Translating...");
                                                try {
                                                    const [en, ko] = await Promise.all([
                                                        translateText(subCategoryNameKh, "en"),
                                                        translateText(subCategoryNameKh, "ko")
                                                    ]);
                                                    if (en) {
                                                        setSubCategoryNameEn(en);
                                                        if (!subCategorySlug) setSubCategorySlug(toSlug(en));
                                                    }
                                                    if (ko) setSubCategoryNameKo(ko);
                                                    toast.success("Translated");
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
                                <div className="space-y-2">
                                    <Label>Name (English)</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={subCategoryNameEn}
                                            onChange={(e) => setSubCategoryNameEn(e.target.value)}
                                            placeholder="Construction"
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={async () => {
                                                if (!subCategoryNameEn) return toast.error("Enter English name first");
                                                const loading = toast.loading("Translating...");
                                                try {
                                                    const [kh, ko] = await Promise.all([
                                                        translateText(subCategoryNameEn, "km"),
                                                        translateText(subCategoryNameEn, "ko")
                                                    ]);
                                                    if (kh) setSubCategoryNameKh(kh);
                                                    if (ko) setSubCategoryNameKo(ko);
                                                    toast.success("Translated");
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
                                <div className="space-y-2">
                                    <Label>Slug (URL)</Label>
                                    <Input
                                        value={subCategorySlug}
                                        onChange={(e) => setSubCategorySlug(toSlug(e.target.value))}
                                        placeholder="mens-shoes"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Name (Korean)</Label>
                                    <Input
                                        value={subCategoryNameKo}
                                        onChange={(e) => setSubCategoryNameKo(e.target.value)}
                                        placeholder="건설"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label>Sub-category Image / Icon</Label>
                                    <Tabs defaultValue="url" className="w-full">
                                        <TabsList className="grid grid-cols-2 w-full">
                                            <TabsTrigger value="url" className="flex items-center gap-2">
                                                <Link className="h-3 w-3" /> URL
                                            </TabsTrigger>
                                            <TabsTrigger value="upload" className="flex items-center gap-2">
                                                <Upload className="h-3 w-3" /> Device
                                            </TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="url" className="space-y-2 pt-2">
                                            <Input
                                                value={subCategoryIcon}
                                                onChange={(e) => setSubCategoryIcon(e.target.value)}
                                                placeholder="Paste image URL or Emoji"
                                            />
                                        </TabsContent>
                                        <TabsContent value="upload" className="space-y-2 pt-2">
                                            <div className="flex flex-col gap-2">
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleSubCategoryImageUpload}
                                                    disabled={isUploading}
                                                    className="cursor-pointer"
                                                />
                                                {isUploading && <p className="text-xs text-muted-foreground animate-pulse">Uploading...</p>}
                                            </div>
                                        </TabsContent>
                                    </Tabs>

                                    {subCategoryIcon && (
                                        <div className="relative mt-2 w-16 h-16 rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                                            {subCategoryIcon.startsWith('/') || subCategoryIcon.startsWith('http') ? (
                                                <img
                                                    src={subCategoryIcon}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-xl">{subCategoryIcon}</span>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => setSubCategoryIcon("")}
                                                className="absolute top-0 right-0 p-0.5 bg-destructive rounded-bl-lg text-white"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsSubCategoryModalOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                    {editingSubCategory ? "Update" : "Create"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </ProtectedRoute>
    );
}
