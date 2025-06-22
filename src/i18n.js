import i18n from 'i18next';
import ICU from 'i18next-icu';
import { initReactI18next } from 'react-i18next';

import en from './locale/en.json';
import hr from './locale/hr.json';

i18n
  .use(ICU)
  .use(initReactI18next)
  .init({
    resources: {
      en : { translation: en },
      hr : { translation: hr },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;