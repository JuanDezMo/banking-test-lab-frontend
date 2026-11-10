import {
  HomeIcon,
  LandmarkIcon,
  LogInIcon,
  UserPlusIcon,
  WalletCardsIcon,
  type LucideIcon,
} from 'lucide-react'
import type { Role } from '@/features/auth/types'
import { routes } from '@/config/routes'

export type NavItem = {
  label: string
  to: string
  icon: LucideIcon
  testId: string
  // true: solo activo en la ruta exacta (Home); false: también en subrutas (/accounts/:id)
  end?: boolean
}

const guestItems: NavItem[] = [
  { label: 'Home', to: routes.home, icon: HomeIcon, testId: 'nav-home', end: true },
  { label: 'Sign in', to: routes.login, icon: LogInIcon, testId: 'nav-login' },
  { label: 'Sign up', to: routes.register, icon: UserPlusIcon, testId: 'nav-register' },
]

const customerItems: NavItem[] = [
  { label: 'Accounts', to: routes.accounts, icon: WalletCardsIcon, testId: 'nav-accounts' },
]

const operatorItems: NavItem[] = [
  { label: 'Operations', to: routes.operator, icon: LandmarkIcon, testId: 'nav-operator' },
]

// Navegación según la sesión: invitado, cliente u operador
export function getNavItems(role: Role | null): NavItem[] {
  if (role === 'customer') return customerItems
  if (role === 'operator') return operatorItems
  return guestItems
}
