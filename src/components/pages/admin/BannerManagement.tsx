"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Search, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteBanner } from "@/app/[lang]/super-admin-depo/banners/actions";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { LocalizedLink as Link } from "@/components/LocalizedLink";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

interface BannerManagementProps {
    initialBanners: any[];
}

export default function BannerManagement({ initialBanners }: BannerManagementProps) {
    const { currentLanguage } = useLanguage();
    const language = currentLanguage.code;
    const router = useRouter();
    const [banners, setBanners] = useState(initialBanners);
    const [searchQuery, setSearchQuery] = useState("");

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const success = await deleteBanner(id);
        if (success) {
            setBanners(banners.filter((b: any) => b.id !== id));
            toast.success("Banner deleted");
        } else {
            toast.error("Delete failed");
        }
    };

    const filteredBanners = banners.filter((b: any) =>
        b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        "Untitled".includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Banner Management</h2>
                    <p className="text-muted-foreground">Manage your website banners and sliders.</p>
                </div>
                <Link to="/super-admin-depo/banners/create">
                    <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                        <Plus className="h-4 w-4 mr-2" /> New Banner
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search banners..."
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
                                <TableHead>Image</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Link</TableHead>
                                <TableHead>Sort Order</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredBanners.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                        No banners found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredBanners.map((banner: any) => (
                                    <TableRow key={banner.id}>
                                        <TableCell>
                                            <div className="h-12 w-24 bg-muted rounded overflow-hidden relative border">
                                                {banner.thumbnail ? (
                                                    <img
                                                        src={banner.thumbnail}
                                                        alt={banner.title || "Banner"}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full w-full bg-secondary/50">
                                                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {banner.title || <span className="text-muted-foreground italic">Untitled</span>}
                                            {banner.description && (
                                                <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                    {banner.description}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-[150px] truncate text-muted-foreground">
                                            {banner.link || "-"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{banner.sort}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={banner.status === 'active' ? 'default' : 'secondary'}>
                                                {banner.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link to={`/super-admin-depo/banners/edit/${banner.id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Pencil className="h-4 w-4 text-blue-500" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleDelete(banner.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
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
