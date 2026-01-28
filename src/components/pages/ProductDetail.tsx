import { useState } from "react";
import { useParams } from "next/navigation";
import { Heart, Share2, Minus, Plus, Truck, Shield, RotateCcw, BadgeCheck, MessageCircle, ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useTranslation } from "@/hooks/useTranslation";

// Mock product data
const product = {
  id: 1,
  name: "iPhone 14 Pro Max",
  price: 1149.00,
  orders: 36,
  wishListed: 0,
  colors: [
    { name: "Deep Purple", value: "#5E35B1", selected: true },
    { name: "Space Black", value: "#1C1C1E", selected: false },
  ],
  images: [
    "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600",
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600",
  ],
  description: `The iPhone 14 Pro Max takes smartphone technology to the next level with its powerful A16 Bionic chip, ProMotion display, and all-new 48MP camera system. Featuring an immersive 6.7-inch Super Retina XDR display with Dynamic Island, the iPhone 14 Pro Max delivers stunning visuals, ultra-fast performance, and next-level photography, all wrapped in sleek, durable glass and stainless steel.`,
  vendor: {
    id: 1,
    name: "Bicycle Shop",
    logo: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=100",
    reviews: 0,
    products: 14,
  },
  relatedProducts: [
    { id: 2, name: "Edelbrock Cylinder Head", price: 900.00, image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200" },
    { id: 3, name: "Combo Trailer Light Set", price: 35.00, image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=200" },
  ],
};

const ProductDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const totalPrice = product.price * quantity;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-1">
              {/* Product Card */}
              <div className="bg-card rounded-lg border p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Image Gallery */}
                  <div className="md:w-1/2">
                    <div className="relative aspect-square rounded-lg border overflow-hidden bg-white mb-4">
                      <img
                        src={product.images[selectedImage]}
                        alt={product.name}
                        className="w-full h-full object-contain p-4"
                      />
                      {/* Action buttons */}
                      <button className="absolute top-4 right-4 h-8 w-8 rounded-full bg-muted/80 flex items-center justify-center hover:bg-muted transition-colors">
                        <Share2 className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                    {/* Thumbnails */}
                    <div className="flex gap-2">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`w-14 h-14 rounded-lg border-2 overflow-hidden ${selectedImage === index ? "border-primary" : "border-transparent"
                            }`}
                        >
                          <img
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="md:w-1/2">
                    <h1 className="text-2xl font-bold mb-3">{product.name}</h1>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="text-primary">{product.orders} {t("orders")}</span>
                      <span className="text-muted-foreground/50">|</span>
                      <span>{product.wishListed} {t("wishListed")}</span>
                    </div>

                    <p className="text-3xl font-bold text-primary mb-6">
                      ${product.price.toFixed(2)}
                    </p>

                    {/* Color Selector */}
                    <div className="mb-6">
                      <span className="text-sm font-medium text-muted-foreground mb-2 block">{t("color")}</span>
                      <div className="flex gap-2">
                        {product.colors.map((color, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedColor(index)}
                            className={`h-8 w-8 rounded-full border-2 ${selectedColor === index ? "border-primary ring-2 ring-primary/30" : "border-muted"
                              }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="mb-6">
                      <span className="text-sm font-medium text-muted-foreground mb-2 block">{t("quantity")}</span>
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-r-none"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="h-10 w-14 flex items-center justify-center border-y text-center font-medium">
                          {quantity}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-l-none"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="mb-6">
                      <span className="text-lg">
                        {t("totalPrice")}: <span className="text-primary font-bold text-xl">${totalPrice.toFixed(2)}</span>
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button variant="accent" className="px-8">
                        {t("buyNow")}
                      </Button>
                      <Button className="px-8">
                        {t("addToCart")}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                        onClick={() => setIsWishlisted(!isWishlisted)}
                      >
                        <Heart className={`h-5 w-5 ${isWishlisted ? "fill-destructive text-destructive" : ""}`} />
                        <span className="ml-1 text-sm">{isWishlisted ? 1 : 0}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs Section */}
              <div className="bg-card rounded-lg border p-6">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="w-auto mx-auto flex justify-center mb-6">
                    <TabsTrigger value="overview" className="px-8">{t("overview")}</TabsTrigger>
                    <TabsTrigger value="reviews" className="px-8">{t("reviews")}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview">
                    <div>
                      <h3 className="font-semibold mb-4">{t("detailDescription")}</h3>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-muted-foreground leading-relaxed">
                          <strong>{t("productDescription")}:</strong>
                          <br /><br />
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="reviews">
                    <div className="text-center py-12 text-muted-foreground">
                      <p>{t("noReviews")}</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-80 shrink-0 space-y-6">
              {/* Delivery Info */}
              <div className="bg-card rounded-lg border p-4 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">{t("fastDelivery")}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">{t("safePayment")}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <RotateCcw className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">{t("returnPolicy")}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <BadgeCheck className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">{t("authenticProducts")}</span>
                </div>
              </div>

              {/* Vendor Card */}
              <div className="bg-card rounded-lg border p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden border">
                    <img
                      src={product.vendor.logo}
                      alt={product.vendor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-semibold">{product.vendor.name}</span>
                </div>

                <div className="flex gap-4 mb-4">
                  <div className="flex-1 text-center">
                    <div className="text-primary font-semibold">{product.vendor.reviews}</div>
                    <div className="text-xs text-muted-foreground">{t("reviews")}</div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-accent font-semibold">{product.vendor.products}</div>
                    <div className="text-xs text-muted-foreground">{t("products")}</div>
                  </div>
                </div>

                <Button className="w-full gap-2">
                  <MessageCircle className="h-4 w-4" />
                  {t("chatWithVendor")}
                </Button>
              </div>

              {/* More From Store */}
              <div className="bg-card rounded-lg border p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{t("moreFromStore")}</h3>
                  <LocalizedLink to={`/vendor/${product.vendor.id}`} className="text-primary text-sm hover:underline flex items-center gap-1">
                    {t("viewAll")} <ChevronRight className="h-4 w-4" />
                  </LocalizedLink>
                </div>

                <div className="space-y-3">
                  {product.relatedProducts.map((item) => (
                    <LocalizedLink
                      key={item.id}
                      to={`/product/${item.id}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-16 h-16 rounded-lg border overflow-hidden bg-white shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium line-clamp-2">{item.name}</h4>
                        <p className="text-primary font-bold mt-1">${item.price.toFixed(2)}</p>
                      </div>
                    </LocalizedLink>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
