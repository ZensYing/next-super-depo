"use client";

import { useState } from "react";
import { Grid, List, Star, Heart, ShoppingCart, Filter, Search, MapPin, Phone, Mail, Clock, Share2, Store, Package } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";

interface VendorDetailProps {
    vendor: any;
}

const VendorDetail = ({ vendor }: VendorDetailProps) => {
    const { t } = useTranslation();
    const { currentLanguage } = useLanguage();
    const language = currentLanguage.code;
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");

    const products = vendor.products || [];

    const getLocalizedName = (item: any) => {
        if (!item) return "";
        switch (language) {
            case 'km': return item.productNameKh || item.productNameEn || "";
            case 'ko': return item.productNameKo || item.productNameEn || "";
            default: return item.productNameEn || item.productNameKh || "";
        }
    };

    // Filter products based on search
    const filteredProducts = products.filter((p: any) =>
        getLocalizedName(p).toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1">
                {/* Vendor Header / Banner */}
                <div className="relative h-48 md:h-64 lg:h-80 bg-muted">
                    {vendor.banner ? (
                        <img
                            src={vendor.banner}
                            alt={vendor.vendorName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                            <Store className="h-16 w-16 text-primary/20" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/40" />

                    <div className="absolute bottom-0 left-0 right-0 container py-6 text-white">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                            {/* Logo */}
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-white p-1 shadow-lg shrink-0 overflow-hidden flex items-center justify-center">
                                {vendor.logo ? (
                                    <img
                                        src={vendor.logo}
                                        alt={vendor.vendorName}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                ) : (
                                    <Store className="h-12 w-12 text-primary" />
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left mb-2">
                                <h1 className="text-2xl md:text-4xl font-bold mb-2">{vendor.vendorName}</h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm md:text-base opacity-90">
                                    <span className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        {vendor.rating || "5.0"} ({vendor.reviews || 0} {t("reviews")})
                                    </span>
                                    <span className="hidden md:inline">•</span>
                                    <span>{vendor._count?.products || 0} {t("products")}</span>
                                    <span className="hidden md:inline">•</span>
                                    <span>{t("joined")} {new Date(vendor.createdAt).getFullYear()}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 shrink-0">
                                <Button className="gap-2 bg-primary hover:bg-primary/90">
                                    <Heart className="h-4 w-4" />
                                    {t("follow")}
                                </Button>
                                <Button variant="secondary" className="gap-2">
                                    <Share2 className="h-4 w-4" />
                                    {t("share")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vendor Info Bar */}
                <div className="bg-card border-b">
                    <div className="container py-4 flex flex-wrap gap-6 text-sm text-muted-foreground justify-center md:justify-start">
                        {vendor.address && (
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {vendor.address}
                            </div>
                        )}
                        {vendor.contactPhone && (
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                {vendor.contactPhone}
                            </div>
                        )}
                        {vendor.email && (
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                {vendor.email}
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {vendor.status === "active" ? <span className="text-green-600 font-medium">Open Now</span> : <span className="text-destructive font-medium">Closed</span>}
                        </div>
                    </div>
                </div>

                <div className="container py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Search/Filter */}
                        <aside className="w-full lg:w-64 shrink-0 space-y-6">
                            <div className="bg-card rounded-2xl p-6 shadow-card">
                                <h3 className="font-semibold mb-4">{t("searchInStore")}</h3>
                                <div className="relative">
                                    <Input
                                        placeholder={t("searchPlaceholder")}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9"
                                    />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                        </aside>

                        {/* Products Grid */}
                        <div className="flex-1">
                            {/* Toolbar */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">{t("allProducts")}</h2>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant={viewMode === "grid" ? "default" : "outline"}
                                        size="icon"
                                        onClick={() => setViewMode("grid")}
                                    >
                                        <Grid className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === "list" ? "default" : "outline"}
                                        size="icon"
                                        onClick={() => setViewMode("list")}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Products */}
                            {filteredProducts.length === 0 ? (
                                <div className="text-center py-20 bg-muted/20 rounded-3xl">
                                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                                    <p className="text-muted-foreground text-lg">{t("noResults")}</p>
                                </div>
                            ) : (
                                <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6" : "space-y-4"}>
                                    {filteredProducts.map((product: any) => {
                                        const mainPrice = product.productPrices?.[0];
                                        return (
                                            <LocalizedLink
                                                key={product.id}
                                                to={`/product/${product.id}`}
                                                className={`group bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden ${viewMode === "list" ? "flex gap-4 p-4" : ""}`}
                                            >
                                                {/* Image */}
                                                <div className={`relative overflow-hidden ${viewMode === "list" ? "w-32 h-32 shrink-0 rounded-lg" : "aspect-square"}`}>
                                                    {product.mainImage ? (
                                                        <img
                                                            src={product.mainImage}
                                                            alt={getLocalizedName(product)}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-muted flex items-center justify-center">
                                                            <Package className="h-8 w-8 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    {product.discount > 0 && (
                                                        <Badge variant="destructive" className="absolute top-2 left-2 text-xs font-bold">
                                                            -{product.discount}%
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className={viewMode === "list" ? "flex-1 flex flex-col justify-between" : "p-4"}>
                                                    <div>
                                                        <h3 className={`font-medium group-hover:text-primary transition-colors ${viewMode === "grid" ? "text-sm line-clamp-2 mb-2 min-h-10" : ""}`}>
                                                            {getLocalizedName(product)}
                                                        </h3>
                                                        <div className="flex items-center gap-1 mb-2">
                                                            <Star className="h-4 w-4 fill-warning text-warning" />
                                                            <span className="text-sm font-medium">{product.rating || "5.0"}</span>
                                                            <span className="text-xs text-muted-foreground">({product.reviews || 0})</span>
                                                        </div>
                                                    </div>

                                                    <div className={`flex items-center justify-between ${viewMode === "grid" ? "mt-auto" : ""}`}>
                                                        <div className="flex flex-col">
                                                            <span className="text-lg font-bold text-primary">
                                                                {mainPrice ? `${mainPrice.price} ${mainPrice.currency?.title}` : "Price not set"}
                                                            </span>
                                                            {product.discount > 0 && mainPrice && (
                                                                <span className="text-xs text-muted-foreground line-through">
                                                                    {(mainPrice.price / (1 - product.discount / 100)).toFixed(2)} {mainPrice.currency?.title}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10 hover:text-primary">
                                                            <ShoppingCart className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </LocalizedLink>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default VendorDetail;
