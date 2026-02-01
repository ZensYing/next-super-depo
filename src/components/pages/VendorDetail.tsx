import { useState } from "react";
import { useParams } from "next/navigation";
import { Grid, List, Star, Heart, ShoppingCart, Filter, Search, MapPin, Phone, Mail, Clock, Share2 } from "lucide-react";
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

// Mock vendors data (same as in Vendors.tsx)
const vendors = [
    {
        id: 1,
        name: "6Valley CMS",
        banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
        logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200",
        rating: 4.8,
        reviews: 4,
        products: 194,
        tagline: "Multi Vendor ECommerce CMS",
        status: "open",
        address: "123 Tech Street, Silicon Valley",
        phone: "+1 234 567 890",
        email: "contact@6valley.com",
        joined: "2023",
    },
    {
        id: 2,
        name: "Bicycle Shop",
        banner: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200",
        logo: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=200",
        rating: 4.2,
        reviews: 8,
        products: 14,
        tagline: "Ride Into Adventure",
        status: "open",
        address: "45 Cycle Lane, Bike City",
        phone: "+1 987 654 321",
        email: "info@bicycleshop.com",
        joined: "2024",
    },
    // ... add other vendors if needed
];

// Mock products specific to vendors
const vendorProducts = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    name: `Sample Product ${i + 1}`,
    price: (Math.random() * 100 + 10).toFixed(2),
    originalPrice: (Math.random() * 150 + 50).toFixed(2),
    discount: Math.floor(Math.random() * 50),
    image: `https://images.unsplash.com/photo-${1500000000000 + i}?w=400&auto=format&fit=crop`,
    rating: (Math.random() * 2 + 3).toFixed(1),
    reviews: Math.floor(Math.random() * 100),
}));

const VendorDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");

    const vendor = vendors.find(v => v.id === Number(id)) || vendors[0]; // Fallback to first vendor for demo

    // Filter products based on search
    const filteredProducts = vendorProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!vendor) {
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
                {/* Vendor Header / Banner */}
                <div className="relative h-48 md:h-64 lg:h-80 bg-muted">
                    <img
                        src={vendor.banner}
                        alt={vendor.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />

                    <div className="absolute bottom-0 left-0 right-0 container py-6 text-white">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                            {/* Logo */}
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-white p-1 shadow-lg shrink-0 overflow-hidden">
                                <img
                                    src={vendor.logo}
                                    alt={vendor.name}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left mb-2">
                                <h1 className="text-2xl md:text-4xl font-bold mb-2">{vendor.name}</h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm md:text-base opacity-90">
                                    <span className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        {vendor.rating} ({vendor.reviews} {t("reviews")})
                                    </span>
                                    <span className="hidden md:inline">•</span>
                                    <span>{vendor.products} {t("products")}</span>
                                    <span className="hidden md:inline">•</span>
                                    <span>{t("joined")} {vendor.joined}</span>
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
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {vendor.address}
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {vendor.phone}
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {vendor.email}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {vendor.status === "open" ? <span className="text-green-600 font-medium">Open Now</span> : <span className="text-destructive font-medium">Closed</span>}
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

                            <div className="bg-card rounded-2xl p-6 shadow-card">
                                <h3 className="font-semibold mb-4">{t("categories")}</h3>
                                <div className="space-y-2">
                                    {["All Products", "Best Selling", "New Arrivals", "Clearance"].map((cat) => (
                                        <button key={cat} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                                            {cat}
                                        </button>
                                    ))}
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
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground text-lg">{t("noResults")}</p>
                                </div>
                            ) : (
                                <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6" : "space-y-4"}>
                                    {filteredProducts.map((product) => (
                                        <LocalizedLink
                                            key={product.id}
                                            to={`/product/${product.id}`}
                                            className={`group bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden ${viewMode === "list" ? "flex gap-4 p-4" : ""}`}
                                        >
                                            {/* Image */}
                                            <div className={`relative overflow-hidden ${viewMode === "list" ? "w-32 h-32 shrink-0 rounded-lg" : "aspect-square"}`}>
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                {product.discount > 0 && (
                                                    <Badge variant="destructive" className="absolute top-2 left-2 text-xs font-bold">
                                                        -{product.discount}%
                                                    </Badge>
                                                )}
                                                {viewMode === "grid" && (
                                                    <>
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
                                                    </>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className={viewMode === "list" ? "flex-1 flex flex-col justify-between" : "p-4"}>
                                                <div>
                                                    <h3 className={`font-medium group-hover:text-primary transition-colors ${viewMode === "grid" ? "text-sm line-clamp-2 mb-2 min-h-[2.5rem]" : ""}`}>
                                                        {product.name}
                                                    </h3>
                                                    <div className="flex items-center gap-1 mb-2">
                                                        <Star className="h-4 w-4 fill-warning text-warning" />
                                                        <span className="text-sm font-medium">{product.rating}</span>
                                                        <span className="text-xs text-muted-foreground">({product.reviews})</span>
                                                    </div>
                                                </div>

                                                <div className={`flex items-center justify-between ${viewMode === "grid" ? "mt-auto" : ""}`}>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg font-bold text-primary">${product.price}</span>
                                                        {Number(product.originalPrice) > Number(product.price) && (
                                                            <span className="text-sm text-muted-foreground line-through">
                                                                ${product.originalPrice}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {viewMode === "list" && (
                                                        <Button size="sm" className="gap-2">
                                                            <ShoppingCart className="h-4 w-4" />
                                                            {t("addToCart")}
                                                        </Button>
                                                    )}
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

export default VendorDetail;
