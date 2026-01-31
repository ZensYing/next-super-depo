"use client";

import { ChevronRight, Package } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";

interface FeaturedProductsProps {
  products: any[];
}

export const FeaturedProducts = ({ products }: FeaturedProductsProps) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const language = currentLanguage.code;

  // Get localized name
  const getLocalizedName = (product: any) => {
    switch (language) {
      case 'km': return product.productNameKh || product.productNameEn || "Untitled";
      case 'ko': return product.productNameKo || product.productNameEn || "Untitled";
      default: return product.productNameEn || product.productNameKh || "Untitled";
    }
  };

  // Get price
  const getPrice = (product: any) => {
    const priceData = product.productPrices?.[0];
    if (!priceData) return "Price not set";
    const currency = priceData.currency?.title || "$";
    const price = parseFloat(priceData.price);
    return `${currency}${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">{t("featuredProducts")}</h2>
        <LocalizedLink to="/products" className="text-primary hover:underline flex items-center gap-1 text-sm font-medium">
          {t("viewAll")} <ChevronRight className="h-4 w-4" />
        </LocalizedLink>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <LocalizedLink
            key={product.id}
            to={`/product/${product.id}`}
            className="bg-card rounded-lg border p-3 hover:shadow-md transition-all group"
          >
            <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-muted/30 flex items-center justify-center">
              {product.mainImage ? (
                <img
                  src={product.mainImage}
                  alt={getLocalizedName(product)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <Package className="h-12 w-12 text-muted-foreground/30" />
              )}
            </div>
            <h3 className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
              {getLocalizedName(product)}
            </h3>
            <p className="text-primary font-bold mt-1">{getPrice(product)}</p>
          </LocalizedLink>
        ))}
      </div>
    </section>
  );
};
