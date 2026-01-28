import { useState, useEffect } from "react";
import { Clock, Heart, ShoppingCart, Star, Filter } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";

const discountedProducts = [
  {
    id: 1,
    name: "Wireless Noise Cancelling Headphones Pro",
    price: 89.99,
    originalPrice: 179.99,
    discount: 50,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    rating: 4.8,
    reviews: 245,
    sold: 67,
    total: 100,
    vendor: "Tech Store",
  },
  {
    id: 2,
    name: "Smart Watch Pro Max with Health Monitoring",
    price: 199.99,
    originalPrice: 349.99,
    discount: 43,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400",
    rating: 4.7,
    reviews: 189,
    sold: 45,
    total: 80,
    vendor: "Phone Store",
  },
  {
    id: 3,
    name: "Premium Leather Jacket - Limited Edition",
    price: 149.99,
    originalPrice: 299.99,
    discount: 50,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
    rating: 4.9,
    reviews: 98,
    sold: 23,
    total: 50,
    vendor: "Fashion Hub",
  },
  {
    id: 4,
    name: "Mechanical Gaming Keyboard RGB",
    price: 79.99,
    originalPrice: 149.99,
    discount: 47,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400",
    rating: 4.6,
    reviews: 312,
    sold: 89,
    total: 100,
    vendor: "Tech Store",
  },
  {
    id: 5,
    name: "Ultralight Running Shoes",
    price: 69.99,
    originalPrice: 129.99,
    discount: 46,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    rating: 4.5,
    reviews: 156,
    sold: 78,
    total: 120,
    vendor: "FootFinds",
  },
  {
    id: 6,
    name: "Vintage Polaroid Camera",
    price: 89.99,
    originalPrice: 159.99,
    discount: 44,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400",
    rating: 4.4,
    reviews: 67,
    sold: 34,
    total: 60,
    vendor: "Electronics Hub",
  },
  {
    id: 7,
    name: "Organic Skincare Collection Set",
    price: 49.99,
    originalPrice: 89.99,
    discount: 44,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
    rating: 4.8,
    reviews: 234,
    sold: 156,
    total: 200,
    vendor: "Beauty Corner",
  },
  {
    id: 8,
    name: "Bluetooth Portable Speaker Waterproof",
    price: 39.99,
    originalPrice: 69.99,
    discount: 43,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
    rating: 4.3,
    reviews: 178,
    sold: 92,
    total: 150,
    vendor: "Tech Store",
  },
];

const Deals = () => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
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
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-destructive/20 to-accent/20 py-8">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2">{t("discountedProducts")}</h1>
                <p className="text-muted-foreground">
                  {t("grabDeals")}
                </p>
              </div>
              <div className="flex items-center gap-3 bg-card rounded-xl p-4 shadow-md">
                <Clock className="h-6 w-6 text-destructive" />
                <span className="font-medium">{t("endsIn")}:</span>
                <div className="flex gap-2 font-mono font-bold">
                  <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-lg">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span>:</span>
                  <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-lg">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span>:</span>
                  <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-lg">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          {/* Filters */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              {t("showingProducts")} <span className="font-medium text-foreground">{discountedProducts.length}</span> {t("products")}
            </p>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              {t("filter")}
            </Button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {discountedProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <Badge variant="destructive" className="absolute top-3 left-3 text-sm font-bold">
                    -{product.discount}%
                  </Badge>
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon-sm" variant="secondary" className="rounded-full shadow-md">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <Button className="w-full gap-2" size="sm">
                      <ShoppingCart className="h-4 w-4" />
                      {t("addToCart")}
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">{product.vendor}</p>
                  <h3 className="font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">({product.reviews})</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-destructive">${product.price}</span>
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{t("sold")}: {product.sold}</span>
                      <span>{t("available")}: {product.total - product.sold}</span>
                    </div>
                    <Progress value={(product.sold / product.total) * 100} className="h-1.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Deals;
