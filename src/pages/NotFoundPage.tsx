import { ArrowLeftIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { Button } from '@/components/ui/button'
import { homePathForRole, routes } from '@/config/routes'
import { selectUser, useAuthStore } from '@/store/authStore'

// Página 404 para rutas que no existen en la app
export function NotFoundPage() {
  const user = useAuthStore(selectUser)
  const location = useLocation()
  const homePath = user ? homePathForRole(user.role) : routes.home

  return (
    <section
      aria-labelledby="not-found-title"
      className="not-found-page grid justify-items-start gap-6 overflow-hidden rounded-[32px] bg-inverse p-8 text-inverse-foreground sm:p-12"
      data-testid="not-found-page"
    >
      <p
        className="text-[clamp(5rem,18vw,10rem)] leading-none font-extrabold tracking-[-0.05em] text-transparent [-webkit-text-stroke:2px_var(--inverse-muted)]"
        aria-hidden="true"
      >
        404
      </p>
      <div>
        <h1 id="not-found-title" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 max-w-md text-inverse-muted">
          The page{' '}
          <code
            className="rounded-md bg-inverse-raised px-1.5 py-0.5 text-sm text-inverse-foreground"
            data-testid="not-found-path"
          >
            {location.pathname}
          </code>{' '}
          does not exist. Check the address or go back to the start.
        </p>
      </div>
      <Button asChild variant="brand" size="lg" data-testid="not-found-home-link">
        <Link to={homePath}>
          <ArrowLeftIcon aria-hidden="true" />
          {user ? 'Back to my home' : 'Go to home'}
        </Link>
      </Button>
    </section>
  )
}
