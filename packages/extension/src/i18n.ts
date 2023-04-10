import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from "i18next-http-backend";
import { initReactI18next } from 'react-i18next';

i18n
  .use(Backend) // Load translations from server or external files
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    ns: ['common'], // Namespaces
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
  });

export default i18n;