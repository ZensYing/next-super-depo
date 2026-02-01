"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import {
    Plus,
    Pencil,
    Trash2,
    FolderTree,
    LayoutDashboard,
    Store,
    ChevronRight,
    Search,
    Loader2,
    Database
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface SubCategory {
    id: number;
    name: string;
    nameKm: string;
    nameEn: string;
    nameZh?: string;
}

interface Category {
    id: number;
    name: string;
    nameKm: string;
    nameEn: string;
    nameZh?: string;
    icon?: string;
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
    const [searchQuery, setSearchQuery] = useState("");

    // Sync state with initialData when RSC revalidates
    useEffect(() => {
        setCategories(initialData);
    }, [initialData]);

    // Form states
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editingSubCategory, setEditingSubCategory] = useState<{ id: number, categoryId: number } | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    const [categoryNameKm, setCategoryNameKm] = useState("");
    const [categoryNameEn, setCategoryNameEn] = useState("");
    const [categoryNameZh, setCategoryNameZh] = useState("");
    const [categoryIcon, setCategoryIcon] = useState("");

    const [subCategoryNameKm, setSubCategoryNameKm] = useState("");
    const [subCategoryNameEn, setSubCategoryNameEn] = useState("");
    const [subCategoryNameZh, setSubCategoryNameZh] = useState("");

    const sidebarItems = [
        { icon: LayoutDashboard, label: "Overview", href: "/super-admin-depo" },
        { icon: Store, label: "Manage Stores", href: "/super-admin-depo/depos" },
        { icon: FolderTree, label: "Categories", href: "/super-admin-depo/categories", active: true },
    ];

    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const res = await submitCategory({
                nameKm: categoryNameKm,
                nameEn: categoryNameEn,
                nameZh: categoryNameZh,
                icon: categoryIcon,
                name: categoryNameEn
            }, editingCategory?.id);

            if (res.ok) {
                toast.success(editingCategory ? "Category updated" : "Category created");
                setIsCategoryModalOpen(false);
                resetCategoryForm();
            } else {
                toast.error("Operation failed");
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const body = editingSubCategory
                ? { nameKm: subCategoryNameKm, nameEn: subCategoryNameEn, nameZh: subCategoryNameZh, name: subCategoryNameEn }
                : { nameKm: subCategoryNameKm, nameEn: subCategoryNameEn, nameZh: subCategoryNameZh, name: subCategoryNameEn, categoryId: selectedCategoryId };

            const res = await submitSubCategory(body, editingSubCategory?.id);

            if (res.ok) {
                toast.success(editingSubCategory ? "Sub-category updated" : "Sub-category created");
                setIsSubCategoryModalOpen(false);
                resetSubCategoryForm();
            } else {
                toast.error("Operation failed");
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!confirm("Are you sure? All sub-categories will be deleted.")) return;
        try {
            const ok = await deleteCategory(id);
            if (ok) toast.success("Category deleted");
            else toast.error("Delete failed");
        } catch (error) {
            toast.error("Network error");
        }
    };

    const handleDeleteSubCategory = async (id: number) => {
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
        setCategoryNameKm("");
        setCategoryNameEn("");
        setCategoryNameZh("");
        setCategoryIcon("");
    };

    const resetSubCategoryForm = () => {
        setEditingSubCategory(null);
        setSubCategoryNameKm("");
        setSubCategoryNameEn("");
        setSubCategoryNameZh("");
        setSelectedCategoryId(null);
    };

    const getLocalizedName = (item: any) => {
        if (currentLanguage.code === 'km') return item.nameKm || item.name;
        if (currentLanguage.code === 'zh') return item.nameZh || item.nameEn || item.name;
        return item.nameEn || item.name;
    };

    const filteredCategories = categories.filter(c =>
        c.nameKm.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ProtectedRoute allowedRoles={['superadmin']}>
            <DashboardLayout
                title="Super Admin"
                userRole="Administrator"
                sidebarItems={sidebarItems}
            >
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
                            <p className="text-muted-foreground">Define business categories and sub-categories for vendors. (Network Safe via RSC)</p>
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
                                        <DialogDescription>Add localized titles and an icon. This will be processed on the server.</DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleCategorySubmit} className="space-y-4 pt-4">
                                        <div className="grid gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Name (Khmer)</label>
                                                <Input
                                                    value={categoryNameKm}
                                                    onChange={(e) => setCategoryNameKm(e.target.value)}
                                                    placeholder="ម៉ូតបុរស"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Name (English)</label>
                                                <Input
                                                    value={categoryNameEn}
                                                    onChange={(e) => setCategoryNameEn(e.target.value)}
                                                    placeholder="Men's Fashion"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Name (Chinese)</label>
                                                <Input
                                                    value={categoryNameZh}
                                                    onChange={(e) => setCategoryNameZh(e.target.value)}
                                                    placeholder="男装"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Icon Name (Lucide or Emoji)</label>
                                                <Input
                                                    value={categoryIcon}
                                                    onChange={(e) => setCategoryIcon(e.target.value)}
                                                    placeholder="e.g. Shirt, Gem, 🏗️"
                                                />
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
                                                        <div className="w-8 h-8 rounded bg-white flex items-center justify-center border shadow-sm text-lg">
                                                            {category.icon ? (
                                                                category.icon.length > 2 ? <Database className="h-4 w-4" /> : category.icon
                                                            ) : '📁'}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold">{getLocalizedName(category)}</h3>
                                                            <div className="flex gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
                                                                <span>{category.nameEn}</span>
                                                                <span>•</span>
                                                                <span>{category.nameKm}</span>
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
                                                            onClick={(e) => {
                                                                e.stopPropagation();
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
                                                                setCategoryNameKm(category.nameKm);
                                                                setCategoryNameEn(category.nameEn);
                                                                setCategoryNameZh(category.nameZh || "");
                                                                setCategoryIcon(category.icon || "");
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
                                                                        <span className="text-[10px] text-muted-foreground ml-5">{sub.nameEn} / {sub.nameKm}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-7 w-7"
                                                                            onClick={() => {
                                                                                setEditingSubCategory({ id: sub.id, categoryId: category.id });
                                                                                setSubCategoryNameKm(sub.nameKm);
                                                                                setSubCategoryNameEn(sub.nameEn);
                                                                                setSubCategoryNameZh(sub.nameZh || "");
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
                                <DialogDescription>
                                    Add localized titles for this sub-item.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubCategorySubmit} className="space-y-4 pt-4">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Name (Khmer)</label>
                                        <Input
                                            value={subCategoryNameKm}
                                            onChange={(e) => setSubCategoryNameKm(e.target.value)}
                                            placeholder="គ្រឿងសំណង់"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Name (English)</label>
                                        <Input
                                            value={subCategoryNameEn}
                                            onChange={(e) => setSubCategoryNameEn(e.target.value)}
                                            placeholder="Construction"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Name (Chinese)</label>
                                        <Input
                                            value={subCategoryNameZh}
                                            onChange={(e) => setSubCategoryNameZh(e.target.value)}
                                            placeholder="建筑"
                                        />
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
            </DashboardLayout>
        </ProtectedRoute>
    );
}
