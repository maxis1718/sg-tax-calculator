import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translations
import enCommon from '../locales/en/common.json'
import zhHansCommon from '../locales/zh-Hans/common.json'
import zhHantCommon from '../locales/zh-Hant/common.json'
import msCommon from '../locales/ms/common.json'
import taCommon from '../locales/ta/common.json'

// Import shared resources
import sharedLanguages from '../locales/shared/languages.json'

const resources = {
  en: {
    common: enCommon,
    languages: sharedLanguages,
  },
  'zh-Hans': {
    common: zhHansCommon,
    languages: sharedLanguages,
  },
  'zh-Hant': {
    common: zhHantCommon,
    languages: sharedLanguages,
  },
  ms: {
    common: msCommon,
    languages: sharedLanguages,
  },
  ta: {
    common: taCommon,
    languages: sharedLanguages,
  },
}

// 從 URL 路徑檢測語言
const getLanguageFromPath = (): string | undefined => {
  if (typeof window === 'undefined') return undefined
  const path = window.location.pathname
  const langMatch = path.match(/^\/([a-z]{2}(?:-[A-Z][a-z]+)?)/)
  return langMatch ? langMatch[1] : undefined
}

// 創建語言檢測器實例
const languageDetector = new LanguageDetector()

// 自定義語言檢測器
const pathLanguageDetector = {
  name: 'path',
  lookup() {
    return getLanguageFromPath()
  },
  cacheUserLanguage() {
    // 不緩存路徑語言，因為它應該總是從 URL 讀取
  }
}

// 添加自定義檢測器
languageDetector.addDetector(pathLanguageDetector)

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    
    // Language detection settings - 先檢查路徑，再檢查 localStorage 和瀏覽器
    detection: {
      order: ['path', 'localStorage', 'navigator'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    // Remove in production
    debug: import.meta.env.DEV,
  })

export default i18n 