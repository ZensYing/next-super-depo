"use client";

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

interface IndexProps {
  data: {
    featuredProducts: any[];
    latestProducts: any[];
    dealOfTheDay: any;
    categories: any[];
    flashDeals: any[];
    topSellers: any[];
    banners: any[];
  };
}

const Index = ({ data }: IndexProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1">
        <div className="container py-6">
          {/* Hero Section with Sidebar */}
          <div className="flex gap-6 mb-6">
            <div className="hidden lg:block w-64 shrink-0">
              <SidebarCategories categories={data.categories} />
            </div>
            <div className="flex-1">
              <HeroBanner banners={data.banners} />
            </div>
          </div>
          {/* Latest Products with Deal of the Day */}
          <LatestProducts products={data.latestProducts} dealOfTheDay={data.dealOfTheDay} />
          {/* Flash Deal */}
          <FlashDeal products={data.flashDeals} />

          {/* Promo Banner */}
          {/* <PromoBanner /> */}

          {/* Featured Products */}
          {/* <FeaturedProducts products={data.featuredProducts} /> */}

          {/* Categories */}
          <CategoryGrid categories={data.categories} />

          {/* Featured Deal */}
          <FeaturedDeal deal={data.dealOfTheDay} />

          {/* Top Sellers */}
          <TopSellers vendors={data.topSellers} />


        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
