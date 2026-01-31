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
    title: "Valley Joy",
    description: "Valley Joy Web App",
};

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
            <LanguageProvider initialLang={resolvedParams.lang as any}>
                <TooltipProvider>
                    {children}
                    <Toaster />
                    <Sonner />
                </TooltipProvider>
            </LanguageProvider>
        </QueryProvider>
    );
}
