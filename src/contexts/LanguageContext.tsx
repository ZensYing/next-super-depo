"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { Language, LanguageCode, languages, DEFAULT_LANGUAGE } from "@/lib/constants";

export type { Language, LanguageCode };
export { languages, DEFAULT_LANGUAGE };

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (code: LanguageCode) => void;
  getLocalizedPath: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
  initialLang?: LanguageCode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, initialLang }) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const getLanguageFromParams = (): Language => {
    // If initialLang is provided (e.g. from server layout), use it primarily
    if (initialLang) {
      return languages.find((l) => l.code === initialLang) || languages.find((l) => l.code === DEFAULT_LANGUAGE)!;
    }
    const langCode = params?.lang as LanguageCode;
    return languages.find((l) => l.code === langCode) || languages.find((l) => l.code === DEFAULT_LANGUAGE)!;
  };

  const [currentLanguage, setCurrentLanguage] = useState<Language>(getLanguageFromParams);

  useEffect(() => {
    const newLang = getLanguageFromParams();
    if (newLang && newLang.code !== currentLanguage.code) {
      setCurrentLanguage(newLang);
    }
  }, [params.lang, initialLang]);

  const setLanguage = (code: LanguageCode) => {
    const newLanguage = languages.find((l) => l.code === code);
    if (!newLanguage) return;

    const segments = pathname.split('/').filter(Boolean);
    // Assuming the structure is always /[lang]/...
    if (segments.length > 0 && languages.some(l => l.code === segments[0])) {
      segments[0] = code;
    } else {
      segments.unshift(code);
    }

    const newPath = `/${segments.join('/')}`;

    setCurrentLanguage(newLanguage);
    router.push(newPath);
  };

  const getLocalizedPath = (path: string): string => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const cleanPathNoLang = cleanPath.replace(/^\/(km|en|zh|ko)/, "");

    if (cleanPathNoLang === '/' || cleanPathNoLang === '') {
      return `/${currentLanguage.code}`;
    }
    return `/${currentLanguage.code}${cleanPathNoLang}`;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, getLocalizedPath }}>
      {children}
    </LanguageContext.Provider>
  );
};
