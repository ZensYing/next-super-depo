"use client";

import { LocalizedLink as Link } from "@/components/LocalizedLink";
import { ChevronRight, Star, Package, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";

interface FeaturedDealProps {
  deal?: any;
}

export const FeaturedDeal = ({ deal }: FeaturedDealProps) => {
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
    const priceData = product?.productPrices?.[0];
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
    if (!product?.discount || product.discount <= 0) return null;
    const discountedPrice = priceInfo.original * (1 - product.discount / 100);
    return `${priceInfo.currency}${discountedPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  if (!deal) {
    return null;
  }

  return (
    <section className="py-6">
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-500" />
            <div>
              <h2 className="text-xl font-bold">Featured Deal</h2>
              <p className="text-sm text-muted-foreground">See the latest deals and exciting new offers!</p>
            </div>
          </div>
          <Link to="/deals" className="text-primary hover:underline flex items-center gap-1 text-sm font-medium">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <Link
          to={`/product/${deal.id}`}
          className="bg-card rounded-lg border p-6 hover:shadow-lg transition-all flex flex-col md:flex-row gap-6 group"
        >
          <div className="relative">
            {deal.discount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -left-2 z-10 text-sm px-2 py-1"
              >
                -{Math.round(deal.discount)}%
              </Badge>
            )}
            <div className="w-full md:w-48 h-48 rounded-lg bg-muted/30 overflow-hidden">
              {deal.mainImage ? (
                <img
                  src={deal.mainImage}
                  alt={getLocalizedName(deal)}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-16 w-16 text-muted-foreground/30" />
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors mb-2">
              {getLocalizedName(deal)}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
              {deal.description || "No description available."}
            </p>
            <div className="flex items-center gap-3">
              {getDiscountedPrice(deal) ? (
                <>
                  <span className="text-2xl text-primary font-bold">{getDiscountedPrice(deal)}</span>
                  <span className="text-muted-foreground text-lg line-through">{getPrice(deal).formatted}</span>
                </>
              ) : (
                <span className="text-2xl text-primary font-bold">{getPrice(deal).formatted}</span>
              )}
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};
