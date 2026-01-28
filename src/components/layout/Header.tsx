"use client";

import { useState } from "react";
import { Search, Heart, ShoppingCart, User, Menu, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CategoryMenu } from "./CategoryMenu";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { languages, LanguageCode } from "@/lib/constants";
import { useTranslation } from "@/hooks/useTranslation";

export const Header = () => {
  const [cartCount] = useState(0);
  const [wishlistCount] = useState(0);
  const { currentLanguage, setLanguage } = useLanguage();
  const { t } = useTranslation();

  const handleLanguageChange = (code: LanguageCode) => {
    setLanguage(code);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Bar */}
      <div className="bg-white border-b">
        <div className="container flex h-9 items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-3.5 w-3.5" />
            <span>{t("phone")}</span>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm">
                {t("currency")} <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>USD $</DropdownMenuItem>
                <DropdownMenuItem>EUR €</DropdownMenuItem>
                <DropdownMenuItem>GBP £</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm">
                {currentLanguage.flag} {currentLanguage.nativeName} <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={currentLanguage.code === lang.code ? "bg-muted" : ""}
                  >
                    {lang.flag} {lang.nativeName}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                {t("vendorZone")} <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>{t("becomeVendor")}</DropdownMenuItem>
                <DropdownMenuItem>{t("vendorLogin")}</DropdownMenuItem>
                <DropdownMenuItem>{t("sellerGuidelines")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b">
        <div className="container flex h-16 items-center gap-6">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="p-4 border-b">
                <LocalizedLink to="/" className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold font-logo"><span className="text-logo-red">Super</span><span className="text-logo-green">Depo</span></span>
                </LocalizedLink>
              </div>
              <nav className="p-4 space-y-2">
                <LocalizedLink to="/" className="block py-2 px-4 rounded-lg hover:bg-muted transition-colors">{t("home")}</LocalizedLink>
                <LocalizedLink to="/brands" className="block py-2 px-4 rounded-lg hover:bg-muted transition-colors">{t("brand")}</LocalizedLink>
                <LocalizedLink to="/vendors" className="block py-2 px-4 rounded-lg hover:bg-muted transition-colors">{t("allVendors")}</LocalizedLink>
                <LocalizedLink to="/deals" className="block py-2 px-4 rounded-lg hover:bg-muted transition-colors">{t("offers")}</LocalizedLink>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <LocalizedLink to="/" className="flex items-center gap-2 shrink-0">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-logo hidden sm:block"><span className="text-logo-red">Super</span><span className="text-logo-green">Depo</span></span>
          </LocalizedLink>

          {/* Search */}
          <div className="flex-1 max-w-2xl mx-auto">
            <div className="relative">
              <Input
                type="search"
                placeholder={t("searchPlaceholder")}
                className="h-10 pl-4 pr-12 rounded-md border-muted"
              />
              <Button
                size="icon"
                className="absolute right-0 top-0 h-10 w-10 rounded-l-none"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-medium">
                  {wishlistCount}
                </span>
              )}
            </Button>
            <LocalizedLink to="/login">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </LocalizedLink>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </Button>
              <div className="hidden sm:flex flex-col text-sm">
                <span className="text-muted-foreground text-xs">{t("myCart")}</span>
                <span className="font-semibold">$0.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-primary hidden lg:block">
        <div className="container flex items-center gap-1 h-11">
          <CategoryMenu />

          <LocalizedLink to="/deals">
            <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 h-11 px-4">
              {t("deal")}
            </Button>
          </LocalizedLink>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 h-11 px-4">
                {t("type")} <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <LocalizedLink to="/retail" className="w-full cursor-pointer block px-2 py-1.5 rounded-sm hover:bg-muted outline-none">
                  {t("retail")}
                </LocalizedLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <LocalizedLink to="/wholesale" className="w-full cursor-pointer block px-2 py-1.5 rounded-sm hover:bg-muted outline-none">
                  {t("wholesale")}
                </LocalizedLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <LocalizedLink to="/vendors">
            <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 h-11 px-4">
              {t("allVendors")}
            </Button>
          </LocalizedLink>

        </div>
      </nav>
    </header>
  );
};
