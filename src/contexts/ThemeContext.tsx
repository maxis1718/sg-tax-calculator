import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Sun, Moon, SunMoon } from 'lucide-react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  getThemeIcon: () => React.JSX.Element
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('system')

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  const toggleTheme = () => {
    // logic: system (default) -> light -> dark
    const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const getThemeIcon = () => {
    if (theme === 'light') return <Moon className="h-4 w-4" />
    if (theme === 'dark') return <SunMoon className="h-4 w-4" />
    return <Sun className="h-4 w-4" />
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, getThemeIcon }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 