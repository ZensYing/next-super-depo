
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { LocalizedLink } from "@/components/LocalizedLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";

const Login = () => {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl shadow-lg border">
                    <div className="text-center">
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                            {t("signIn")}
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {t("dontHaveAccount")} {" "}
                            <LocalizedLink to="/register" className="font-medium text-primary hover:text-primary/90">
                                {t("signUp")}
                            </LocalizedLink>
                        </p>
                    </div>

                    <Tabs defaultValue="phone" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="phone">{t("phoneNumber")}</TabsTrigger>
                            <TabsTrigger value="email">{t("email")}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="phone">
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">{t("phoneNumber")}</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            placeholder="012 345 678"
                                            type="tel"
                                            className="pl-9"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password-phone">{t("password")}</Label>
                                        <LocalizedLink to="/forgot-password" className="text-xs text-primary hover:underline">
                                            {t("forgotPassword")}
                                        </LocalizedLink>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password-phone"
                                            type={showPassword ? "text" : "password"}
                                            className="pl-9 pr-9"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <Button className="w-full" type="submit">
                                    {t("signIn")}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="email">
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="space-y-2">
                                    <Label htmlFor="email">{t("email")}</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            placeholder="name@example.com"
                                            type="email"
                                            className="pl-9"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password-email">{t("password")}</Label>
                                        <LocalizedLink to="/forgot-password" className="text-xs text-primary hover:underline">
                                            {t("forgotPassword")}
                                        </LocalizedLink>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password-email"
                                            type={showPassword ? "text" : "password"}
                                            className="pl-9 pr-9"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <Button className="w-full" type="submit">
                                    {t("signIn")}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                {t("or")}
                            </span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full" type="button">
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg>
                        {t("continueWithGoogle")}
                    </Button>

                    <div className="text-center text-xs text-muted-foreground mt-4">
                        Demo Login Page
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Login;
