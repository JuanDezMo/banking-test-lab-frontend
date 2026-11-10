import { HomeIcon, LogInIcon, UserPlusIcon, type LucideIcon } from 'lucide-react'
import { routes } from '@/config/routes'

export type NavItem = {
  label: string
  to: string
  icon: LucideIcon
  testId: string
}

// Navegación principal. En la iteración 2 dependerá de la sesión y del rol.
export const navItems: NavItem[] = [
  { label: 'Home', to: routes.home, icon: HomeIcon, testId: 'nav-home' },
  { label: 'Sign in', to: routes.login, icon: LogInIcon, testId: 'nav-login' },
  { label: 'Sign up', to: routes.register, icon: UserPlusIcon, testId: 'nav-register' },
]
