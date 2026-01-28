import { useLanguage } from "@/contexts/LanguageContext";
import { translations, TranslationKey, getTranslation } from "@/i18n/translations";

export const useTranslation = () => {
    const { currentLanguage } = useLanguage();

    const t = (key: TranslationKey): string => {
        return getTranslation(currentLanguage.code, key);
    };

    return { t, currentLanguage };
};
