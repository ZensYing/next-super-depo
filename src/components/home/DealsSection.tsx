import { useState, useEffect } from "react";
import { Clock, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const deals = [
  {
    id: 1,
    name: "Wireless Noise Cancelling Headphones",
    price: 89.99,
    originalPrice: 179.99,
    discount: 50,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    sold: 67,
    total: 100,
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
  },
  {
    id: 2,
    name: "Smart Watch Pro Max",
    price: 199.99,
    originalPrice: 349.99,
    discount: 43,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400",
    sold: 45,
    total: 80,
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
  },
  {
    id: 3,
    name: "Premium Leather Jacket",
    price: 149.99,
    originalPrice: 299.99,
    discount: 50,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
    sold: 23,
    total: 50,
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
  },
  {
    id: 4,
    name: "Mechanical Gaming Keyboard",
    price: 79.99,
    originalPrice: 149.99,
    discount: 47,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400",
    sold: 89,
    total: 100,
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
  },
];

const CountdownTimer = ({ endTime }: { endTime: Date }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endTime.getTime() - Date.now();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="flex items-center gap-1 text-xs font-mono">
      <Clock className="h-3 w-3" />
      <span className="bg-destructive text-destructive-foreground px-1 rounded">
        {String(timeLeft.days).padStart(2, "0")}d
      </span>
      <span>:</span>
      <span className="bg-destructive text-destructive-foreground px-1 rounded">
        {String(timeLeft.hours).padStart(2, "0")}h
      </span>
      <span>:</span>
      <span className="bg-destructive text-destructive-foreground px-1 rounded">
        {String(timeLeft.minutes).padStart(2, "0")}m
      </span>
      <span>:</span>
      <span className="bg-destructive text-destructive-foreground px-1 rounded">
        {String(timeLeft.seconds).padStart(2, "0")}s
      </span>
    </div>
  );
};

export const DealsSection = () => {
  return (
    <section className="py-12">
      <div className="bg-gradient-to-r from-destructive/10 to-accent/10 rounded-3xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">🔥 Flash Deals</h2>
            <p className="text-muted-foreground mt-1">Limited time offers - Don't miss out!</p>
          </div>
          <Button variant="accent">View All Deals</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-card rounded-2xl shadow-card overflow-hidden group"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={deal.image}
                  alt={deal.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold">
                  -{deal.discount}%
                </div>
                <Button
                  size="icon-sm"
                  variant="secondary"
                  className="absolute top-3 right-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
                  {deal.name}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold text-destructive">${deal.price}</span>
                  <span className="text-sm text-muted-foreground line-through">
                    ${deal.originalPrice}
                  </span>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Sold: {deal.sold}</span>
                    <span>Available: {deal.total - deal.sold}</span>
                  </div>
                  <Progress value={(deal.sold / deal.total) * 100} className="h-2" />
                </div>

                {/* Timer */}
                <div className="flex items-center justify-between">
                  <CountdownTimer endTime={deal.endTime} />
                  <Button size="icon-sm" variant="accent" className="rounded-full">
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
