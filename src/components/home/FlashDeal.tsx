"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Package, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";

interface FlashDealProps {
  products: any[];
}

export const FlashDeal = ({ products }: FlashDealProps) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const language = currentLanguage.code;
  const [timeLeft, setTimeLeft] = useState({ days: 7, hours: 9, minutes: 43, seconds: 47 });

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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          days--;
        }
        if (days < 0) {
          days = 0;
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-6">
      <div className="bg-card rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-amber-500 fill-amber-500" />
            <div>
              <h2 className="text-xl font-bold text-primary">{t("flashDeal")}</h2>
              <p className="text-sm text-muted-foreground">{t("flashDealDesc")}</p>
            </div>
          </div>
          <LocalizedLink to="/deals" className="text-primary hover:underline flex items-center gap-1 text-sm font-medium">
            {t("viewAll")} <ChevronRight className="h-4 w-4" />
          </LocalizedLink>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Timer */}
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-lg p-6 flex flex-col justify-center items-center lg:min-w-[280px]">
            <div className="flex gap-2 text-white font-bold text-3xl lg:text-4xl font-mono">
              <div className="flex flex-col items-center">
                <span className="bg-primary-foreground/20 px-3 py-2 rounded">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="text-xs font-normal mt-1 opacity-80">{t("days")}</span>
              </div>
              <span className="py-2">:</span>
              <div className="flex flex-col items-center">
                <span className="bg-primary-foreground/20 px-3 py-2 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-xs font-normal mt-1 opacity-80">{t("hours")}</span>
              </div>
              <span className="py-2">:</span>
              <div className="flex flex-col items-center">
                <span className="bg-primary-foreground/20 px-3 py-2 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-xs font-normal mt-1 opacity-80">{t("minutes")}</span>
              </div>
              <span className="py-2">:</span>
              <div className="flex flex-col items-center">
                <span className="bg-primary-foreground/20 px-3 py-2 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-xs font-normal mt-1 opacity-80">{t("seconds")}</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.slice(0, 4).map((product) => (
              <LocalizedLink
                key={product.id}
                to={`/product/${product.id}`}
                className="bg-background rounded-lg border p-3 hover:shadow-md transition-shadow group relative"
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
                    <Package className="h-10 w-10 text-muted-foreground/30" />
                  )}
                </div>
                <h3 className="text-sm font-medium line-clamp-1">{getLocalizedName(product)}</h3>
                <div className="mt-1">
                  {getDiscountedPrice(product) ? (
                    <div className="flex flex-col">
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
