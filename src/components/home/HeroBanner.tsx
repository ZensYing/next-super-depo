import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import Image from "next/image";

const defaultBanners = [
  {
    id: "default-1",
    title: "Multi Vendor",
    subtitle: "eCommerce CMS",
    description: "The Ultimate PHP Script for eCommerce",
    link: "/products",
    thumbnail: null, // Hardcoded style
  },
  {
    id: "default-2",
    title: "Summer Sale",
    subtitle: "2025 Collection",
    description: "Discover the latest trends in fashion",
    link: "/category/fashion",
    thumbnail: null,
  },
];

interface HeroBannerProps {
  banners?: any[];
}

export const HeroBanner = ({ banners: propBanners }: HeroBannerProps) => {
  const banners = (propBanners && propBanners.length > 0) ? propBanners : defaultBanners;
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);

  return (
    <div className="relative overflow-hidden rounded-lg h-full min-h-[320px] bg-gray-100">
      <div className="relative h-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
          >
            {banner.thumbnail ? (
              <LocalizedLink to={banner.link || "#"} className="block w-full h-full relative">
                <img
                  src={banner.thumbnail}
                  alt={banner.title || "Banner"}
                  className="w-full h-full object-cover"
                />
                {/* Optional Text Overlay for Image Banners */}
                {(banner.title || banner.description) && (
                  <div className="absolute inset-0 bg-black/20 flex flex-col justify-center px-10 text-white z-20">
                    {banner.title && <h2 className="text-4xl font-bold mb-2 shadow-sm">{banner.title}</h2>}
                    {banner.description && <p className="text-lg max-w-lg shadow-sm">{banner.description}</p>}
                    {banner.link && (
                      <Button className="mt-4 w-fit bg-primary text-primary-foreground">Shop Now</Button>
                    )}
                  </div>
                )}
              </LocalizedLink>
            ) : (
              // Hardcoded / Default Style Fallback
              <div className="h-full w-full bg-primary flex items-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/4" />
                  <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full translate-y-1/2" />
                </div>

                <div className="relative z-10 px-8 lg:px-12 max-w-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
                      <span className="text-primary font-bold">V</span>
                    </div>
                    <span className="text-white font-bold text-lg">KhGlobal</span>
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                    {banner.title}
                    <br />
                    <span className="text-accent">{banner.subtitle || ""}</span>
                  </h1>
                  <p className="text-white/80 mt-3 mb-6">
                    {banner.description}
                  </p>
                  <LocalizedLink to={banner.link || "/products"}>
                    <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8">
                      Shop Now
                    </Button>
                  </LocalizedLink>
                </div>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
                  <div className="w-64 h-64 bg-white/10 rounded-2xl backdrop-blur-sm" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white rounded-full h-8 w-8"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white rounded-full h-8 w-8"
        onClick={nextSlide}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? "w-6 bg-white" : "w-2 bg-white/50"
              }`}
          />
        ))}
      </div>
    </div>
  );
};
