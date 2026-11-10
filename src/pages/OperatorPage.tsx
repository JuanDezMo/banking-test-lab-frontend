import { selectUser, useAuthStore } from '@/store/authStore'

// Inicio del operador. Iteración 2: confirma la sesión; las recargas llegan en la iteración 6.
export function OperatorPage() {
  const user = useAuthStore(selectUser)

  return (
    <section
      aria-labelledby="operator-title"
      className="operator-page rounded-[32px] bg-inverse p-7 text-inverse-foreground sm:p-10"
      data-testid="operator-page"
    >
      <p className="font-semibold text-inverse-muted">Signed in as {user?.email}</p>
      <h1 id="operator-title" className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
        Operations
      </h1>
      <p className="mt-4 max-w-md text-inverse-muted">
        Your operator session is active. Account recharges will be available here soon.
      </p>
    </section>
  )
}
