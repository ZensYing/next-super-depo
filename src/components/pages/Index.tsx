import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroBanner } from "@/components/home/HeroBanner";
import { SidebarCategories } from "@/components/home/SidebarCategories";
import { FlashDeal } from "@/components/home/FlashDeal";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedDeal } from "@/components/home/FeaturedDeal";
import { TopSellers } from "@/components/home/TopSellers";
import { PromoBanner } from "@/components/home/PromoBanner";
import { LatestProducts } from "@/components/home/LatestProducts";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1">
        <div className="container py-6">
          {/* Hero Section with Sidebar */}
          <div className="flex gap-6 mb-6">
            <div className="hidden lg:block w-64 shrink-0">
              <SidebarCategories />
            </div>
            <div className="flex-1">
              <HeroBanner />
            </div>
          </div>

          {/* Flash Deal */}
          <FlashDeal />
          {/* Promo Banner */}
          <PromoBanner />

          {/* Featured Products */}
          <FeaturedProducts />

          {/* Categories */}
          <CategoryGrid />

          {/* Featured Deal */}
          <FeaturedDeal />



          {/* Top Sellers */}
          <TopSellers />

          {/* Latest Products with Deal of the Day */}
          <LatestProducts />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
