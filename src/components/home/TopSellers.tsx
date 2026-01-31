"use client";

import { ChevronRight, Store } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useTranslation } from "@/hooks/useTranslation";

interface TopSellersProps {
  vendors: any[];
}

export const TopSellers = ({ vendors }: TopSellersProps) => {
  const { t } = useTranslation();

  if (!vendors || vendors.length === 0) {
    return null;
  }

  const tagColors = [
    "bg-teal-100", "bg-pink-100", "bg-blue-100", "bg-amber-100",
    "bg-purple-100", "bg-green-100"
  ];

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">{t("topSellers")}</h2>
        <LocalizedLink to="/vendors" className="text-primary hover:underline flex items-center gap-1 text-sm font-medium">
          {t("viewAll")} <ChevronRight className="h-4 w-4" />
        </LocalizedLink>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {vendors.slice(0, 4).map((vendor, index) => (
          <LocalizedLink
            key={vendor.id}
            to={`/vendor/${vendor.id}`}
            className="bg-card rounded-lg border overflow-hidden hover:shadow-md transition-all group"
          >
            {/* Banner */}
            <div className="relative h-20 overflow-hidden bg-gradient-to-r from-primary/20 to-primary/10">
              {vendor.banner ? (
                <img
                  src={vendor.banner}
                  alt={vendor.vendorName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Store className="h-8 w-8 text-primary/30" />
                </div>
              )}
              <div className={`absolute top-2 right-2 ${tagColors[index % tagColors.length]} px-2 py-0.5 rounded text-xs font-medium`}>
                {vendor._count?.products || 0} Products
              </div>
              {vendor.status === 'inactive' && (
                <div className="absolute bottom-2 left-2 bg-muted-foreground text-white text-xs px-2 py-1 rounded-full">
                  Closed
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 relative">
              {/* Logo */}
              <div className="absolute -top-6 left-4 h-12 w-12 rounded-full border-2 border-card bg-card overflow-hidden shadow-md flex items-center justify-center">
                {vendor.logo ? (
                  <img
                    src={vendor.logo}
                    alt={vendor.vendorName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Store className="h-5 w-5 text-muted-foreground/50" />
                )}
              </div>

              <div className="pt-6">
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {vendor.vendorName}
                </h3>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <div className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full">
                    <span className="font-medium">{vendor._count?.products || 0}</span>
                    <span className="text-muted-foreground">{t("products")}</span>
                  </div>
                </div>
              </div>
            </div>
          </LocalizedLink>
        ))}
      </div>
    </section>
  );
};
