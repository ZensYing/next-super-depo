"use client";

import { ChevronRight, Package, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";

interface LatestProductsProps {
  products: any[];
  dealOfTheDay?: any;
}

export const LatestProducts = ({ products, dealOfTheDay }: LatestProductsProps) => {
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

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-6">
      <div className="flex gap-6">
        {/* Deal of the Day */}
        {dealOfTheDay && (
          <div className="hidden lg:block w-72 shrink-0">
            <div className="bg-card rounded-lg border p-6 h-full">
              <h3 className="text-primary font-bold text-center mb-6">{t("dealOfTheDay")}</h3>
              <LocalizedLink to={`/product/${dealOfTheDay.id}`} className="block relative">
                {dealOfTheDay.discount > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 left-0 z-10">
                    -{Math.round(dealOfTheDay.discount)}%
                  </Badge>
                )}
                <div className="aspect-square rounded-lg overflow-hidden bg-muted/30 mb-4">
                  {dealOfTheDay.mainImage ? (
                    <img
                      src={dealOfTheDay.mainImage}
                      alt={getLocalizedName(dealOfTheDay)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-16 w-16 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <h4 className="font-medium text-center line-clamp-2">{getLocalizedName(dealOfTheDay)}</h4>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {getDiscountedPrice(dealOfTheDay) ? (
                    <>
                      <span className="text-muted-foreground text-sm line-through">{getPrice(dealOfTheDay).formatted}</span>
                      <span className="text-primary font-bold text-lg">{getDiscountedPrice(dealOfTheDay)}</span>
                    </>
                  ) : (
                    <span className="text-primary font-bold text-lg">{getPrice(dealOfTheDay).formatted}</span>
                  )}
                </div>
              </LocalizedLink>
            </div>
          </div>
        )}

        {/* Latest Products */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">{t("latestProducts")}</h2>
            <LocalizedLink to="/products" className="text-primary hover:underline flex items-center gap-1 text-sm font-medium">
              {t("viewAll")} <ChevronRight className="h-4 w-4" />
            </LocalizedLink>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.slice(0, 8).map((product) => (
              <LocalizedLink
                key={product.id}
                to={`/product/${product.id}`}
                className="bg-card rounded-lg border p-3 hover:shadow-md transition-all group relative"
              >
                {product.discount > 0 && (
                  <Badge variant="destructive" className="absolute top-2 left-2 z-10 text-xs">
                    -{Math.round(product.discount)}%
                  </Badge>
                )}
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
                <div className="mt-1">
                  {getDiscountedPrice(product) ? (
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-bold">{getDiscountedPrice(product)}</span>
                      <span className="text-muted-foreground text-xs line-through">{getPrice(product).formatted}</span>
                    </div>
                  ) : (
                    <p className="text-primary font-bold">{getPrice(product).formatted}</p>
                  )}
                </div>
              </LocalizedLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
