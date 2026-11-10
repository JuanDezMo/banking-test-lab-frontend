import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { AccountHero } from '@/features/accounts/components/AccountHero'
import { AccountList } from '@/features/accounts/components/AccountList'
import {
  AccountsEmpty,
  AccountsError,
  AccountsSkeleton,
} from '@/features/accounts/components/AccountsStates'
import { useAccounts } from '@/features/accounts/hooks/useAccounts'
import { RecentMovements } from '@/features/movements/components/RecentMovements'
import type { Account } from '@/features/accounts/types'
import { selectUser, useAuthStore } from '@/store/authStore'

// Saludo según la hora local
function greeting(date = new Date()): string {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

// Dashboard del cliente: cuenta seleccionada (?account=<id>) y lista de cuentas
export function AccountsPage() {
  const user = useAuthStore(selectUser)
  const { data: accounts, isPending, isError, error, refetch } = useAccounts()
  const [searchParams, setSearchParams] = useSearchParams()

  // La cuenta seleccionada vive en la URL: se puede compartir y sobrevive a recargar
  const selectAccount = (account: Account) =>
    setSearchParams({ account: account.id }, { replace: true })

  return (
    <div className="accounts-page grid gap-6" data-testid="accounts-page">
      <header>
        <p className="text-muted-foreground">{user?.email}</p>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{greeting()}</h1>
      </header>

      {isPending && <AccountsSkeleton />}
      {isError && <AccountsError error={error} onRetry={() => void refetch()} />}

      {accounts && accounts.length === 0 && <AccountsEmpty onCreated={selectAccount} />}

      {accounts && accounts.length > 0 && (
        <AccountsContent
          accounts={accounts}
          selectedId={searchParams.get('account')}
          onSelect={selectAccount}
        />
      )}
    </div>
  )
}

type AccountsContentProps = {
  accounts: Account[]
  selectedId: string | null
  onSelect: (account: Account) => void
}

function AccountsContent({ accounts, selectedId, onSelect }: AccountsContentProps) {
  // Si el id de la URL no existe (o no hay), se muestra la primera cuenta
  const selected = accounts.find((a) => a.id === selectedId) ?? accounts[0]!
  const lookup = useMemo(() => new Map(accounts.map((a) => [a.id, a.accountNumber])), [accounts])

  return (
    <>
      <AccountHero accounts={accounts} selected={selected} onSelect={onSelect} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <RecentMovements accountId={selected.id} lookup={lookup} />
        <AccountList accounts={accounts} selectedId={selected.id} onSelect={onSelect} />
      </div>
    </>
  )
}
