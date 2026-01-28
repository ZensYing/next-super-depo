import { Award, Truck, Users, DollarSign, Store } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const features = [
  { icon: Award, labelKey: "bestPlatform" as const },
  { icon: Store, labelKey: "bestDepo" as const },
  { icon: DollarSign, labelKey: "bestPrice" as const },
  { icon: Users, labelKey: "bestTeam" as const },
  { icon: Truck, labelKey: "bestDelivery" as const },
];

export const PromoBanner = () => {
  const { t } = useTranslation();

  return (
    <section className="py-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-logo-red via-red-700 to-logo-red shadow-xl">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/4 translate-y-1/4" />
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white rounded-full" />
        </div>

        {/* Animated shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" style={{ animationDuration: '3s' }} />

        {/* Content */}
        <div className="relative px-6 py-8 md:py-10">
          {/* Title */}
          <div className="text-center mb-6">
            {/* <h2 className="text-2xl md:text-3xl font-bold text-white font-logo tracking-wide">
              <span className="text-logo-green">Super</span>
              <span className="text-white">Depo</span>
              <span className="ml-2 text-yellow-300">✨</span>
            </h2> */}
            <p className="text-white/80 text-sm md:text-base mt-2 max-w-2xl mx-auto">
              {t("promoTagline")}
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-default"
              >
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  <feature.icon className="h-4 w-4 text-yellow-300" />
                </div>
                <span className="text-white font-medium text-sm md:text-base whitespace-nowrap">
                  {t(feature.labelKey)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
