import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translations
import enCommon from '../locales/en/common.json'
import zhCNCommon from '../locales/zh-CN/common.json'
import msCommon from '../locales/ms/common.json'
import taCommon from '../locales/ta/common.json'

const resources = {
  en: {
    common: enCommon,
  },
  'zh-CN': {
    common: zhCNCommon,
  },
  ms: {
    common: msCommon,
  },
  ta: {
    common: taCommon,
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    
    // Language detection settings
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    // Remove in production
    debug: import.meta.env.DEV,
  })

export default i18n 