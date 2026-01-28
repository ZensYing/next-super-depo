"use client";

import React from "react";
import Link, { LinkProps } from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface LocalizedLinkProps extends Omit<LinkProps, "href"> {
    to: string;
    children: React.ReactNode;
    className?: string;
}

export const LocalizedLink: React.FC<LocalizedLinkProps> = ({ to, children, className, ...props }) => {
    const { getLocalizedPath } = useLanguage();

    return (
        <Link href={getLocalizedPath(to)} className={cn(className)} {...props}>
            {children}
        </Link>
    );
};
