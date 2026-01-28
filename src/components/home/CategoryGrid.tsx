import { ChevronRight } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useTranslation } from "@/hooks/useTranslation";
import { TranslationKey } from "@/i18n/translations";

interface Category {
  nameKey: TranslationKey;
  image: string;
  color: string;
  slug: string;
}

const categories: Category[] = [
  { nameKey: "mensFashion", image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=200", color: "bg-blue-50", slug: "mens-fashion" },
  { nameKey: "womensFashion", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200", color: "bg-amber-50", slug: "womens-fashion" },
  { nameKey: "kidsFashion", image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=200", color: "bg-pink-50", slug: "kids-fashion" },
  { nameKey: "healthBeauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200", color: "bg-rose-50", slug: "health-beauty" },
  { nameKey: "petSupplies", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200", color: "bg-teal-50", slug: "pet-supplies" },
  { nameKey: "homeKitchen", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200", color: "bg-purple-50", slug: "home-kitchen" },
  { nameKey: "babyToddler", image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200", color: "bg-pink-50", slug: "baby-toddler" },
  { nameKey: "sportsOutdoor", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200", color: "bg-green-50", slug: "sports-outdoor" },
];

export const CategoryGrid = () => {
  const { t } = useTranslation();

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">{t("categories")}</h2>
        <LocalizedLink to="/categories" className="text-primary hover:underline flex items-center gap-1 text-sm font-medium">
          {t("viewAll")} <ChevronRight className="h-4 w-4" />
        </LocalizedLink>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {categories.map((category) => (
          <LocalizedLink
            key={category.nameKey}
            to={`/category/${category.slug}`}
            className="flex flex-col items-center group"
          >
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${category.color} overflow-hidden mb-2 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
              <img
                src={category.image}
                alt={t(category.nameKey)}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs sm:text-sm text-center font-medium line-clamp-2">
              {t(category.nameKey)}
            </span>
          </LocalizedLink>
        ))}
      </div>
    </section>
  );
};
