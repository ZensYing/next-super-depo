export type LanguageCode = "km" | "en" | "ko";

export interface Language {
    code: LanguageCode;
    name: string;
    nativeName: string;
    flag: string;
}

export const languages: Language[] = [
    { code: "km", name: "Khmer", nativeName: "ភាសាខ្មែរ", flag: "🇰🇭" },
    { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
    { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
];

export const DEFAULT_LANGUAGE: LanguageCode = "km";

