import { useState, useEffect } from 'react'

function getHash(): string {
  return window.location.hash.replace(/^#/, '') || '/'
}

export function useHashRoute(): string {
  const [route, setRoute] = useState<string>(getHash)

  useEffect(() => {
    const handler = () => setRoute(getHash())
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  return route
}
