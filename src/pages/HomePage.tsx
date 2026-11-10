import { ArrowRightIcon } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { VirtualCard } from '@/components/shared/VirtualCard'
import { routes } from '@/config/routes'

// Página de inicio temporal: se reemplaza por el dashboard en la iteración 3
export function HomePage() {
  return (
    <section
      aria-labelledby="home-title"
      className="home-hero grid gap-10 overflow-hidden rounded-[32px] bg-inverse p-7 text-inverse-foreground sm:p-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center"
      data-testid="home-page"
    >
      <div>
        <h1
          id="home-title"
          className="text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-6xl"
        >
          Banking that feels simple.
        </h1>
        <p className="mt-4 max-w-lg text-lg text-inverse-muted">
          Open savings and checking accounts, transfer money and follow every movement. A test lab
          with fictitious data.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="brand" size="lg" data-testid="home-register-link">
            <Link to={routes.register}>
              Create account
              <ArrowRightIcon aria-hidden="true" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-inverse-raised text-inverse-foreground hover:bg-white/15"
            data-testid="home-login-link"
          >
            <Link to={routes.login}>Sign in</Link>
          </Button>
        </div>
      </div>

      <div className="relative mx-auto h-64 w-full max-w-sm" aria-hidden="true">
        <div className="absolute top-0 right-0 aspect-[1.586] w-[85%] rotate-[9deg] rounded-[22px] bg-[linear-gradient(135deg,#ff8a6b,#ff6b4a_60%,#e2553a)]" />
        <VirtualCard
          label="Savings"
          accountNumber="0012345678"
          holder="Ana Pérez"
          className="absolute top-8 left-0 w-[85%] -rotate-[7deg]"
        />
      </div>
    </section>
  )
}
