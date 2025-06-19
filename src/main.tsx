import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './lib/i18n'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { URLParamProvider } from './contexts/URLParamContext'
import { SEOHead } from './components/SEOHead'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <URLParamProvider>
      <LanguageProvider>
        <SEOHead />
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </LanguageProvider>
    </URLParamProvider>
  </StrictMode>,
)
