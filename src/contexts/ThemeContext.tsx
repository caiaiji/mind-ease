import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const NIGHT_BG_KEY = 'mindease-night-color'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = 'mindease-theme'

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  return theme === 'system' ? getSystemTheme() : theme
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light'
    return (localStorage.getItem(STORAGE_KEY) as Theme) || 'light'
  })
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => resolveTheme(theme))

  const applyTheme = (resolved: 'light' | 'dark') => {
    const root = document.documentElement
    if (resolved === 'dark') {
      root.classList.add('dark')
      // Apply custom night background or default gradient
      const customBg = localStorage.getItem(NIGHT_BG_KEY)
      if (customBg) {
        if (customBg.includes('gradient')) {
          document.body.style.backgroundImage = customBg
          document.body.style.backgroundColor = ''
        } else {
          document.body.style.backgroundImage = ''
          document.body.style.backgroundColor = customBg
        }
      } else {
        document.body.style.backgroundImage = 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)'
        document.body.style.backgroundColor = ''
      }
    } else {
      root.classList.remove('dark')
      document.body.style.backgroundImage = ''
      document.body.style.backgroundColor = ''
    }
    // Update meta theme-color for mobile browsers
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', resolved === 'dark' ? '#1a1632' : '#8B5CF6')
    }
  }

  useEffect(() => {
    const resolved = resolveTheme(theme)
    setResolvedTheme(resolved)
    applyTheme(resolved)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  // Listen for system theme changes when theme is 'system'
  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const resolved = getSystemTheme()
      setResolvedTheme(resolved)
      applyTheme(resolved)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    // Add transition class for smooth theme switch
    const root = document.documentElement
    root.classList.add('transitioning')
    setTimeout(() => root.classList.remove('transitioning'), 350)
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}

// Helper for inline styles in components that can't use Tailwind dark:
// import { dark } from '../contexts/ThemeContext'
// then use dark('#1f2937', '#f3f4f6') for text colors etc.
export function dark(light: string, darkVal: string, _resolved?: 'light' | 'dark'): string {
  // This is a utility for use in inline styles; actual resolvedTheme should come from useTheme()
  // For simplicity, we check the DOM directly
  if (typeof document === 'undefined') return light
  const isDark = document.documentElement.classList.contains('dark')
  return isDark ? darkVal : light
}
