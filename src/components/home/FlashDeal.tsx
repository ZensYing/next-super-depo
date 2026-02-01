import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useTranslation } from "@/hooks/useTranslation";

const flashProducts = [
  {
    id: 1,
    name: "iPhone 14 Pro Max",
    price: 1149.00,
    image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=300",
  },
  {
    id: 2,
    name: "Beauty Jelly Lipstick",
    price: 32.00,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300",
  },
  {
    id: 3,
    name: "Leather Ladies Bag",
    price: 15.00,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300",
  },
  {
    id: 4,
    name: "Samsung S24 Ultra",
    price: 1150.00,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300",
  },
];

export const FlashDeal = () => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState({ days: 717, hours: 9, minutes: 43, seconds: 47 });

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

  return (
    <section className="py-6">
      <div className="bg-card rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-primary">{t("flashDeal")}</h2>
            <p className="text-sm text-muted-foreground">{t("flashDealDesc")}</p>
          </div>
          <LocalizedLink to="/deals" className="text-primary hover:underline flex items-center gap-1 text-sm font-medium">
            {t("viewAll")} <ChevronRight className="h-4 w-4" />
          </LocalizedLink>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Timer */}
          <div className="bg-primary rounded-lg p-6 flex flex-col justify-center items-center lg:min-w-[280px]">
            <div className="flex gap-2 text-white font-bold text-3xl lg:text-4xl font-mono">
              <div className="flex flex-col items-center">
                <span className="bg-primary-foreground/20 px-3 py-2 rounded">{String(timeLeft.days).padStart(3, '0')}</span>
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
            {flashProducts.map((product) => (
              <LocalizedLink
                key={product.id}
                to={`/product/${product.id}`}
                className="bg-background rounded-lg border p-3 hover:shadow-md transition-shadow group"
              >
                <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-muted/30">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-sm font-medium line-clamp-1">{product.name}</h3>
                <p className="text-primary font-bold mt-1">${product.price.toFixed(2)}</p>
              </LocalizedLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
