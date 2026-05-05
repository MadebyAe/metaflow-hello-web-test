import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from '../hooks/use-theme'

// Helper to build a controllable MediaQueryList mock
function makeMql(matches: boolean) {
  const listeners: Array<(e: MediaQueryListEvent) => void> = []
  const mql = {
    matches,
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => {
      listeners.push(cb)
    },
    removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => {
      const idx = listeners.indexOf(cb)
      if (idx !== -1) listeners.splice(idx, 1)
    },
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
    /** Fire a change event to all registered listeners */
    _fire(newMatches: boolean) {
      const event = { matches: newMatches } as MediaQueryListEvent
      listeners.forEach((cb) => cb(event))
    },
    get _listenerCount() {
      return listeners.length
    },
  }
  return mql
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  // Clear call history but preserve the default mockImplementation from setup.ts
  vi.clearAllMocks()
})

describe('useTheme', () => {
  it('defaults to light when OS prefers light and no stored value', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
  })

  it('defaults to dark when OS prefers dark and no stored value', () => {
    ;(window.matchMedia as Mock).mockImplementation((query: string) =>
      makeMql(query === '(prefers-color-scheme: dark)'),
    )
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark')
  })

  it('loads stored manual preference over OS preference', () => {
    ;(window.matchMedia as Mock).mockImplementation((query: string) =>
      makeMql(query === '(prefers-color-scheme: dark)'),
    )
    localStorage.setItem('theme', 'light')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
  })

  it('sets data-theme attribute on documentElement', () => {
    renderHook(() => useTheme())
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('toggleTheme switches light → dark and saves to localStorage', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('toggleTheme switches dark → light and saves to localStorage', () => {
    localStorage.setItem('theme', 'dark')
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('light')
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('manual preference is preserved across remounts', () => {
    const { result, unmount } = renderHook(() => useTheme())
    act(() => result.current.toggleTheme())
    unmount()
    const { result: result2 } = renderHook(() => useTheme())
    expect(result2.current.theme).toBe('dark')
  })

  it('OS change updates theme when no manual override is set', () => {
    const mql = makeMql(false)
    ;(window.matchMedia as Mock).mockImplementation(() => mql)
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
    act(() => mql._fire(true))
    expect(result.current.theme).toBe('dark')
  })

  it('OS change does NOT update theme when a manual override exists', () => {
    const mql = makeMql(false)
    ;(window.matchMedia as Mock).mockImplementation(() => mql)
    const { result } = renderHook(() => useTheme())
    // Set manual override
    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('dark')
    // OS switches to dark too — manual should stay
    act(() => mql._fire(true))
    expect(result.current.theme).toBe('dark')
    // OS switches back to light — manual override keeps dark
    act(() => mql._fire(false))
    expect(result.current.theme).toBe('dark')
  })

  it('does not write to localStorage before any manual toggle', () => {
    renderHook(() => useTheme())
    expect(localStorage.getItem('theme')).toBeNull()
  })

  it('cleans up the matchMedia listener on unmount', () => {
    const mql = makeMql(false)
    ;(window.matchMedia as Mock).mockImplementation(() => mql)
    const { unmount } = renderHook(() => useTheme())
    expect(mql._listenerCount).toBe(1)
    unmount()
    expect(mql._listenerCount).toBe(0)
  })
})