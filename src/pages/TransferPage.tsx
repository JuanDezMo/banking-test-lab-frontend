import { ArrowLeftIcon } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { accountPath, routes } from '@/config/routes'
import { AccountsEmpty, AccountsError } from '@/features/accounts/components/AccountsStates'
import { useAccounts } from '@/features/accounts/hooks/useAccounts'
import type { Account } from '@/features/accounts/types'
import { TransferForm } from '@/features/transfers/components/TransferForm'
import { formatCents } from '@/lib/money'

// Nueva transferencia (F-09). ?from=<accountId> preselecciona la cuenta origen.
export function TransferPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { data: accounts, isPending, isError, error, refetch } = useAccounts()

  const fromId = searchParams.get('from')
  const defaultOrigin = accounts?.find((a) => a.id === fromId)

  const handleSuccess = (result: { transferOut: { amount: number } }, origin: Account) => {
    toast.success(`Transfer of ${formatCents(result.transferOut.amount)} completed`)
    navigate(accountPath(origin.id))
  }

  return (
    <div className="transfer-page grid gap-6" data-testid="transfer-page">
      <Link
        to={routes.accounts}
        className="inline-flex items-center gap-2 justify-self-start rounded-full px-1 font-bold text-muted-foreground hover:text-foreground"
        data-testid="back-to-accounts-link"
      >
        <ArrowLeftIcon className="size-4" aria-hidden="true" />
        Back to accounts
      </Link>
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">New transfer</h1>
        <p className="mt-1 text-muted-foreground">Send money from one of your accounts.</p>
      </header>

      {isPending && <Skeleton className="h-96 rounded-3xl" data-testid="transfer-loading" />}
      {isError && <AccountsError error={error} onRetry={() => void refetch()} />}
      {accounts && accounts.length === 0 && (
        <AccountsEmpty onCreated={() => navigate(routes.transfer)} />
      )}
      {accounts && accounts.length > 0 && (
        <TransferForm
          accounts={accounts}
          defaultOriginNumber={defaultOrigin?.accountNumber}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  )
}
