import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslationJson from '../../public/locales/en/common.json';

const DEFAULT_LANGUAGE = 'en';
const DEFAULT_NAMESPACE = 'common';

i18n.use(initReactI18next).init({
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  ns: [DEFAULT_NAMESPACE],
  defaultNS: DEFAULT_NAMESPACE,
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  resources: { [DEFAULT_LANGUAGE]: { [DEFAULT_NAMESPACE]:
      enTranslationJson } },
});

export default i18n;
