import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const banners = [
  {
    id: 1,
    title: "Multi Vendor",
    subtitle: "eCommerce CMS",
    description: "The Ultimate PHP Script for eCommerce",
    cta: "Buy Now!",
  },
  {
    id: 2,
    title: "Summer Sale",
    subtitle: "2025 Collection",
    description: "Discover the latest trends in fashion",
    cta: "Shop Now",
  },
  {
    id: 3,
    title: "Electronics",
    subtitle: "Best Deals",
    description: "Latest smartphones at unbeatable prices",
    cta: "Explore",
  },
];

export const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);

  return (
    <div className="relative overflow-hidden rounded-lg h-full min-h-[320px]">
      <div className="relative h-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
            }`}
          >
            <div className="h-full w-full bg-primary flex items-center relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full translate-y-1/2" />
              </div>
              
              <div className="relative z-10 px-8 lg:px-12 max-w-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" fill="currentColor">
                      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                  </div>
                  <span className="text-white font-bold text-lg">6Valley</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {banner.title}
                  <br />
                  <span className="text-accent">{banner.subtitle}</span>
                </h1>
                <p className="text-white/80 mt-3 mb-6">
                  {banner.description}
                </p>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8">
                  {banner.cta}
                </Button>
              </div>

              {/* Decorative product images placeholder */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
                <div className="w-64 h-64 bg-white/10 rounded-2xl backdrop-blur-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full h-8 w-8"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full h-8 w-8"
        onClick={nextSlide}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
