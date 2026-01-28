import { ChevronRight, Shirt, Watch, Home, Baby, Dog, Laptop, Smartphone, Dumbbell, Gem, Scissors } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useTranslation } from "@/hooks/useTranslation";
import { TranslationKey } from "@/i18n/translations";
import { LucideIcon } from "lucide-react";

interface CategoryItem {
  nameKey: TranslationKey;
  icon: LucideIcon;
  color: string;
  slug: string;
}

const categories: CategoryItem[] = [
  { nameKey: "mensFashion", icon: Shirt, color: "text-green-600", slug: "mens-fashion" },
  { nameKey: "womensFashion", icon: Gem, color: "text-red-500", slug: "womens-fashion" },
  { nameKey: "kidsFashion", icon: Baby, color: "text-pink-500", slug: "kids-fashion" },
  { nameKey: "healthBeauty", icon: Scissors, color: "text-orange-500", slug: "health-beauty" },
  { nameKey: "petSupplies", icon: Dog, color: "text-teal-500", slug: "pet-supplies" },
  { nameKey: "homeKitchen", icon: Home, color: "text-purple-500", slug: "home-kitchen" },
  { nameKey: "babyToddler", icon: Baby, color: "text-red-400", slug: "baby-toddler" },
  { nameKey: "sportsOutdoor", icon: Dumbbell, color: "text-cyan-500", slug: "sports-outdoor" },
  { nameKey: "phoneGadgets", icon: Smartphone, color: "text-blue-500", slug: "phone-gadgets" },
];

export const SidebarCategories = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
      {categories.map((category, index) => (
        <LocalizedLink
          key={category.nameKey}
          to={`/category/${category.slug}`}
          className={`flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors group ${index !== categories.length - 1 ? 'border-b border-border/50' : ''
            }`}
        >
          <div className="flex items-center gap-3">
            <category.icon className={`h-5 w-5 ${category.color}`} />
            <span className="text-sm font-medium text-foreground">{t(category.nameKey)}</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </LocalizedLink>
      ))}
    </div>
  );
};
