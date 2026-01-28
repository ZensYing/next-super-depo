import { LocalizedLink as Link } from "@/components/LocalizedLink";
import { Star, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const vendors = [
  {
    id: 1,
    name: "6Valley CMS",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100",
    rating: 4.8,
    reviews: 4,
    products: 194,
    tagline: "Multi Vendor ECommerce CMS",
  },
  {
    id: 2,
    name: "Bicycle Shop",
    banner: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
    logo: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=100",
    rating: 4.2,
    reviews: 8,
    products: 14,
    tagline: "Ride Into Adventure",
  },
  {
    id: 3,
    name: "Book Store",
    banner: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600",
    logo: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100",
    rating: 4.5,
    reviews: 2,
    products: 19,
    tagline: "Discover Your Next Great Read",
  },
  {
    id: 4,
    name: "Golden Jewellery",
    banner: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600",
    logo: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=100",
    rating: 3.0,
    reviews: 1,
    products: 17,
    tagline: "Beauty Of Exquisite Craftmanship",
  },
  {
    id: 5,
    name: "FootFinds",
    banner: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600",
    logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100",
    rating: 5.0,
    reviews: 1,
    products: 13,
    tagline: "Step Into Style Today!",
  },
  {
    id: 6,
    name: "Phone Store",
    banner: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
    logo: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=100",
    rating: 4.0,
    reviews: 3,
    products: 13,
    tagline: "Looking For The Newest Smartphones?",
  },
];

export const VendorSection = () => {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Top Stores</h2>
          <p className="text-muted-foreground mt-1">Shop from our trusted vendors</p>
        </div>
        <Link to="/vendors">
          <Button variant="outline">View All Stores</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <Link
            key={vendor.id}
            to={`/vendor/${vendor.id}`}
            className="group bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
          >
            {/* Banner */}
            <div className="relative h-32 overflow-hidden">
              <img
                src={vendor.banner}
                alt={vendor.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-3 left-4 text-sm text-white font-medium">
                {vendor.tagline}
              </p>
            </div>

            {/* Content */}
            <div className="p-4 pt-0 relative">
              {/* Logo */}
              <div className="absolute -top-8 left-4 h-16 w-16 rounded-xl border-4 border-card bg-card overflow-hidden shadow-md">
                <img
                  src={vendor.logo}
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="pt-10">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {vendor.name}
                </h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="font-medium text-foreground">{vendor.rating}</span>
                    <span>({vendor.reviews} Reviews)</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 text-primary font-medium">
                  <Package className="h-4 w-4" />
                  <span>{vendor.products} Products</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
