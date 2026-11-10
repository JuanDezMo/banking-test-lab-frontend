import { Link, Outlet } from 'react-router'
import { BrandLogo } from '@/components/shared/BrandLogo'
import { TestEnvBadge } from '@/components/shared/TestEnvBadge'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { VirtualCard } from '@/components/shared/VirtualCard'
import { routes } from '@/config/routes'

// Layout de login y registro: panel de marca oscuro (desktop) + formulario
export function AuthLayout() {
  return (
    <div className="auth-layout grid min-h-svh bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      {/* Panel de marca: solo desde lg */}
      <aside
        className="relative m-3 hidden flex-col justify-between overflow-hidden rounded-[32px] bg-inverse p-10 text-inverse-foreground lg:flex"
        aria-label="Banking Test Lab"
        data-testid="auth-brand-panel"
      >
        <div className="flex items-center justify-between">
          <Link to={routes.home} aria-label="Go to home">
            <BrandLogo tone="inverse" />
          </Link>
          <div className="flex items-center gap-2">
            <TestEnvBadge tone="inverse" />
            <ThemeToggle tone="inverse" />
          </div>
        </div>

        <div className="relative mx-auto h-72 w-full max-w-sm" aria-hidden="true">
          <div className="absolute top-2 right-0 aspect-[1.586] w-[85%] rotate-[9deg] rounded-[22px] bg-[linear-gradient(135deg,#ff8a6b,#ff6b4a_60%,#e2553a)]" />
          <VirtualCard
            label="Savings"
            accountNumber="0012345678"
            holder="Ana Pérez"
            className="absolute top-10 left-0 w-[85%] -rotate-[7deg]"
          />
        </div>

        <div>
          <p className="text-4xl leading-tight font-extrabold tracking-tight text-balance">
            Your money, one tap away.
          </p>
          <p className="mt-3 max-w-md text-inverse-muted">
            Open accounts, move money between them and follow every movement. All data here is
            fictitious.
          </p>
        </div>
      </aside>

      {/* Columna del formulario */}
      <main id="main-content" className="flex flex-col px-4 py-6 sm:px-8">
        <div className="flex items-center justify-between lg:hidden">
          <Link to={routes.home} aria-label="Go to home">
            <BrandLogo />
          </Link>
          <div className="flex items-center gap-2">
            <TestEnvBadge />
            <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
