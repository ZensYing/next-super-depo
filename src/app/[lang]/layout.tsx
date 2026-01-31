import type { Metadata } from "next";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { languages } from "@/lib/constants";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import QueryProvider from "@/components/QueryProvider";

export async function generateStaticParams() {
    return languages.map((lang) => ({
        lang: lang.code,
    }));
}

export const metadata: Metadata = {
    title: {
        template: '%s | KhGlobal',
        default: 'KhGlobal - Premier Multi-Vendor Marketplace',
    },
    description: "Discover top-quality products at KhGlobal. The premier multi-vendor marketplace connecting trusted sellers with buyers worldwide.",
    keywords: ["KhGlobal", "multi-vendor", "marketplace", "ecommerce", "vendors", "online shopping", "buy and sell"],
    authors: [{ name: "KhGlobal Team" }],
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        title: 'KhGlobal - Premier Multi-Vendor Marketplace',
        description: 'Your trusted multi-vendor platform for global trading.',
        url: 'https://khglobal.com', // Replace with actual domain if known, else usage generic or environment variable
        siteName: 'KhGlobal',
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'KhGlobal - Global Marketplace',
        description: 'Connecting buyers and sellers worldwide.',
    },
};

import { AuthProvider } from "@/contexts/AuthContext";

import { NextAuthConfigProvider } from "@/providers/NextAuthConfigProvider";

export default async function LanguageLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}>) {
    const resolvedParams = await params;
    return (
        <QueryProvider>
            <NextAuthConfigProvider>
                <LanguageProvider initialLang={resolvedParams.lang as any}>
                    <AuthProvider>
                        <TooltipProvider>
                            {children}
                            <Toaster />
                            <Sonner />
                        </TooltipProvider>
                    </AuthProvider>
                </LanguageProvider>
            </NextAuthConfigProvider>
        </QueryProvider>
    );
}
