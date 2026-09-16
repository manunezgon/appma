import { useLanguage } from "../context/LanguageContext";

import en from "../translations/en";
import es from "../translations/es";

const translations = {
  en,
  es,
};

export function useTranslation() {
  const { language } = useLanguage();

  const currentTranslations = translations[language] || translations.en;

  const t = (key) => {
    const keys = key.split(".");
    let value = currentTranslations;

    for (const part of keys) {
      value = value?.[part];
    }

    return value ?? key;
  };

  return {
    t,
    language,
  };
}