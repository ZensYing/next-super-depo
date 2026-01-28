"use client";

import { LocalizedLink } from "@/components/LocalizedLink";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className"> {
  to: string;
  activeClassName?: string;
  pendingClassName?: string;
  className?: string | ((props: { isActive: boolean; isPending: boolean }) => string);
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    const pathname = usePathname();
    const { getLocalizedPath } = useLanguage();
    const localizedPath = getLocalizedPath(to);

    // active check logic: exact match or starts with (for nested routes)
    const isActive = pathname === localizedPath || (localizedPath !== "/" && pathname?.startsWith(localizedPath));

    let computedClassName: string;
    if (typeof className === "function") {
      computedClassName = className({ isActive, isPending: false });
    } else {
      computedClassName = cn(className, isActive && activeClassName);
    }

    return (
      <LocalizedLink
        to={to}
        // @ts-ignore
        ref={ref}
        className={computedClassName}
        {...props}
      >
        {props.children}
      </LocalizedLink>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
