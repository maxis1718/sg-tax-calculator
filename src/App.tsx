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

function App() {
  const [income, setIncome] = useState<string>('')
  const [language, setLanguage] = useState<string>('English')
  const { toggleTheme, getThemeIcon } = useTheme()

  // 簡單的稅務計算 (暫時的示例邏輯)
  const calculateTax = (income: number) => {
    if (income <= 20000) return 0
    if (income <= 30000) return (income - 20000) * 0.02
    if (income <= 40000) return 200 + (income - 30000) * 0.035
    if (income <= 80000) return 550 + (income - 40000) * 0.07
    if (income <= 120000) return 3350 + (income - 80000) * 0.115
    if (income <= 160000) return 7950 + (income - 120000) * 0.15
    if (income <= 200000) return 13950 + (income - 160000) * 0.18
    if (income <= 240000) return 21150 + (income - 200000) * 0.19
    if (income <= 280000) return 28750 + (income - 240000) * 0.195
    if (income <= 320000) return 36550 + (income - 280000) * 0.2
    return 44550 + (income - 320000) * 0.22
  }

  const annualIncome = parseFloat(income) || 0
  const estimatedTax = calculateTax(annualIncome)
  const afterTaxIncome = annualIncome - estimatedTax
  const avgTaxRate = annualIncome > 0 ? (estimatedTax / annualIncome) * 100 : 0

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: '简体中文' },
    { code: 'ms', name: 'Bahasa Melayu' },
    { code: 'ta', name: 'தமிழ்' },
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
                  onClick={() => setLanguage(lang.name)}
                  className="cursor-pointer"
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
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-xl font-bold">
                Income Tax Calculator
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-2">
                Estimate your income tax and take-home pay
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Annual Income Input */}
              <div className="space-y-2">
                <Label htmlFor="income" className="text-sm font-medium">
                  Annual Income
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="income"
                    type="number"
                    placeholder="e.g. 80000"
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
                      <span className="text-sm font-medium">Estimated Income Tax</span>
                    </div>
                    <span className="text-destructive">
                      ${estimatedTax.toLocaleString('en-SG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <Wallet className="h-4 w-4 text-foreground" />
                      <span className="text-sm font-medium">After-Tax Income</span>
                    </div>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      ${afterTaxIncome.toLocaleString('en-SG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <Percent className="h-4 w-4 text-foreground" />
                      <span className="text-sm font-medium">Avg Tax Rate (%)</span>
                    </div>
                    <span className="font-medium">
                      {avgTaxRate.toFixed(1)}%
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
