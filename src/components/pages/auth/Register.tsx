"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { LocalizedLink } from "@/components/LocalizedLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Mail, Phone, Lock, Eye, EyeOff, User, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const Register = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { getLocalizedPath } = useLanguage();
    const { login, isAuthenticated, isInitialized } = useAuth();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            router.push(getLocalizedPath("/"));
        }
    }, [isAuthenticated, router, getLocalizedPath]);

    if (!isInitialized || isAuthenticated) return <div className="min-h-screen bg-background" />;

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.post('/auth/register', { email, password, fullName });
            const token = response.data.access_token;

            // Basic decoding
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const decoded = JSON.parse(jsonPayload);
            const user = { id: decoded.sub, email: decoded.email, role: decoded.role, fullName: decoded.fullName };

            login(token, user);

            toast("Account Created", {
                description: "Registration successful. Welcome!",
            });
            router.push(getLocalizedPath('/'));
        } catch (error: any) {
            console.error(error);
            toast("Error", {
                description: error.response?.data?.message || "Registration failed",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl shadow-lg border">
                    <div className="text-center">
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                            {t("signUp")}
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {t("alreadyHaveAccount")} {" "}
                            <LocalizedLink to="/login" className="font-medium text-primary hover:text-primary/90">
                                {t("signIn")}
                            </LocalizedLink>
                        </p>
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <LocalizedLink to="/vendor-register" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors flex items-center justify-center gap-2">
                                <Store className="h-4 w-4" />
                                Become a SuperDepo Vendor
                            </LocalizedLink>
                        </div>
                    </div>

                    <Tabs defaultValue="email" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="phone">{t("phoneNumber")}</TabsTrigger>
                            <TabsTrigger value="email">{t("email")}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="phone">
                            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                <div className="space-y-2">
                                    <Label htmlFor="name-phone">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input id="name-phone" placeholder="John Doe" className="pl-9" />
                                    </div>
                                </div>

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
                                    <Label htmlFor="password-phone">{t("password")}</Label>
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

                                <Button className="w-full" type="submit" disabled>
                                    {t("signUp")} (Phone Not Implemented)
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="email">
                            <form className="space-y-4" onSubmit={handleRegister}>
                                <div className="space-y-2">
                                    <Label htmlFor="name-email">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="name-email"
                                            placeholder="John Doe"
                                            className="pl-9"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">{t("email")}</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            placeholder="name@example.com"
                                            type="email"
                                            className="pl-9"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password-email">{t("password")}</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password-email"
                                            type={showPassword ? "text" : "password"}
                                            className="pl-9 pr-9"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
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

                                <Button className="w-full" type="submit" disabled={isLoading}>
                                    {isLoading ? "Loading..." : t("signUp")}
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
                        Demo Register Page
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Register;
