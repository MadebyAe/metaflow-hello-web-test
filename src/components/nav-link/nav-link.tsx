import type { ReactNode } from 'react'

interface NavLinkProps {
  href: string
  currentRoute: string
  children: ReactNode
}

export function NavLink({ href, currentRoute, children }: NavLinkProps) {
  const isActive = currentRoute === href
  return (
    <a
      href={`#${href}`}
      className={`nav-link${isActive ? ' nav-link--active' : ''}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </a>
  )
}
