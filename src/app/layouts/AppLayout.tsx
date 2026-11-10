import { NavLink, Outlet } from 'react-router'
import { BrandLogo } from '@/components/shared/BrandLogo'
import { TestEnvBadge } from '@/components/shared/TestEnvBadge'
import { cn } from '@/lib/utils'
import { navItems } from './navigation'

// Layout de la app: sidebar en escritorio (md+) y barra de pestañas inferior en móvil
export function AppLayout() {
  return (
    <div className="app-layout min-h-svh bg-background text-foreground md:grid md:grid-cols-[232px_minmax(0,1fr)]">
      {/* Sidebar de escritorio */}
      <aside
        className="app-sidebar sticky top-0 hidden h-svh flex-col gap-7 px-3.5 py-7 md:flex"
        data-testid="app-sidebar"
      >
        <BrandLogo className="px-2.5" />
        <nav aria-label="Main navigation">
          <ul className="grid gap-1">
            {navItems.map(({ label, to, icon: Icon, testId }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end
                  data-testid={testId}
                  className={({ isActive }) =>
                    cn(
                      'nav-link flex items-center gap-3 rounded-2xl px-3 py-2.5 font-semibold transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                    )
                  }
                >
                  <Icon className="size-5" aria-hidden="true" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <TestEnvBadge className="mt-auto self-start" />
      </aside>

      <div className="flex min-h-svh flex-col pb-24 md:pb-0">
        {/* Barra superior móvil */}
        <header
          className="app-mobile-header flex items-center justify-between px-4 pt-5 md:hidden"
          data-testid="app-mobile-header"
        >
          <BrandLogo />
          <TestEnvBadge />
        </header>

        <main id="main-content" className="w-full max-w-6xl flex-1 px-4 py-6 md:px-10 md:py-8">
          <Outlet />
        </main>
      </div>

      {/* Pestañas inferiores móviles */}
      <nav
        aria-label="Mobile navigation"
        className="app-tabbar fixed inset-x-0 bottom-0 z-40 border-t bg-card pb-[max(env(safe-area-inset-bottom),12px)] md:hidden"
        data-testid="app-tabbar"
      >
        <ul className="flex justify-around pt-2.5">
          {navItems.map(({ label, to, icon: Icon, testId }) => (
            <li key={to}>
              <NavLink
                to={to}
                end
                data-testid={`tab-${testId}`}
                className={({ isActive }) =>
                  cn(
                    'tab-link grid justify-items-center gap-1 px-3 text-[11px] font-bold transition-colors',
                    isActive ? 'text-foreground' : 'text-muted-foreground',
                  )
                }
              >
                <Icon className="size-[22px]" aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
