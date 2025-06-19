import { useLanguage } from '../contexts/LanguageContext'
import { useURLParam } from '../contexts/URLParamContext'

export function SEOHead() {
  const { language, t } = useLanguage()
  const { income } = useURLParam()
  
  // 根據是否有收入參數來調整 SEO 內容
  const getOptimizedContent = () => {
    const baseTitle = t('title')
    const baseDescription = t('seoDescription') || 'Calculate your Singapore income tax and CPF contributions instantly. Free, accurate, and supports multiple languages.'
    
    if (income && income > 0) {
      const formattedIncome = income.toLocaleString('en-SG')
      return {
        title: `${baseTitle} - $${formattedIncome} ${t('seoTitleSuffix') || 'Tax Calculator'}`,
        description: `Calculate tax for $${formattedIncome} annual income in Singapore. ${baseDescription}`
      }
    }
    
    return {
      title: baseTitle,
      description: baseDescription
    }
  }

  const { title, description } = getOptimizedContent()
  
  // 語言代碼映射
  const langMap: Record<string, string> = {
    'en': 'en-SG',
    'zh-CN': 'zh-CN',
    'ms': 'ms-MY',
    'ta': 'ta-SG'
  }

  const currentLang = langMap[language] || 'en-SG'
  const canonical = `${typeof window !== 'undefined' ? window.location.origin : 'https://sg-tax-calculator.com'}${language !== 'en' ? `/${language}` : ''}${income ? `?income=${income}` : ''}`

  return (
    <>
      {/* React 19 原生支持！直接渲染到 head */}
      <title>{title}</title>
      
      {/* 基本 SEO */}
      <meta name="description" content={description} />
      <meta name="keywords" content="Singapore tax calculator, income tax, CPF calculator, tax computation, 新加坡稅務計算器, cukai pendapatan Singapura, சிங்கப்பூர் வரி கணிப்பாளர்" />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="SG Tax Calculator" />
      <meta property="og:locale" content={currentLang} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {/* 技術 meta */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="SG Tax Calculator" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
      
      {/* 多語言 alternate links */}
      <link rel="alternate" hrefLang="en" href="https://sg-tax-calculator.com" />
      <link rel="alternate" hrefLang="zh-CN" href="https://sg-tax-calculator.com/zh-CN" />
      <link rel="alternate" hrefLang="ms" href="https://sg-tax-calculator.com/ms" />
      <link rel="alternate" hrefLang="ta" href="https://sg-tax-calculator.com/ta" />
      <link rel="alternate" hrefLang="x-default" href="https://sg-tax-calculator.com" />
    </>
  )
} 