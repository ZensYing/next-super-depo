
import { useState } from "react";
import { Grid, List, Star, Heart, ShoppingCart, SlidersHorizontal, Package } from "lucide-react";
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

// Mock products data for Wholesale
const wholesaleProducts = [
    {
        id: 201,
        name: "Bulk T-Shirts (Pack of 50)",
        price: 499.99,
        originalPrice: 750.00,
        discount: 33,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        rating: 4.9,
        reviews: 42,
        category: "Fashion Wholesale",
        minOrder: "5 Packs",
    },
    {
        id: 202,
        name: "Restaurant Plates Set (100 pcs)",
        price: 899.99,
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
        rating: 4.7,
        reviews: 28,
        category: "Kitchen Supplies",
        minOrder: "1 Set",
    },
    {
        id: 203,
        name: "Coffee Beans (10kg Sack)",
        price: 150.00,
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
        rating: 4.8,
        reviews: 156,
        category: "Food Service",
        minOrder: "2 Sacks",
    },
    {
        id: 204,
        name: "Office Chairs Bulk (10 units)",
        price: 1200.00,
        originalPrice: 1500.00,
        discount: 20,
        image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400",
        rating: 4.6,
        reviews: 15,
        category: "Office Supplies",
        minOrder: "1 Order",
    },
    {
        id: 205,
        name: "Construction Helmets (Box of 20)",
        price: 180.00,
        image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400",
        rating: 4.5,
        reviews: 34,
        category: "Construction",
        minOrder: "5 Boxes",
    },
];

const Wholesale = () => {
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [sortBy, setSortBy] = useState("default");
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });

    // Sort products
    const sortedProducts = [...wholesaleProducts].sort((a, b) => {
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

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1">
                {/* Header Banner */}
                <div className="bg-primary py-8">
                    <div className="container">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                                <Package className="h-10 w-10 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1">{t("wholesale")}</h1>
                                <p className="text-white/80">{t("discoverDeals")}</p>
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
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="text-xs text-muted-foreground">{product.category}</div>
                                                    <Badge variant="outline" className="text-[10px] h-5">{product.minOrder}</Badge>
                                                </div>
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
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="text-xs text-muted-foreground">{product.category}</div>
                                                        <Badge variant="outline" className="text-[10px] h-5">{product.minOrder}</Badge>
                                                    </div>
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

export default Wholesale;
