import { RotateCwIcon, TriangleAlertIcon } from 'lucide-react'
import { isRouteErrorResponse, useRouteError } from 'react-router'
import { BrandLogo } from '@/components/shared/BrandLogo'
import { Button } from '@/components/ui/button'

// Error boundary global: se muestra si un componente lanza un error inesperado al renderizar.
// Reemplaza a la pantalla por defecto de React Router y no depende del layout (que pudo fallar).
export function RouteErrorPage() {
  const error = useRouteError()
  // Detalle técnico solo en desarrollo, para depurar sin exponerlo en producción
  const detail = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : String(error)

  return (
    <main
      id="main-content"
      className="route-error-page grid min-h-svh place-items-center bg-background px-4 py-10 text-foreground"
      data-testid="route-error-page"
    >
      <section
        role="alert"
        aria-labelledby="route-error-title"
        className="grid w-full max-w-lg justify-items-center gap-5 rounded-[32px] bg-card p-8 text-center sm:p-10"
      >
        <BrandLogo />
        <span
          className="grid size-14 place-items-center rounded-full bg-destructive/10"
          aria-hidden="true"
        >
          <TriangleAlertIcon className="size-6 text-destructive" />
        </span>
        <div>
          <h1 id="route-error-title" className="text-2xl font-extrabold tracking-tight">
            Something went wrong
          </h1>
          <p className="mt-2 text-muted-foreground">
            An unexpected error stopped this page. Your money is safe: no operation was sent twice.
          </p>
        </div>
        {import.meta.env.DEV && (
          <pre
            className="max-h-40 w-full overflow-auto rounded-2xl bg-muted p-3 text-left text-xs whitespace-pre-wrap"
            data-testid="route-error-detail"
          >
            {detail}
          </pre>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            size="lg"
            onClick={() => window.location.reload()}
            data-testid="route-error-reload"
          >
            <RotateCwIcon aria-hidden="true" />
            Reload page
          </Button>
          <Button asChild variant="outline" size="lg" data-testid="route-error-home">
            <a href="/">Go to home</a>
          </Button>
        </div>
      </section>
    </main>
  )
}
