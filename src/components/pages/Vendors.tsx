import { useState } from "react";
import { Search, Star, Package, Filter, ChevronDown } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useTranslation } from "@/hooks/useTranslation";

const allVendors = [
  {
    id: 1,
    name: "6Valley CMS",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100",
    rating: 4.8,
    reviews: 4,
    products: 194,
    tagline: "Multi Vendor ECommerce CMS",
    status: "open",
  },
  {
    id: 2,
    name: "Bicycle Shop",
    banner: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
    logo: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=100",
    rating: 4.2,
    reviews: 8,
    products: 14,
    tagline: "Ride Into Adventure",
    status: "open",
  },
  {
    id: 3,
    name: "Book Store",
    banner: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600",
    logo: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100",
    rating: 4.5,
    reviews: 2,
    products: 19,
    tagline: "Discover Your Next Great Read",
    status: "open",
  },
  {
    id: 4,
    name: "Golden Jewellery",
    banner: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600",
    logo: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=100",
    rating: 3.0,
    reviews: 1,
    products: 17,
    tagline: "Beauty Of Exquisite Craftmanship",
    status: "open",
  },
  {
    id: 5,
    name: "FootFinds",
    banner: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600",
    logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100",
    rating: 5.0,
    reviews: 1,
    products: 13,
    tagline: "Step Into Style Today!",
    status: "open",
  },
  {
    id: 6,
    name: "Phone Store",
    banner: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
    logo: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=100",
    rating: 4.0,
    reviews: 3,
    products: 13,
    tagline: "Looking For The Newest Smartphones?",
    status: "open",
  },
  {
    id: 7,
    name: "Pets Store",
    banner: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600",
    logo: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100",
    rating: 4.3,
    reviews: 5,
    products: 13,
    tagline: "Pamper Your Pets Today!",
    status: "open",
  },
  {
    id: 8,
    name: "Athletic Venture",
    banner: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600",
    logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100",
    rating: 4.1,
    reviews: 2,
    products: 16,
    tagline: "Gear Up For Your Game!",
    status: "closed",
  },
];

const Vendors = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const filteredVendors = allVendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-8">
          <div className="container">
            <h1 className="text-3xl font-bold text-primary mb-2">{t("allStores")}</h1>
            <p className="text-muted-foreground">
              {t("findStoresDesc")}
            </p>
          </div>
        </div>

        <div className="container py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 shrink-0">
              <div className="bg-card rounded-2xl p-6 shadow-card sticky top-32">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  {t("filterBy")}
                </h3>

                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <Input
                      type="search"
                      placeholder={t("searchStore")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                      <SelectItem value="rating">{t("highestRating")}</SelectItem>
                      <SelectItem value="products">{t("mostProducts")}</SelectItem>
                      <SelectItem value="name">{t("nameAZ")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Categories */}
                <div>
                  <label className="text-sm font-medium mb-3 block">{t("categories")}</label>
                  <div className="space-y-2">
                    {["mensFashion", "womensFashion", "electronics", "homeKitchen", "healthBeauty"].map((categoryKey) => (
                      <button
                        key={categoryKey}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors hover:bg-muted flex items-center justify-between"
                      >
                        {t(categoryKey as any)}
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVendors.map((vendor) => (
                  <LocalizedLink
                    key={vendor.id}
                    to={`/vendor/${vendor.id}`}
                    className="group bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
                  >
                    {/* Banner */}
                    <div className="relative h-28 overflow-hidden">
                      <img
                        src={vendor.banner}
                        alt={vendor.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <p className="absolute bottom-2 left-3 right-3 text-xs text-white font-medium truncate">
                        {vendor.tagline}
                      </p>
                      {vendor.status === "closed" && (
                        <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full font-medium">
                          {t("closedNow")}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 pt-0 relative">
                      {/* Logo */}
                      <div className="absolute -top-6 left-3 h-12 w-12 rounded-xl border-3 border-card bg-card overflow-hidden shadow-md">
                        <img
                          src={vendor.logo}
                          alt={vendor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="pt-8">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {vendor.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <Star className="h-4 w-4 fill-warning text-warning" />
                          <span className="font-medium text-foreground">{vendor.rating}</span>
                          <span>{t("rating")}</span>
                          <span className="text-muted-foreground/50">•</span>
                          <span>{vendor.reviews} {t("reviews")}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-primary font-semibold">
                          <Package className="h-4 w-4" />
                          <span>{vendor.products} {t("products")}</span>
                        </div>
                      </div>
                    </div>
                  </LocalizedLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Vendors;
