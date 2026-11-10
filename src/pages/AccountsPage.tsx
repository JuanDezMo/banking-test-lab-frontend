import { VirtualCard } from '@/components/shared/VirtualCard'
import { selectUser, useAuthStore } from '@/store/authStore'

// Inicio del cliente. Iteración 2: confirma la sesión; las cuentas llegan en la iteración 3.
export function AccountsPage() {
  const user = useAuthStore(selectUser)

  return (
    <section
      aria-labelledby="accounts-title"
      className="accounts-page grid gap-8 overflow-hidden rounded-[32px] bg-inverse p-7 text-inverse-foreground sm:p-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center"
      data-testid="accounts-page"
    >
      <div>
        <p className="font-semibold text-inverse-muted">Signed in as {user?.email}</p>
        <h1 id="accounts-title" className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Your accounts
        </h1>
        <p className="mt-4 max-w-md text-inverse-muted">
          Your session is active. Opening and viewing accounts will be available here soon.
        </p>
      </div>
      <div className="mx-auto w-full max-w-xs" aria-hidden="true">
        <VirtualCard label="Savings" accountNumber="0000000000" className="-rotate-[5deg]" />
      </div>
    </section>
  )
}
