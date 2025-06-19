import { useState } from 'react'
import { Languages, DollarSign } from 'lucide-react'
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

function App() {
  const [income, setIncome] = useState<string>('')
  const [language, setLanguage] = useState<string>('English')

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
    <div className="min-h-screen bg-slate-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-white/95 border-b border-slate-200">
        <div className="container mx-auto px-4 h-14 flex items-center justify-end">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 text-slate-900 border-slate-300 hover:bg-slate-50 hover:text-slate-900">
                <Languages className="h-4 w-4" />
                <span className="hidden sm:inline">{language}</span>
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
      <main className="container mx-auto px-6 py-4 min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <div className="w-full max-w-sm">
          <Card className="shadow-lg border-slate-200 bg-white">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-xl font-bold text-slate-800">
                Income Tax Calculator
              </CardTitle>
              <p className="text-slate-600 text-sm mt-2">
                Estimate your income tax and take-home pay
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Annual Income Input */}
              <div className="space-y-2">
                <Label htmlFor="income" className="text-sm font-medium text-slate-700">
                  Annual Income
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="income"
                    type="number"
                    placeholder="e.g. 80000"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="pl-10 bg-white border-slate-300 focus:border-slate-400 focus:ring-slate-200"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-3">Results</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-slate-700">Estimated Income Tax</span>
                    </div>
                    <span className="font-bold text-red-600">
                      ${estimatedTax.toLocaleString('en-SG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-slate-700">After-Tax Income</span>
                    </div>
                    <span className="font-bold text-green-600">
                      ${afterTaxIncome.toLocaleString('en-SG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-slate-700">Avg Tax Rate (%)</span>
                    </div>
                    <span className="font-bold text-blue-600">
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
