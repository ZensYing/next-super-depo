import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useTranslation } from "@/hooks/useTranslation";

const brands = [
  { id: 1, name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg", products: 45 },
  { id: 2, name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg", products: 67 },
  { id: 3, name: "Nike", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg", products: 89 },
  { id: 4, name: "Adidas", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg", products: 72 },
  { id: 5, name: "Sony", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg", products: 34 },
  { id: 6, name: "LG", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/LG_symbol.svg", products: 28 },
  { id: 7, name: "Puma", logo: "https://upload.wikimedia.org/wikipedia/en/d/da/Puma_complete_logo.svg", products: 56 },
  { id: 8, name: "Reebok", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Reebok_2019_logo.svg", products: 41 },
];

const Brands = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-8">
          <div className="container">
            <h1 className="text-3xl font-bold text-primary mb-2">{t("allBrands")}</h1>
            <p className="text-muted-foreground">
              {t("exploreBrands")}
            </p>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {brands.map((brand) => (
              <LocalizedLink
                key={brand.id}
                to={`/brand/${brand.id}`}
                className="group bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="h-20 w-20 mb-4 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {brand.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {brand.products} {t("products")}
                </p>
              </LocalizedLink>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Brands;
