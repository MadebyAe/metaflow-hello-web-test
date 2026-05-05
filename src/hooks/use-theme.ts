import { useState, useEffect, useRef } from 'react'

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

function readStoredTheme(): Theme | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : null
}

export function useTheme() {
  // Initialise theme from localStorage if present, otherwise from OS preference.
  // The lazy-initialiser function runs only once.
  const [theme, setTheme] = useState<Theme>(
    () => readStoredTheme() ?? getOsTheme(),
  )

  // Track whether the user has ever made a manual choice (persisted to storage).
  // Initialised from storage presence so it survives page reloads.
  const hasManualOverride = useRef<boolean>(readStoredTheme() !== null)

  // Keep data-theme attribute in sync with state.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Mirror OS preference changes in real time — but only when the user has
  // not made a manual override.
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) {
      return
    }

    const mql = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      if (!hasManualOverride.current) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }

    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  // Manual toggle: persist choice to localStorage and mark override.
  const toggleTheme = () => {
    setTheme((current) => {
      const next: Theme = current === 'light' ? 'dark' : 'light'
      hasManualOverride.current = true
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }

  return { theme, toggleTheme }
}
