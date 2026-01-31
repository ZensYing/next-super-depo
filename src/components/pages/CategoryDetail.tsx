"use client";

import { useState } from "react";
import { Grid, List, Star, Heart, ShoppingCart, SlidersHorizontal, Package, Tag } from "lucide-react";
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

interface CategoryDetailProps {
    category: any;
    products: any[];
}

const CategoryDetail = ({ category, products }: CategoryDetailProps) => {
    const { t } = useTranslation();
    const { currentLanguage } = useLanguage();
    const language = currentLanguage.code;

    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [sortBy, setSortBy] = useState("default");
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });

    // Get localized category name
    const getCategoryName = () => {
        switch (language) {
            case 'km': return category.nameKh || category.nameEn || "Untitled";
            case 'ko': return category.nameKo || category.nameEn || "Untitled";
            default: return category.nameEn || category.nameKh || "Untitled";
        }
    };

    // Get localized product name
    const getProductName = (product: any) => {
        switch (language) {
            case 'km': return product.productNameKh || product.productNameEn || "Untitled";
            case 'ko': return product.productNameKo || product.productNameEn || "Untitled";
            default: return product.productNameEn || product.productNameKh || "Untitled";
        }
    };

    // Get price
    const getPrice = (product: any) => {
        const priceData = product.productPrices?.[0];
        if (!priceData) return { formatted: "Price not set", original: 0, currency: "$" };
        const currency = priceData.currency?.title || "$";
        const price = parseFloat(priceData.price);
        return {
            formatted: `${currency}${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            original: price,
            currency
        };
    };

    // Calculate discounted price
    const getDiscountedPrice = (product: any) => {
        const priceInfo = getPrice(product);
        if (!product.discount || product.discount <= 0) return null;
        const discountedPrice = priceInfo.original * (1 - product.discount / 100);
        return `${priceInfo.currency}${discountedPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    };

    // Filter products by price range
    let filteredProducts = [...products];
    if (priceRange.min) {
        filteredProducts = filteredProducts.filter(p => {
            const price = getPrice(p).original;
            return price >= parseFloat(priceRange.min);
        });
    }
    if (priceRange.max) {
        filteredProducts = filteredProducts.filter(p => {
            const price = getPrice(p).original;
            return price <= parseFloat(priceRange.max);
        });
    }

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case "price-low":
                return getPrice(a).original - getPrice(b).original;
            case "price-high":
                return getPrice(b).original - getPrice(a).original;
            case "newest":
                return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
            default:
                return 0;
        }
    });

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1">
                {/* Category Header */}
                <div className="bg-primary py-8">
                    <div className="container">
                        <div className="flex items-center gap-4">
                            {category.image ? (
                                <img
                                    src={category.image}
                                    alt={getCategoryName()}
                                    className="w-16 h-16 rounded-xl object-cover bg-white/10"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center">
                                    <Tag className="h-8 w-8 text-white/60" />
                                </div>
                            )}
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1">{getCategoryName()}</h1>
                                <p className="text-white/80">{category._count?.products || 0} {t("products")}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Filters */}
                        <aside className="w-full lg:w-64 shrink-0">
                            <div className="bg-card rounded-2xl p-6 shadow-sm border sticky top-32">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <SlidersHorizontal className="h-5 w-5" />
                                    {t("filterBy")}
                                </h3>

                                {/* Price Range */}
                                <div className="mb-6">
                                    <label className="text-sm font-medium mb-2 block">{t("price")}</label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            placeholder="Min"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                            className="w-full"
                                        />
                                        <span className="flex items-center text-muted-foreground">-</span>
                                        <Input
                                            type="number"
                                            placeholder="Max"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                {/* Sort */}
                                <div className="mb-6">
                                    <label className="text-sm font-medium mb-2 block">{t("sortBy")}</label>
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("default")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="default">{t("default")}</SelectItem>
                                            <SelectItem value="price-low">{t("price")} ↑</SelectItem>
                                            <SelectItem value="price-high">{t("price")} ↓</SelectItem>
                                            <SelectItem value="newest">{t("newArrivals")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Sub-categories */}
                                {category.subCategories?.length > 0 && (
                                    <div>
                                        <label className="text-sm font-medium mb-3 block">Sub-categories</label>
                                        <div className="space-y-2">
                                            {category.subCategories.map((sub: any) => (
                                                <LocalizedLink
                                                    key={sub.id}
                                                    to={`/subcategory/${sub.id}`}
                                                    className="block px-3 py-2 rounded-lg text-sm transition-colors hover:bg-muted"
                                                >
                                                    {language === 'km' ? sub.nameKh : sub.nameEn || sub.nameKh}
                                                </LocalizedLink>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </aside>

                        {/* Products Grid */}
                        <div className="flex-1">
                            {/* Toolbar */}
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-muted-foreground">
                                    {t("showingProducts")} <span className="font-medium text-foreground">{sortedProducts.length}</span> {t("products")}
                                </p>
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
                            {sortedProducts.length === 0 ? (
                                <div className="text-center py-12">
                                    <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                                    <p className="text-muted-foreground text-lg">{t("noResults")}</p>
                                </div>
                            ) : viewMode === "grid" ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                    {sortedProducts.map((product) => (
                                        <LocalizedLink
                                            key={product.id}
                                            to={`/product/${product.id}`}
                                            className="group bg-card rounded-2xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden"
                                        >
                                            {/* Image */}
                                            <div className="relative aspect-square overflow-hidden">
                                                {product.mainImage ? (
                                                    <img
                                                        src={product.mainImage}
                                                        alt={getProductName(product)}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-muted">
                                                        <Package className="h-12 w-12 text-muted-foreground/30" />
                                                    </div>
                                                )}
                                                {product.discount > 0 && (
                                                    <Badge variant="destructive" className="absolute top-3 left-3 text-sm font-bold">
                                                        -{Math.round(product.discount)}%
                                                    </Badge>
                                                )}
                                                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button size="icon" variant="secondary" className="rounded-full shadow-md h-8 w-8">
                                                        <Heart className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                                    <Button className="w-full gap-2" size="sm">
                                                        <ShoppingCart className="h-4 w-4" />
                                                        {t("addToCart")}
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-4">
                                                <h3 className="font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
                                                    {getProductName(product)}
                                                </h3>
                                                {product.vendor && (
                                                    <p className="text-xs text-muted-foreground mb-2">{product.vendor.vendorName}</p>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    {getDiscountedPrice(product) ? (
                                                        <>
                                                            <span className="text-lg font-bold text-primary">{getDiscountedPrice(product)}</span>
                                                            <span className="text-sm text-muted-foreground line-through">
                                                                {getPrice(product).formatted}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-lg font-bold text-primary">{getPrice(product).formatted}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </LocalizedLink>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {sortedProducts.map((product) => (
                                        <LocalizedLink
                                            key={product.id}
                                            to={`/product/${product.id}`}
                                            className="group bg-card rounded-2xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden flex gap-4 p-4"
                                        >
                                            {/* Image */}
                                            <div className="relative w-32 h-32 shrink-0 rounded-lg overflow-hidden">
                                                {product.mainImage ? (
                                                    <img
                                                        src={product.mainImage}
                                                        alt={getProductName(product)}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-muted">
                                                        <Package className="h-8 w-8 text-muted-foreground/30" />
                                                    </div>
                                                )}
                                                {product.discount > 0 && (
                                                    <Badge variant="destructive" className="absolute top-2 left-2 text-xs font-bold">
                                                        -{Math.round(product.discount)}%
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="font-medium group-hover:text-primary transition-colors">
                                                        {getProductName(product)}
                                                    </h3>
                                                    {product.vendor && (
                                                        <p className="text-xs text-muted-foreground mt-1">{product.vendor.vendorName}</p>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        {getDiscountedPrice(product) ? (
                                                            <>
                                                                <span className="text-xl font-bold text-primary">{getDiscountedPrice(product)}</span>
                                                                <span className="text-sm text-muted-foreground line-through">
                                                                    {getPrice(product).formatted}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-xl font-bold text-primary">{getPrice(product).formatted}</span>
                                                        )}
                                                    </div>
                                                    <Button size="sm" className="gap-2">
                                                        <ShoppingCart className="h-4 w-4" />
                                                        {t("addToCart")}
                                                    </Button>
                                                </div>
                                            </div>
                                        </LocalizedLink>
                                    ))}
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

export default CategoryDetail;
