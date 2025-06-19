import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

interface URLParamContextType {
  income: number | null
  setIncome: (income: number | null) => void
  updateURL: (income: number | null) => void
}

const URLParamContext = createContext<URLParamContextType | undefined>(undefined)

export function URLParamProvider({ children }: { children: ReactNode }) {
  const [income, setIncomeState] = useState<number | null>(null)

  // 初始化時從 URL 讀取參數
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const incomeParam = params.get('income')
    if (incomeParam) {
      const incomeValue = parseFloat(incomeParam)
      if (incomeValue > 0) {
        setIncomeState(incomeValue)
      }
    }
  }, [])

  // 更新 URL 的函數
  const updateURL = (newIncome: number | null) => {
    const url = new URL(window.location.href)
    if (newIncome && newIncome > 0) {
      url.searchParams.set('income', newIncome.toString())
    } else {
      url.searchParams.delete('income')
    }
    
    // 使用 replaceState 避免產生歷史記錄
    window.history.replaceState({}, '', url.toString())
  }

  // 設置收入並更新 URL
  const setIncome = (newIncome: number | null) => {
    setIncomeState(newIncome)
    updateURL(newIncome)
  }

  return (
    <URLParamContext.Provider value={{ income, setIncome, updateURL }}>
      {children}
    </URLParamContext.Provider>
  )
}

export function useURLParam() {
  const context = useContext(URLParamContext)
  if (context === undefined) {
    throw new Error('useURLParam must be used within a URLParamProvider')
  }
  return context
} 