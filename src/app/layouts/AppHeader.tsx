import { MenuIcon } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { routes } from '@/config/routes'
import { cn } from '@/lib/utils'

type NavItem = {
  label: string
  to: string
  testId: string
}

// Enlaces de navegación; se ampliarán en las siguientes iteraciones
const navItems: NavItem[] = [
  { label: 'Home', to: routes.home, testId: 'nav-home' },
  { label: 'Sign in', to: routes.login, testId: 'nav-login' },
  { label: 'Sign up', to: routes.register, testId: 'nav-register' },
]

// Clases del enlace: NavLink agrega aria-current="page" al enlace activo
const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'nav-link rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted',
    isActive ? 'bg-muted text-foreground' : 'text-muted-foreground',
  )

export function AppHeader() {
  // Controla el menú móvil para cerrarlo al navegar
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="app-header border-b bg-background" data-testid="app-header">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4">
        <Link
          to={routes.home}
          className="flex items-center gap-2 font-semibold"
          data-testid="brand-link"
        >
          <img src="/logo.svg" alt="Bank Lab logo" width={28} height={28} />
          <span>Bank Lab</span>
        </Link>

        {/* Navegación de escritorio: visible desde md */}
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end className={linkClass} data-testid={item.testId}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Navegación móvil: menú lateral en un Sheet */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
              title="Open menu"
              data-testid="mobile-menu-button"
            >
              <MenuIcon aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" data-testid="mobile-menu">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Navigate through Bank Lab</SheetDescription>
            </SheetHeader>
            <nav aria-label="Mobile navigation" className="px-4">
              <ul className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end
                      className={linkClass}
                      onClick={() => setMenuOpen(false)}
                      data-testid={`mobile-${item.testId}`}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
