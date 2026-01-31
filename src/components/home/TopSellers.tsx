import { ChevronRight } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useTranslation } from "@/hooks/useTranslation";

const vendors = [
  {
    id: 1,
    name: "Pets Store",
    banner: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400",
    logo: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100",
    tagline: "Pamper Your Pets Today!",
    reviews: 0,
    products: 13,
    status: "open",
    tagColor: "bg-teal-100",
  },
  {
    id: 2,
    name: "Athletic Venture",
    banner: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400",
    logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100",
    tagline: "Gear Up For Your Game!",
    reviews: 0,
    products: 16,
    status: "closed",
    tagColor: "bg-pink-100",
  },
  {
    id: 3,
    name: "Kids Corner",
    banner: "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=400",
    logo: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=100",
    tagline: "Fun Fashion For Little Ones!",
    reviews: 0,
    products: 11,
    status: "open",
    tagColor: "bg-pink-200",
  },
  {
    id: 4,
    name: "Hanover Electronics",
    banner: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400",
    logo: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=100",
    tagline: "Latest Tech, Best Prices!",
    reviews: 0,
    products: 20,
    status: "open",
    tagColor: "bg-blue-100",
  },
];

export const TopSellers = () => {
  const { t } = useTranslation();

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">{t("topSellers")}</h2>
        <LocalizedLink to="/vendors" className="text-primary hover:underline flex items-center gap-1 text-sm font-medium">
          {t("viewAll")} <ChevronRight className="h-4 w-4" />
        </LocalizedLink>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {vendors.map((vendor) => (
          <LocalizedLink
            key={vendor.id}
            to={`/vendor/${vendor.id}`}
            className="bg-card rounded-lg border overflow-hidden hover:shadow-md transition-all group"
          >
            {/* Banner */}
            <div className="relative h-20 overflow-hidden">
              <img
                src={vendor.banner}
                alt={vendor.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className={`absolute top-2 right-2 ${vendor.tagColor} px-2 py-0.5 rounded text-xs font-medium`}>
                {vendor.tagline}
              </div>
              {vendor.status === 'closed' && (
                <div className="absolute bottom-2 left-2 bg-muted-foreground text-white text-xs px-2 py-1 rounded-full">
                  Closed Now
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 relative">
              {/* Logo */}
              <div className="absolute -top-6 left-4 h-12 w-12 rounded-full border-2 border-card bg-card overflow-hidden shadow-md">
                <img
                  src={vendor.logo}
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="pt-6">
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {vendor.name}
                </h3>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <div className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full">
                    <span className="font-medium">{vendor.reviews}</span>
                    <span className="text-muted-foreground">{t("reviews")}</span>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full">
                    <span className="font-medium">{vendor.products}</span>
                    <span className="text-muted-foreground">Products</span>
                  </div>
                </div>
              </div>
            </div>
          </LocalizedLink>
        ))}
      </div>
    </section>
  );
};
