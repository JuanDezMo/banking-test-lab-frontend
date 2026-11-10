import { PlusIcon, RotateCwIcon } from 'lucide-react'
import { ErrorAlert } from '@/components/shared/ErrorAlert'
import { VirtualCard } from '@/components/shared/VirtualCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getErrorMessage } from '@/lib/errors'
import type { Account } from '../types'
import { CreateAccountDialog } from './CreateAccountDialog'

// Carga: misma forma que el contenido final para que no salte el layout
export function AccountsSkeleton() {
  return (
    <div
      className="grid gap-6"
      aria-busy="true"
      aria-label="Loading accounts"
      data-testid="accounts-loading"
    >
      <Skeleton className="h-80 rounded-[32px]" />
      <Skeleton className="h-56 rounded-3xl" />
    </div>
  )
}

type AccountsErrorProps = {
  error: unknown
  onRetry: () => void
}

// Error al cargar: mensaje de la API y botón para reintentar
export function AccountsError({ error, onRetry }: AccountsErrorProps) {
  return (
    <div className="grid max-w-lg gap-4" data-testid="accounts-error">
      <ErrorAlert title="We could not load your accounts" testId="accounts-error-alert">
        {getErrorMessage(error)}
      </ErrorAlert>
      <Button
        variant="outline"
        className="justify-self-start"
        onClick={onRetry}
        data-testid="accounts-retry-button"
      >
        <RotateCwIcon aria-hidden="true" />
        Try again
      </Button>
    </div>
  )
}

type AccountsEmptyProps = {
  onCreated: (account: Account) => void
}

// Sin cuentas: invitación a abrir la primera
export function AccountsEmpty({ onCreated }: AccountsEmptyProps) {
  return (
    <section
      aria-labelledby="accounts-empty-title"
      className="accounts-empty grid gap-8 overflow-hidden rounded-[32px] bg-inverse p-7 text-inverse-foreground sm:p-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center"
      data-testid="accounts-empty"
    >
      <div>
        <h1
          id="accounts-empty-title"
          className="text-4xl font-extrabold tracking-tight sm:text-5xl"
        >
          Open your first account
        </h1>
        <p className="mt-4 max-w-md text-inverse-muted">
          Choose a savings account to keep money aside, or a checking account with an overdraft for
          everyday spending.
        </p>
        <CreateAccountDialog
          onCreated={onCreated}
          trigger={
            <Button variant="brand" size="lg" className="mt-8" data-testid="first-account-button">
              <PlusIcon aria-hidden="true" />
              Open account
            </Button>
          }
        />
      </div>
      <div className="mx-auto w-full max-w-xs opacity-60" aria-hidden="true">
        <VirtualCard label="New account" accountNumber="0000000000" className="-rotate-[5deg]" />
      </div>
    </section>
  )
}
