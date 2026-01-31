"use client";

import { useState } from "react";
import { Search, Star, Package, Filter, ChevronDown, Store } from "lucide-react";
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

interface VendorsProps {
  initialVendors: any[];
}

const Vendors = ({ initialVendors }: VendorsProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [vendors, setVendors] = useState(initialVendors);

  const filteredVendors = vendors.filter((vendor) =>
    (vendor.vendorName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-linear-to-r from-primary/10 to-accent/10 py-8">
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
                    <div className="relative h-28 overflow-hidden bg-muted">
                      {vendor.banner ? (
                        <img
                          src={vendor.banner}
                          alt={vendor.vendorName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <Store className="h-8 w-8 text-primary/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                      <p className="absolute bottom-2 left-3 right-3 text-xs text-white font-medium truncate">
                        {vendor.description || vendor.vendorName}
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
                      <div className="absolute -top-6 left-3 h-12 w-12 rounded-xl border-3 border-card bg-card overflow-hidden shadow-md flex items-center justify-center">
                        {vendor.logo ? (
                          <img
                            src={vendor.logo}
                            alt={vendor.vendorName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Store className="h-6 w-6 text-primary" />
                        )}
                      </div>

                      <div className="pt-8">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {vendor.vendorName}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <Star className="h-4 w-4 fill-warning text-warning" />
                          <span className="font-medium text-foreground">{vendor.rating || "5.0"}</span>
                          <span>{t("rating")}</span>
                          <span className="text-muted-foreground/50">•</span>
                          <span>{vendor.reviews || 0} {t("reviews")}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-primary font-semibold">
                          <Package className="h-4 w-4" />
                          <span>{vendor._count?.products || 0} {t("products")}</span>
                        </div>
                      </div>
                    </div>
                  </LocalizedLink>
                ))}
              </div>
              {filteredVendors.length === 0 && (
                <div className="text-center py-20">
                  <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground">No stores found matching your search.</p>
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

export default Vendors;
