import { useState } from "react";
import { useParams } from "next/navigation";
import { Grid, List, Star, Heart, ShoppingCart, Filter, ChevronDown, SlidersHorizontal } from "lucide-react";
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
import { TranslationKey } from "@/i18n/translations";

// Category data with translation keys
const categoryData: Record<string, { nameKey: TranslationKey; icon: string; color: string }> = {
    "mens-fashion": { nameKey: "mensFashion", icon: "👔", color: "from-blue-500 to-indigo-600" },
    "womens-fashion": { nameKey: "womensFashion", icon: "👗", color: "from-pink-500 to-rose-600" },
    "kids-fashion": { nameKey: "kidsFashion", icon: "👶", color: "from-purple-500 to-violet-600" },
    "health-beauty": { nameKey: "healthBeauty", icon: "💄", color: "from-rose-400 to-pink-500" },
    "pet-supplies": { nameKey: "petSupplies", icon: "🐕", color: "from-amber-500 to-orange-600" },
    "home-kitchen": { nameKey: "homeKitchen", icon: "🏠", color: "from-emerald-500 to-teal-600" },
    "baby-toddler": { nameKey: "babyToddler", icon: "👶", color: "from-sky-400 to-blue-500" },
    "sports-outdoor": { nameKey: "sportsOutdoor", icon: "⚽", color: "from-green-500 to-emerald-600" },
    "phone-gadgets": { nameKey: "phoneGadgets", icon: "📱", color: "from-slate-600 to-gray-700" },
    "electronics": { nameKey: "electronicsGadgets", icon: "💻", color: "from-cyan-500 to-blue-600" },
};

// Mock products data
const allProducts = [
    {
        id: 1,
        name: "Premium Cotton T-Shirt",
        price: 29.99,
        originalPrice: 49.99,
        discount: 40,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        rating: 4.5,
        reviews: 128,
        category: "mens-fashion",
    },
    {
        id: 2,
        name: "Classic Denim Jacket",
        price: 89.99,
        originalPrice: 129.99,
        discount: 30,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
        rating: 4.8,
        reviews: 256,
        category: "mens-fashion",
    },
    {
        id: 3,
        name: "Slim Fit Chino Pants",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400",
        rating: 4.3,
        reviews: 89,
        category: "mens-fashion",
    },
    {
        id: 4,
        name: "Elegant Evening Dress",
        price: 159.99,
        originalPrice: 199.99,
        discount: 20,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
        rating: 4.9,
        reviews: 312,
        category: "womens-fashion",
    },
    {
        id: 5,
        name: "Casual Summer Blouse",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400",
        rating: 4.4,
        reviews: 167,
        category: "womens-fashion",
    },
    {
        id: 6,
        name: "Kids Cartoon T-Shirt",
        price: 19.99,
        image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400",
        rating: 4.6,
        reviews: 78,
        category: "kids-fashion",
    },
    {
        id: 7,
        name: "Vitamin C Serum",
        price: 34.99,
        originalPrice: 44.99,
        discount: 22,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
        rating: 4.7,
        reviews: 432,
        category: "health-beauty",
    },
    {
        id: 8,
        name: "Premium Dog Food 10kg",
        price: 45.99,
        image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400",
        rating: 4.8,
        reviews: 234,
        category: "pet-supplies",
    },
    {
        id: 9,
        name: "Non-Stick Cookware Set",
        price: 129.99,
        originalPrice: 179.99,
        discount: 28,
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
        rating: 4.5,
        reviews: 189,
        category: "home-kitchen",
    },
    {
        id: 10,
        name: "Baby Stroller Deluxe",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1586005684657-61d215eec88a?w=400",
        rating: 4.9,
        reviews: 156,
        category: "baby-toddler",
    },
    {
        id: 11,
        name: "Yoga Mat Premium",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",
        rating: 4.6,
        reviews: 287,
        category: "sports-outdoor",
    },
    {
        id: 12,
        name: "iPhone 15 Pro Case",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400",
        rating: 4.4,
        reviews: 543,
        category: "phone-gadgets",
    },
];

const CategoryDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [sortBy, setSortBy] = useState("default");
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });

    const category = slug ? categoryData[slug] : null;
    const products = allProducts.filter((p) => p.category === slug);

    // Sort products
    const sortedProducts = [...products].sort((a, b) => {
        switch (sortBy) {
            case "price-low":
                return a.price - b.price;
            case "price-high":
                return b.price - a.price;
            case "rating":
                return b.rating - a.rating;
            case "newest":
                return b.id - a.id;
            default:
                return 0;
        }
    });

    if (!category) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 container py-12 text-center">
                    <h1 className="text-2xl font-bold mb-4">{t("pageNotFound")}</h1>
                    <LocalizedLink to="/" className="text-primary hover:underline">
                        {t("home")}
                    </LocalizedLink>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1">
                {/* Category Header */}
                <div className="bg-primary py-8">
                    <div className="container">
                        <div className="flex items-center gap-4">
                            <span className="text-5xl">{category.icon}</span>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1">{t(category.nameKey)}</h1>
                                <p className="text-white/80">{sortedProducts.length} {t("products")}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Filters */}
                        <aside className="w-full lg:w-64 shrink-0">
                            <div className="bg-card rounded-2xl p-6 shadow-card sticky top-32">
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
                                            <SelectItem value="rating">{t("rating")}</SelectItem>
                                            <SelectItem value="newest">{t("newArrivals")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Rating Filter */}
                                <div>
                                    <label className="text-sm font-medium mb-3 block">{t("rating")}</label>
                                    <div className="space-y-2">
                                        {[5, 4, 3, 2, 1].map((rating) => (
                                            <button
                                                key={rating}
                                                className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors hover:bg-muted flex items-center gap-2"
                                            >
                                                <div className="flex items-center">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${i < rating ? "fill-warning text-warning" : "text-muted-foreground/30"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-muted-foreground">& up</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
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
                                    <p className="text-muted-foreground text-lg">{t("noResults")}</p>
                                </div>
                            ) : viewMode === "grid" ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                    {sortedProducts.map((product) => (
                                        <LocalizedLink
                                            key={product.id}
                                            to={`/product/${product.id}`}
                                            className="group bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
                                        >
                                            {/* Image */}
                                            <div className="relative aspect-square overflow-hidden">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                {product.discount && (
                                                    <Badge variant="destructive" className="absolute top-3 left-3 text-sm font-bold">
                                                        -{product.discount}%
                                                    </Badge>
                                                )}
                                                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button size="icon-sm" variant="secondary" className="rounded-full shadow-md">
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
                                                    {product.name}
                                                </h3>
                                                <div className="flex items-center gap-1 mb-2">
                                                    <Star className="h-4 w-4 fill-warning text-warning" />
                                                    <span className="text-sm font-medium">{product.rating}</span>
                                                    <span className="text-xs text-muted-foreground">({product.reviews})</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold text-primary">${product.price}</span>
                                                    {product.originalPrice && (
                                                        <span className="text-sm text-muted-foreground line-through">
                                                            ${product.originalPrice}
                                                        </span>
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
                                            className="group bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden flex gap-4 p-4"
                                        >
                                            {/* Image */}
                                            <div className="relative w-32 h-32 shrink-0 rounded-lg overflow-hidden">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                {product.discount && (
                                                    <Badge variant="destructive" className="absolute top-2 left-2 text-xs font-bold">
                                                        -{product.discount}%
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="font-medium group-hover:text-primary transition-colors">
                                                        {product.name}
                                                    </h3>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <Star className="h-4 w-4 fill-warning text-warning" />
                                                        <span className="text-sm font-medium">{product.rating}</span>
                                                        <span className="text-xs text-muted-foreground">({product.reviews} {t("reviews")})</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xl font-bold text-primary">${product.price}</span>
                                                        {product.originalPrice && (
                                                            <span className="text-sm text-muted-foreground line-through">
                                                                ${product.originalPrice}
                                                            </span>
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
