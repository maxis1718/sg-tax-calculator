import { useState, useEffect } from 'react'
import { Languages, DollarSign, Receipt, Wallet, Percent, PiggyBank, ChevronDown, ChevronUp } from 'lucide-react'
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './components/ui/accordion'
import { useTheme } from './contexts/ThemeContext'
import { useLanguage, type Language } from './contexts/LanguageContext'
import { useURLParam } from './contexts/URLParamContext'
import { getComprehensiveSummary } from './lib/taxCalculator'
import { Toggle } from './components/ui/toggle'

function App() {
  const [income, setIncome] = useState<string>('')
  const [residentStatus, setResidentStatus] = useState<'citizen' | 'foreigner'>('citizen')
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
  const summary = getComprehensiveSummary(annualIncome, residentStatus === 'citizen')

  // 處理輸入變化並同步到 URL
  const handleIncomeChange = (value: string) => {
    setIncome(value)
    const numericValue = parseFloat(value) || null
    setUrlIncome(numericValue)
  }

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: t('english', { ns: 'languages' }) },
    { code: 'ms', name: t('malay', { ns: 'languages' }) },
    { code: 'ta', name: t('tamil', { ns: 'languages' }) },
    { code: 'zh-Hant', name: t('traditionalChinese', { ns: 'languages' }) },
    { code: 'zh-Hans', name: t('chinese', { ns: 'languages' }) },
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
      <main className="container mx-auto px-2 flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm">
          <Card className="shadow-lg transition-all duration-162 ease-out will-change-[height]">
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

              {/* Resident Status */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('residentStatus')}</Label>
                <div className="flex space-x-2">
                  <Toggle
                    pressed={residentStatus === 'citizen'}
                    onPressedChange={() => setResidentStatus('citizen')}
                    className={`flex-1 border border-solid transition-all ${
                      residentStatus === 'citizen' 
                        ? 'border-border bg-accent text-accent-foreground opacity-100 scale-100' 
                        : 'border-border bg-background opacity-70 scale-95'
                    }`}
                  >
                    {t('singaporeCitizenPR')}
                  </Toggle>
                  <Toggle
                    pressed={residentStatus === 'foreigner'}
                    onPressedChange={() => setResidentStatus('foreigner')}
                    className={`flex-1 border border-solid transition-all ${
                      residentStatus === 'foreigner' 
                        ? 'border-border bg-accent text-accent-foreground opacity-100 scale-100' 
                        : 'border-border bg-background opacity-70 scale-95'
                    }`}
                  >
                    {t('foreigner')}
                  </Toggle>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-4 pt-4 border-t border-border transition-all duration-100 ease-in-out overflow-hidden">
                
                {/* Tax Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <Receipt className="h-4 w-4 text-foreground" />
                      <span className="text-sm font-medium">{t('estimatedIncomeTax')}</span>
                    </div>
                    <span className="text-base font-semibold text-rose-700 dark:text-rose-400">
                      ${summary.tax.netTax.toLocaleString('en-SG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <Percent className="h-4 w-4 text-foreground" />
                      <span className="text-sm font-medium">{t('avgTaxRate')}</span>
                    </div>
                    <span className="text-base font-semibold">
                      {summary.tax.averageTaxRate.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* CPF Section */}
                <div className={`grid transition-all duration-162 ease-out overflow-hidden ${
                  residentStatus === 'citizen' 
                    ? 'grid-rows-[1fr] opacity-100' 
                    : 'grid-rows-[0fr] opacity-0'
                }`}>
                  <div className="min-h-0 pt-3 border-t border-border/50">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="cpf" className="border-none group">
                        <AccordionTrigger className="py-2 hover:no-underline [&>svg]:hidden focus-visible:outline-none">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-2">
                              <PiggyBank className="h-4 w-4 text-teal-700 dark:text-teal-400" />
                              <span className="text-sm font-medium text-teal-700 dark:text-teal-400">
                                {t('cpfContributions')}
                              </span>
                              <ChevronDown className="h-4 w-4 shrink-0 text-teal-700 dark:text-teal-400 transition-transform duration-251 ease-out group-data-[state=open]:rotate-180" />
                            </div>
                            <span className="text-base font-semibold text-teal-800 dark:text-teal-400">
                              ${summary.cpf.totalCPFContribution.toLocaleString('en-SG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2 pt-2 will-change-[height] transition-all duration-162 ease-out">
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
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
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
