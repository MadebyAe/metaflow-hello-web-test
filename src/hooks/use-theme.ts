import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

function getOsTheme(): Theme {
  if (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark'
  }
  return 'light'
}

function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // localStorage unavailable
  }
  return null
}

export function useTheme() {
  const [manualTheme, setManualTheme] = useState<Theme | null>(getStoredTheme)
  const [osTheme, setOsTheme] = useState<Theme>(getOsTheme)

  const theme: Theme = manualTheme ?? osTheme

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Persist manual override, or clear it
  useEffect(() => {
    if (manualTheme !== null) {
      localStorage.setItem(STORAGE_KEY, manualTheme)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [manualTheme])

  // Listen for OS theme changes
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    )
      return

    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      setOsTheme(e.matches ? 'dark' : 'light')
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const toggleTheme = () => {
    setManualTheme((current) => {
      const base = current ?? osTheme
      return base === 'light' ? 'dark' : 'light'
    })
  }

  return { theme, toggleTheme }
}
