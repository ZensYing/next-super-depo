import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const promos = [
  {
    id: 1,
    title: "Free Shipping",
    subtitle: "On orders over $50",
    gradient: "from-primary to-blue-400",
    icon: "🚚",
  },
  {
    id: 2,
    title: "24/7 Support",
    subtitle: "Dedicated support",
    gradient: "from-emerald-500 to-teal-400",
    icon: "🎧",
  },
  {
    id: 3,
    title: "Secure Payment",
    subtitle: "100% secure checkout",
    gradient: "from-purple-500 to-pink-500",
    icon: "🔒",
  },
  {
    id: 4,
    title: "Easy Returns",
    subtitle: "30 days return policy",
    gradient: "from-accent to-orange-400",
    icon: "↩️",
  },
];

export const PromoBanners = () => {
  return (
    <section className="py-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {promos.map((promo) => (
          <div
            key={promo.id}
            className={`bg-gradient-to-br ${promo.gradient} rounded-2xl p-6 text-primary-foreground`}
          >
            <span className="text-3xl mb-3 block">{promo.icon}</span>
            <h3 className="font-bold text-lg">{promo.title}</h3>
            <p className="text-sm opacity-90">{promo.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Banner CTA */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative rounded-2xl overflow-hidden h-48 md:h-64 bg-gradient-to-r from-primary to-blue-500">
          <div className="absolute inset-0 flex items-center p-8">
            <div className="text-primary-foreground">
              <span className="text-sm font-medium bg-accent text-accent-foreground px-3 py-1 rounded-full">
                Limited Offer
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mt-3 mb-2">
                New Arrivals
              </h3>
              <p className="opacity-90 mb-4">Discover the latest trends</p>
              <Button variant="secondary" className="gap-2">
                Shop Now <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden h-48 md:h-64 bg-gradient-to-r from-accent to-orange-400">
          <div className="absolute inset-0 flex items-center p-8">
            <div className="text-accent-foreground">
              <span className="text-sm font-medium bg-primary text-primary-foreground px-3 py-1 rounded-full">
                Up to 70% Off
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mt-3 mb-2">
                Clearance Sale
              </h3>
              <p className="opacity-90 mb-4">Don't miss these deals</p>
              <Button variant="secondary" className="gap-2">
                View Deals <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
