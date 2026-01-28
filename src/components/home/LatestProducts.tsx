import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useTranslation } from "@/hooks/useTranslation";

const products = [
  {
    id: 1,
    name: "Diamond Necklace Premium",
    price: 89.99,
    originalPrice: 129.99,
    discount: 30,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300",
  },
  {
    id: 2,
    name: "Engine Cylinder Head",
    price: 450.00,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300",
  },
  {
    id: 3,
    name: "LED Tail Lights Set",
    price: 85.00,
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=300",
  },
  {
    id: 4,
    name: "Premium Car Seat Cover",
    price: 120.00,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300",
  },
];

export const LatestProducts = () => {
  const { t } = useTranslation();

  return (
    <section className="py-6">
      <div className="flex gap-6">
        {/* Deal of the Day */}
        <div className="hidden lg:block w-72 shrink-0">
          <div className="bg-card rounded-lg border p-6 h-full">
            <h3 className="text-primary font-bold text-center mb-6">{t("dealOfTheDay")}</h3>
            <div className="relative">
              <Badge variant="destructive" className="absolute -top-2 left-0 z-10">
                -30%
              </Badge>
              <div className="aspect-square rounded-lg overflow-hidden bg-muted/30 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300"
                  alt="Deal of the day"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h4 className="font-medium text-center">Diamond Necklace Premium</h4>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-muted-foreground text-sm line-through">$129.99</span>
              <span className="text-primary font-bold text-lg">$89.99</span>
            </div>
          </div>
        </div>

        {/* Latest Products */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">{t("latestProducts")}</h2>
            <LocalizedLink to="/products" className="text-primary hover:underline flex items-center gap-1 text-sm font-medium">
              {t("viewAll")} <ChevronRight className="h-4 w-4" />
            </LocalizedLink>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <LocalizedLink
                key={product.id}
                to={`/product/${product.id}`}
                className="bg-card rounded-lg border p-3 hover:shadow-md transition-all group"
              >
                <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-muted/30">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-primary font-bold mt-1">${product.price.toFixed(2)}</p>
              </LocalizedLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
