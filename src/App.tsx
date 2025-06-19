import { useState, useEffect } from 'react'
import { Languages, DollarSign, Receipt, Wallet, Percent, PiggyBank, Building2, Plus } from 'lucide-react'
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
import { useURLParam } from './contexts/URLParamContext'
import { getComprehensiveSummary } from './lib/taxCalculator'

function App() {
  const [income, setIncome] = useState<string>('')
  const { toggleTheme, getThemeIcon } = useTheme()
  const { language, changeLanguage, t } = useLanguage()
  const { income: urlIncome, setIncome: setUrlIncome } = useURLParam()

  // 初始化時從 URL 參數設置輸入框值
  useEffect(() => {
    if (urlIncome) {
      setIncome(urlIncome.toString())
    }
  }, [urlIncome])

  const annualIncome = parseFloat(income) || 0
  const summary = getComprehensiveSummary(annualIncome)

  // 處理輸入變化並同步到 URL
  const handleIncomeChange = (value: string) => {
    setIncome(value)
    const numericValue = parseFloat(value) || null
    setUrlIncome(numericValue)
  }

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
                    onChange={(e) => handleIncomeChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="space-y-4 pt-4 border-t border-border">
                
                {/* Tax Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <Receipt className="h-4 w-4 text-foreground" />
                      <span className="text-sm font-medium">{t('estimatedIncomeTax')}</span>
                    </div>
                    <span className="font-semibold text-rose-700 dark:text-rose-400">
                      ${summary.tax.netTax.toLocaleString('en-SG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <Percent className="h-4 w-4 text-foreground" />
                      <span className="text-sm font-medium">{t('avgTaxRate')}</span>
                    </div>
                    <span className="font-semibold">
                      {summary.tax.averageTaxRate.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* CPF Section */}
                <div className="space-y-2 pt-3 border-t border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <PiggyBank className="h-4 w-4 text-teal-700 dark:text-teal-400" />
                    <span className="text-sm font-medium text-teal-700 dark:text-teal-400">
                      {t('cpfContributions')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 pl-6">
                    <span className="text-sm text-muted-foreground">{t('employeeCPF')}</span>
                    <span className="font-medium text-slate-600 dark:text-slate-400">
                      ${summary.cpf.employeeContribution.toLocaleString('en-SG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 pl-6">
                    <span className="text-sm text-muted-foreground">{t('employerCPF')}</span>
                    <span className="font-medium text-slate-600 dark:text-slate-400">
                      ${summary.cpf.employerContribution.toLocaleString('en-SG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 pl-6 border-t border-border/30">
                    <div className="flex items-center space-x-2">
                      <Plus className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-medium">{t('totalCPF')}</span>
                    </div>
                    <span className="font-semibold text-teal-800 dark:text-teal-400">
                      ${summary.cpf.totalCPFContribution.toLocaleString('en-SG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>

                {/* Final Take-Home */}
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <Wallet className="h-4 w-4 text-foreground" />
                      <span className="text-sm font-medium">{t('finalTakeHome')}</span>
                    </div>
                    <span className="font-semibold text-cyan-700 dark:text-cyan-400 text-lg">
                      ${summary.finalTakeHome.toLocaleString('en-SG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
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
