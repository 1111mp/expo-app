import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@/locales/en.json';
import zh_CN from '@/locales/zh_CN.json';

const lng = getLocales().at(0)?.languageCode ?? 'en';

i18n.use(initReactI18next).init({
  lng,
  fallbackLng: 'en',
  supportedLngs: ['en', 'zh'],
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
  resources: {
    en: {
      translation: en,
    },
    zh: {
      translation: zh_CN,
    },
  },
});

export default i18n;
