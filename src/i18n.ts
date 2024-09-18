import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translationsEn from "./translations/en.json";
import translationsHu from "./translations/hu.json";

const resources = {
  en: { translation: translationsEn },
  hu: { translation: translationsHu },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    lng: "hu",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: resources,
  });

export default i18n;

export async function dynamicActivate(locale: string) {
  i18n.changeLanguage(locale);
}
