"use client";

import { ChevronRight, Tag } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";

interface CategoryGridProps {
  categories: any[];
}

export const CategoryGrid = ({ categories }: CategoryGridProps) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const language = currentLanguage.code;

  // Get localized name
  const getLocalizedName = (category: any) => {
    switch (language) {
      case 'km': return category.nameKh || category.nameEn || "Untitled";
      case 'ko': return category.nameKo || category.nameEn || "Untitled";
      default: return category.nameEn || category.nameKh || "Untitled";
    }
  };

  // Generate color classes
  const colors = [
    "bg-blue-50", "bg-amber-50", "bg-pink-50", "bg-rose-50",
    "bg-teal-50", "bg-purple-50", "bg-green-50", "bg-cyan-50"
  ];

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">{t("categories")}</h2>
        <LocalizedLink to="/categories" className="text-primary hover:underline flex items-center gap-1 text-sm font-medium">
          {t("viewAll")} <ChevronRight className="h-4 w-4" />
        </LocalizedLink>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {categories.slice(0, 8).map((category, index) => (
          <LocalizedLink
            key={category.id}
            to={`/category/${category.id}`}
            className="flex flex-col items-center group"
          >
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${colors[index % colors.length]} overflow-hidden mb-2 group-hover:scale-110 transition-transform duration-300 shadow-sm flex items-center justify-center`}>
              {category.image ? (
                <img
                  src={category.image}
                  alt={getLocalizedName(category)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Tag className="h-8 w-8 text-primary/60" />
              )}
            </div>
            <span className="text-xs sm:text-sm text-center font-medium line-clamp-2">
              {getLocalizedName(category)}
            </span>
          </LocalizedLink>
        ))}
      </div>
    </section>
  );
};
