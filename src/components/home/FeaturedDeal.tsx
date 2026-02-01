import { LocalizedLink as Link } from "@/components/LocalizedLink";
import { ChevronRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const deals = [
  {
    id: 1,
    name: "T900 Smart Watch",
    price: 28.50,
    originalPrice: 30.00,
    discount: 5,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200",
    rating: 4.5,
    reviews: 1,
  },
  {
    id: 2,
    name: "One Dark Window",
    price: 13.44,
    originalPrice: 14.00,
    discount: 4,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200",
    rating: 0,
    reviews: 0,
  },
  {
    id: 3,
    name: "Water Purifier",
    price: 269.10,
    originalPrice: 299.00,
    discount: 10,
    image: "https://images.unsplash.com/photo-1564419320408-38e24e038739?w=200",
    rating: 0,
    reviews: 0,
  },
  {
    id: 4,
    name: "Xiaomi Mijia Earbuds A2 Pro",
    price: 34.00,
    originalPrice: 39.00,
    discount: 5,
    discountType: "fixed",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200",
    rating: 0,
    reviews: 0,
  },
];

export const FeaturedDeal = () => {
  return (
    <section className="py-6">
      <div className="bg-muted/30 rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Featured Deal</h2>
            <p className="text-sm text-muted-foreground">See the latest deals and exciting new offers!</p>
          </div>
          <Link to="/deals" className="text-primary hover:underline flex items-center gap-1 text-sm font-medium">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {deals.map((deal) => (
            <Link
              key={deal.id}
              to={`/product/${deal.id}`}
              className="bg-card rounded-lg border p-4 hover:shadow-md transition-all flex gap-3 group"
            >
              <div className="relative">
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -left-1 z-10 text-xs px-1.5 py-0.5"
                >
                  {deal.discountType === 'fixed' ? `-$${deal.discount}.00` : `-${deal.discount}%`}
                </Badge>
                <div className="w-16 h-16 rounded-lg bg-muted/30 overflow-hidden">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                  {deal.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-muted-foreground text-xs line-through">${deal.originalPrice.toFixed(2)}</span>
                  <span className="text-primary font-bold">${deal.price.toFixed(2)}</span>
                </div>
                {deal.reviews > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < Math.floor(deal.rating) ? 'fill-warning text-warning' : 'text-muted'}`}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground">({deal.reviews})</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
