"use client";

import { useState } from "react";
import { Heart, Share2, Minus, Plus, Truck, Shield, RotateCcw, BadgeCheck, MessageCircle, ChevronRight, Star, Package, Store } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductDetailProps {
  product: any;
}

const ProductDetail = ({ product }: ProductDetailProps) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const language = currentLanguage.code;

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Get localized name
  const getLocalizedName = () => {
    switch (language) {
      case 'km': return product.productNameKh || product.productNameEn || "Untitled";
      case 'ko': return product.productNameKo || product.productNameEn || "Untitled";
      default: return product.productNameEn || product.productNameKh || "Untitled";
    }
  };

  // Get main price
  const mainPrice = product.productPrices?.[0];
  const price = mainPrice?.price ? parseFloat(mainPrice.price) : 0;
  const currency = mainPrice?.currency?.title || "$";
  const discount = product.discount ? parseFloat(product.discount) : 0;
  const discountedPrice = discount > 0 ? price * (1 - discount / 100) : price;
  const totalPrice = discountedPrice * quantity;

  // All images (main + sub)
  const allImages = [
    product.mainImage,
    ...(product.subImages || [])
  ].filter(Boolean);

  // Format price
  const formatPrice = (amount: number) => {
    return `${currency}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Get related product localized name
  const getRelatedProductName = (p: any) => {
    switch (language) {
      case 'km': return p.productNameKh || p.productNameEn || "Untitled";
      case 'ko': return p.productNameKo || p.productNameEn || "Untitled";
      default: return p.productNameEn || p.productNameKh || "Untitled";
    }
  };

  // Get related product price
  const getRelatedProductPrice = (p: any) => {
    const price = p.productPrices?.[0];
    if (!price) return "Price not set";
    return `${price.currency?.title || "$"}${parseFloat(price.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1">
        <div className="container py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <LocalizedLink to="/" className="hover:text-primary">Home</LocalizedLink>
            <ChevronRight className="h-4 w-4" />
            {product.category && (
              <>
                <LocalizedLink to={`/category/${product.categoryId}`} className="hover:text-primary">
                  {product.category.nameKh || product.category.nameEn}
                </LocalizedLink>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
            <span className="text-foreground">{getLocalizedName()}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-1">
              {/* Product Card */}
              <div className="bg-card rounded-xl border shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Image Gallery */}
                  <div className="md:w-1/2">
                    <div className="relative aspect-square rounded-xl border overflow-hidden bg-white mb-4">
                      {allImages[selectedImage] ? (
                        <img
                          src={allImages[selectedImage]}
                          alt={getLocalizedName()}
                          className="w-full h-full object-contain p-4"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <Package className="h-24 w-24 text-muted-foreground/30" />
                        </div>
                      )}

                      {/* Discount Badge */}
                      {discount > 0 && (
                        <Badge variant="destructive" className="absolute top-4 left-4">
                          -{discount}%
                        </Badge>
                      )}

                      {/* Share button */}
                      <button
                        className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow-md"
                        onClick={() => navigator.share?.({ title: getLocalizedName(), url: window.location.href })}
                      >
                        <Share2 className="h-5 w-5 text-muted-foreground" />
                      </button>
                    </div>

                    {/* Thumbnails */}
                    {allImages.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {allImages.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`w-16 h-16 rounded-lg border-2 overflow-hidden shrink-0 transition-all ${selectedImage === index
                                ? "border-primary ring-2 ring-primary/30"
                                : "border-transparent hover:border-muted-foreground/30"
                              }`}
                          >
                            <img
                              src={image}
                              alt={`${getLocalizedName()} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="md:w-1/2">
                    {/* Category Badge */}
                    {product.category && (
                      <Badge variant="secondary" className="mb-3">
                        {product.category.nameKh || product.category.nameEn}
                      </Badge>
                    )}

                    <h1 className="text-2xl md:text-3xl font-bold mb-3">{getLocalizedName()}</h1>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span>4.5</span>
                      </div>
                      <span className="text-muted-foreground/50">|</span>
                      <span>{product.vendor?._count?.products || 0} {t("products")}</span>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      {discount > 0 ? (
                        <div className="flex items-center gap-3">
                          <span className="text-3xl font-bold text-primary">
                            {formatPrice(discountedPrice)}
                          </span>
                          <span className="text-lg text-muted-foreground line-through">
                            {formatPrice(price)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-3xl font-bold text-primary">
                          {price > 0 ? formatPrice(price) : "Price not set"}
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="mb-6">
                      {product.unlimitedStock ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          In Stock
                        </Badge>
                      ) : product.stockQuantity > 0 ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {product.stockQuantity} in stock
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600 border-red-600">
                          Out of Stock
                        </Badge>
                      )}
                    </div>

                    {/* Quantity Selector */}
                    <div className="mb-6">
                      <span className="text-sm font-medium text-muted-foreground mb-2 block">{t("quantity")}</span>
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-11 w-11 rounded-r-none"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="h-11 w-16 flex items-center justify-center border-y text-center font-medium text-lg">
                          {quantity}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-11 w-11 rounded-l-none"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                      <span className="text-lg">
                        {t("totalPrice")}: <span className="text-primary font-bold text-2xl">{formatPrice(totalPrice)}</span>
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button variant="accent" className="flex-1 h-12 text-base">
                        {t("buyNow")}
                      </Button>
                      <Button className="flex-1 h-12 text-base">
                        {t("addToCart")}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 shrink-0"
                        onClick={() => setIsWishlisted(!isWishlisted)}
                      >
                        <Heart className={`h-5 w-5 ${isWishlisted ? "fill-destructive text-destructive" : ""}`} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs Section */}
              <div className="bg-card rounded-xl border shadow-sm p-6">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="w-auto mx-auto flex justify-center mb-6">
                    <TabsTrigger value="overview" className="px-8">{t("overview")}</TabsTrigger>
                    <TabsTrigger value="reviews" className="px-8">{t("reviews")}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview">
                    <div>
                      <h3 className="font-semibold text-lg mb-4">{t("detailDescription")}</h3>
                      <div className="prose prose-sm max-w-none">
                        {product.description ? (
                          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {product.description}
                          </p>
                        ) : (
                          <p className="text-muted-foreground italic">No description available.</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="reviews">
                    <div className="text-center py-12 text-muted-foreground">
                      <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                      <p>{t("noReviews")}</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-80 shrink-0 space-y-6">
              {/* Delivery Info */}
              <div className="bg-card rounded-xl border shadow-sm p-4 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-muted-foreground">{t("fastDelivery")}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-muted-foreground">{t("safePayment")}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <RotateCcw className="h-5 w-5 text-amber-600" />
                  </div>
                  <span className="text-muted-foreground">{t("returnPolicy")}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <BadgeCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-muted-foreground">{t("authenticProducts")}</span>
                </div>
              </div>

              {/* Vendor Card */}
              {product.vendor && (
                <div className="bg-card rounded-xl border shadow-sm p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-14 w-14 rounded-xl overflow-hidden border bg-muted flex items-center justify-center">
                      {product.vendor.logo ? (
                        <img
                          src={product.vendor.logo}
                          alt={product.vendor.vendorName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Store className="h-6 w-6 text-muted-foreground/50" />
                      )}
                    </div>
                    <div>
                      <span className="font-semibold">{product.vendor.vendorName}</span>
                      <p className="text-xs text-muted-foreground">Seller</p>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-4">
                    <div className="flex-1 text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-primary font-bold text-lg">{product.vendor._count?.products || 0}</div>
                      <div className="text-xs text-muted-foreground">{t("products")}</div>
                    </div>
                    <div className="flex-1 text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-amber-500 font-bold text-lg flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400" />
                        4.5
                      </div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <LocalizedLink to={`/vendor/${product.vendor.id}`}>
                      <Button variant="outline" className="w-full">
                        Visit Store
                      </Button>
                    </LocalizedLink>
                    <Button className="w-full gap-2">
                      <MessageCircle className="h-4 w-4" />
                      {t("chatWithVendor")}
                    </Button>
                  </div>
                </div>
              )}

              {/* More From Store */}
              {product.relatedProducts?.length > 0 && (
                <div className="bg-card rounded-xl border shadow-sm p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{t("moreFromStore")}</h3>
                    <LocalizedLink
                      to={`/vendor/${product.vendor?.id}`}
                      className="text-primary text-sm hover:underline flex items-center gap-1"
                    >
                      {t("viewAll")} <ChevronRight className="h-4 w-4" />
                    </LocalizedLink>
                  </div>

                  <div className="space-y-3">
                    {product.relatedProducts.map((item: any) => (
                      <LocalizedLink
                        key={item.id}
                        to={`/product/${item.id}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-16 h-16 rounded-lg border overflow-hidden bg-white shrink-0">
                          {item.mainImage ? (
                            <img
                              src={item.mainImage}
                              alt={getRelatedProductName(item)}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <Package className="h-6 w-6 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium line-clamp-2">{getRelatedProductName(item)}</h4>
                          <p className="text-primary font-bold mt-1">{getRelatedProductPrice(item)}</p>
                        </div>
                      </LocalizedLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
