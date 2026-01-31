"use client";

import { ChevronRight, Folder, Tag } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";

interface SidebarCategoriesProps {
  categories: any[];
}

export const SidebarCategories = ({ categories }: SidebarCategoriesProps) => {
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

  if (!categories || categories.length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-sm border overflow-hidden p-4 text-center text-muted-foreground">
        <Folder className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
        <p className="text-sm">No categories yet</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
      {categories.map((category, index) => (
        <LocalizedLink
          key={category.id}
          to={`/category/${category.id}`}
          className={`flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors group ${index !== categories.length - 1 ? 'border-b border-border/50' : ''
            }`}
        >
          <div className="flex items-center gap-3">
            {category.image ? (
              <img src={category.image} alt={getLocalizedName(category)} className="h-6 w-6 rounded object-cover" />
            ) : (
              <Tag className="h-5 w-5 text-primary" />
            )}
            <span className="text-sm font-medium text-foreground">{getLocalizedName(category)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{category._count?.products || 0}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </LocalizedLink>
      ))}
    </div>
  );
};
