import { createContext, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

export type Language = 'en' | 'zh-CN' | 'ms' | 'ta'

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
    i18n.changeLanguage(lang)
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