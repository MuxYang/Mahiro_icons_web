import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { ThemeMode } from '../types'

interface ThemeContextValue {
    theme: ThemeMode
    resolvedTheme: 'light' | 'dark'
    setTheme: (theme: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'mahiro-icons-theme'

function getSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getSavedTheme(): ThemeMode {
    if (typeof window === 'undefined') return 'auto'
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark' || saved === 'auto') return saved
    return 'auto'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<ThemeMode>(getSavedTheme)
    const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(getSystemTheme)

    const resolvedTheme = theme === 'auto' ? systemTheme : theme

    const setTheme = useCallback((newTheme: ThemeMode) => {
        setThemeState(newTheme)
        localStorage.setItem(STORAGE_KEY, newTheme)
    }, [])

    // Listen for system theme changes
    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        const handler = (e: MediaQueryListEvent) => {
            setSystemTheme(e.matches ? 'dark' : 'light')
        }
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [])

    // Apply theme to HTML element
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', resolvedTheme)
    }, [resolvedTheme])

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme(): ThemeContextValue {
    const ctx = useContext(ThemeContext)
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
    return ctx
}
