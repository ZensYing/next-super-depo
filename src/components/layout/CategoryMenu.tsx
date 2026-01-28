"use client";

import { ChevronDown, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/hooks/useTranslation";
import { TranslationKey } from "@/i18n/translations";

const categoryKeys: TranslationKey[] = [
  "mensFashion",
  "womensFashion",
  "kidsFashion",
  "healthBeauty",
  "petSupplies",
  "homeKitchen",
  "babyToddler",
  "sportsOutdoor",
  "phoneGadgets",
  "electronicsGadgets",
];

export const CategoryMenu = () => {
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-white text-foreground hover:bg-white/90 gap-2 rounded-none h-11 px-5">
          <Grid3X3 className="h-5 w-5" />
          {t("products")}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2" align="start">
        {categoryKeys.map((categoryKey) => (
          <DropdownMenuItem
            key={categoryKey}
            className="py-2.5 px-3 cursor-pointer rounded-md"
          >
            {t(categoryKey)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
