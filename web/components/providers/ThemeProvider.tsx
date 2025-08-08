/**
 * Theme Provider Component
 * Provides theme context for dark/light mode switching
 */

'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

// =============================================================================
// Theme Types
// =============================================================================

export type Theme = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  theme: Theme
  actualTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

interface ThemeProviderProps {
  children: ReactNode
  attribute?: string
  defaultTheme?: Theme
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

// =============================================================================
// Theme Context
// =============================================================================

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

// =============================================================================
// Theme Provider Component
// =============================================================================

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  attribute = 'class',
  defaultTheme = 'system',
  enableSystem = true,
  disableTransitionOnChange = false
}) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light')

  // Get system theme preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // Apply theme to document
  const applyTheme = (newTheme: 'light' | 'dark') => {
    if (typeof document === 'undefined') return

    const root = document.documentElement

    // Disable transitions temporarily if requested
    if (disableTransitionOnChange) {
      const css = document.createElement('style')
      css.type = 'text/css'
      css.appendChild(
        document.createTextNode(
          '* { transition: none !important; animation-duration: 0.01ms !important; }'
        )
      )
      document.head.appendChild(css)

      requestAnimationFrame(() => {
        document.head.removeChild(css)
      })
    }

    // Apply theme
    if (attribute === 'class') {
      root.classList.remove('light', 'dark')
      root.classList.add(newTheme)
    } else if (attribute === 'data-theme') {
      root.setAttribute('data-theme', newTheme)
    }

    setActualTheme(newTheme)
  }

  // Set theme and persist to localStorage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme)
    }

    // Calculate actual theme
    const resolvedTheme = newTheme === 'system' ? getSystemTheme() : newTheme
    applyTheme(resolvedTheme)
  }

  // Toggle between light and dark (skip system)
  const toggleTheme = () => {
    if (theme === 'system') {
      // If currently system, toggle to opposite of system preference
      const systemTheme = getSystemTheme()
      setTheme(systemTheme === 'light' ? 'dark' : 'light')
    } else {
      // Toggle between light and dark
      setTheme(theme === 'light' ? 'dark' : 'light')
    }
  }

  // Initialize theme from localStorage or default
  useEffect(() => {
    if (typeof window === 'undefined') return

    const savedTheme = localStorage.getItem('theme') as Theme | null
    const initialTheme = savedTheme || defaultTheme

    setThemeState(initialTheme)

    // Calculate and apply initial theme
    const resolvedTheme = initialTheme === 'system' ? getSystemTheme() : initialTheme
    applyTheme(resolvedTheme)
  }, [defaultTheme])

  // Listen for system theme changes
  useEffect(() => {
    if (!enableSystem || theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      const systemTheme = getSystemTheme()
      applyTheme(systemTheme)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, enableSystem])

  const value: ThemeContextValue = {
    theme,
    actualTheme,
    setTheme,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// =============================================================================
// Theme Hook
// =============================================================================

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext)
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  
  return context
}

// =============================================================================
// Theme Toggle Component
// =============================================================================

export interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
  size = 'md'
}) => {
  const { actualTheme, toggleTheme } = useTheme()

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  }

  return (
    <button
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${sizeClasses[size]} ${className}`}
      aria-label={`Switch to ${actualTheme === 'light' ? 'dark' : 'light'} theme`}
    >
      {actualTheme === 'light' ? (
        <MoonIcon className="h-4 w-4" />
      ) : (
        <SunIcon className="h-4 w-4" />
      )}
      {showLabel && (
        <span className="ml-2 text-sm">
          {actualTheme === 'light' ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  )
}

// =============================================================================
// Simple Icons
// =============================================================================

const SunIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
)

const MoonIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
)

export default ThemeProvider