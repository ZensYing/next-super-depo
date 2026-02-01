import { ChevronRight } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useTranslation } from "@/hooks/useTranslation";

const products = [
  {
    id: 1,
    name: "Honor X14 Plus Laptop",
    price: 2200.00,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300",
  },
  {
    id: 2,
    name: "Quercetinol Cleansing...",
    price: 10.00,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300",
  },
  {
    id: 3,
    name: "Moisturizing Cream",
    price: 15.00,
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=300",
  },
  {
    id: 4,
    name: "Beauty Facial Cleanser",
    price: 12.00,
    image: "https://images.unsplash.com/photo-1556228841-a3c527ebefe5?w=300",
  },
  {
    id: 5,
    name: "Moisturizing Cream",
    price: 14.00,
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4a38b4a?w=300",
  },
  {
    id: 6,
    name: "Tote Bag High Quality",
    price: 20.00,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=300",
  },
];

export const FeaturedProducts = () => {
  const { t } = useTranslation();

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
    </section>
  );
};
