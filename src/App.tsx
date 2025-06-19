import { useState } from 'react'
import { Languages, DollarSign, Receipt, Wallet, Percent } from 'lucide-react'
import { Button } from './components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { useTheme } from './contexts/ThemeContext'
import { useLanguage, type Language } from './contexts/LanguageContext'
import { getTaxSummary } from './lib/taxCalculator'

function App() {
  const [income, setIncome] = useState<string>('')
  const { toggleTheme, getThemeIcon } = useTheme()
  const { language, changeLanguage, t } = useLanguage()

  const annualIncome = parseFloat(income) || 0
  const taxSummary = getTaxSummary(annualIncome)

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: t('languages.english') },
    { code: 'zh-CN', name: t('languages.chinese') },
    { code: 'ms', name: t('languages.malay') },
    { code: 'ta', name: t('languages.tamil') },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-background/95 border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-end gap-2">
          {/* Theme Toggle */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleTheme}
            className="gap-2"
          >
            {getThemeIcon()}
          </Button>

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Languages className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`cursor-pointer ${
                    language === lang.code ? 'bg-accent' : ''
                  }`}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-2 py-4 flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm">
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-semibold">
                {t('title')}
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-2">
                {t('subtitle')}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Annual Income Input */}
              <div className="space-y-2">
                <Label htmlFor="income" className="text-sm font-medium">
                  {t('annualIncome')}
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="income"
                    type="number"
                    placeholder={t('annualIncomePlaceholder')}
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="space-y-4 pt-4 border-t border-border">
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <Receipt className="h-4 w-4 text-foreground" />
                      <span className="text-sm font-medium">{t('estimatedIncomeTax')}</span>
                    </div>
                    <span className="font-semibold text-rose-700 dark:text-rose-400">
                      ${taxSummary.netTax.toLocaleString('en-SG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <Wallet className="h-4 w-4 text-foreground" />
                      <span className="text-sm font-medium">{t('afterTaxIncome')}</span>
                    </div>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      ${taxSummary.afterTaxIncome.toLocaleString('en-SG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <Percent className="h-4 w-4 text-foreground" />
                      <span className="text-sm font-medium">{t('avgTaxRate')}</span>
                    </div>
                    <span className="font-semibold">
                      {taxSummary.averageTaxRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default App
