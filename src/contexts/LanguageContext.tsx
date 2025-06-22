import { createContext, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

export type Language = 'en' | 'zh-Hans' | 'zh-Hant' | 'ms' | 'ta'

interface LanguageContextType {
  language: Language
  changeLanguage: (lang: Language) => void
  t: (key: string, options?: any) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const { t, i18n } = useTranslation()

  // Sync language state with i18next
  const language = (i18n.language || 'en') as Language

  const changeLanguage = (lang: Language) => {
    // 更新 i18n 語言
    i18n.changeLanguage(lang)
    
    // 更新 URL 路徑
    const currentPath = window.location.pathname
    const currentParams = window.location.search
    
    // 移除現有的語言前綴
    const cleanPath = currentPath.replace(/^\/[a-z]{2}(?:-[A-Z][a-z]+)?/, '') || '/'
    
    // 構建新路徑
    const newPath = lang === 'en' ? cleanPath : `/${lang}${cleanPath}`
    
    // 使用 pushState 更新 URL 但不重新加載頁面
    window.history.pushState({}, '', newPath + currentParams)
  }

  // Update document language attribute for accessibility
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 