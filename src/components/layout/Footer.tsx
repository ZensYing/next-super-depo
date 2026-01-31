import { ShoppingCart, Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useTranslation } from "@/hooks/useTranslation";

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-header text-header-foreground mt-12">
      {/* Newsletter */}
      <div className="border-b border-header-foreground/10">
        <div className="container py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-1">{t("subscribeNewsletter")}</h3>
              <p className="text-header-foreground/70 text-sm">{t("newsletterDesc")}</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Input
                type="email"
                placeholder={t("enterEmail")}
                className="h-10 w-full md:w-72 bg-header-foreground/10 border-header-foreground/20 text-header-foreground placeholder:text-header-foreground/50"
              />
              <Button variant="accent" className="h-10 px-6">
                {t("subscribe")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <LocalizedLink to="/" className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold font-logo"><span className="text-logo-red">Kh</span><span className="text-logo-green">Global</span></span>
            </LocalizedLink>
            <p className="text-header-foreground/70 text-sm mb-4">
              {t("footerDescription")}
            </p>
            <div className="flex gap-2">
              <a href="#" className="h-8 w-8 rounded-full bg-header-foreground/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-header-foreground/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-header-foreground/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-header-foreground/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t("quickLinks")}</h4>
            <ul className="space-y-2 text-sm">
              <li><LocalizedLink to="/about" className="text-header-foreground/70 hover:text-accent transition-colors">{t("aboutUs")}</LocalizedLink></li>
              <li><LocalizedLink to="/contact" className="text-header-foreground/70 hover:text-accent transition-colors">{t("contactUs")}</LocalizedLink></li>
              <li><LocalizedLink to="/faq" className="text-header-foreground/70 hover:text-accent transition-colors">{t("faq")}</LocalizedLink></li>
              <li><LocalizedLink to="/terms" className="text-header-foreground/70 hover:text-accent transition-colors">{t("termsConditions")}</LocalizedLink></li>
              <li><LocalizedLink to="/privacy" className="text-header-foreground/70 hover:text-accent transition-colors">{t("privacyPolicy")}</LocalizedLink></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold mb-4">{t("myAccount")}</h4>
            <ul className="space-y-2 text-sm">
              <li><LocalizedLink to="/profile" className="text-header-foreground/70 hover:text-accent transition-colors">{t("myProfile")}</LocalizedLink></li>
              <li><LocalizedLink to="/orders" className="text-header-foreground/70 hover:text-accent transition-colors">{t("orderHistory")}</LocalizedLink></li>
              <li><LocalizedLink to="/wishlist" className="text-header-foreground/70 hover:text-accent transition-colors">{t("wishlist")}</LocalizedLink></li>
              <li><LocalizedLink to="/track" className="text-header-foreground/70 hover:text-accent transition-colors">{t("trackOrder")}</LocalizedLink></li>
              <li><LocalizedLink to="/returns" className="text-header-foreground/70 hover:text-accent transition-colors">{t("returns")}</LocalizedLink></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{t("contactInfo")}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span className="text-header-foreground/70">123 Commerce Street, Business City, BC 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-accent" />
                <span className="text-header-foreground/70">+1 234 567 8900</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-accent" />
                <span className="text-header-foreground/70">support@6valley.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-header-foreground/10">
        <div className="container py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-header-foreground/70 text-sm">
            © 2025 <span className="font-logo"><span className="text-logo-red">Kh</span><span className="text-logo-green">Global</span></span>. {t("allRightsReserved")}.
          </p>
          <div className="flex items-center gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6 opacity-70 hover:opacity-100 transition-opacity" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-70 hover:opacity-100 transition-opacity" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6 opacity-70 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </footer>
  );
};
