import { ArrowLeftIcon, SearchXIcon } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { ErrorAlert } from '@/components/shared/ErrorAlert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { accountPath, operatorAccountPath, routes } from '@/config/routes'
import { AccountDetailHeader } from '@/features/accounts/components/AccountDetailHeader'
import { useAccount, useAccounts } from '@/features/accounts/hooks/useAccounts'
import { MovementsSection } from '@/features/movements/components/MovementsSection'
import { getErrorMessage } from '@/lib/errors'

// Lee ?page de la URL: ausente → 1; inválido → null (I-12: entero de 1 a 10000)
function parsePage(value: string | null): number | null {
  if (value === null) return 1
  if (!/^\d+$/.test(value)) return null
  const page = Number(value)
  return page >= 1 && page <= 10_000 ? page : null
}

type AccountDetailPageProps = {
  // operator: cualquier cuenta, sin transferir ni lista de cuentas propias
  view?: 'customer' | 'operator'
}

// Detalle de cuenta (F-07) con su historial paginado (F-10)
export function AccountDetailPage({ view = 'customer' }: AccountDetailPageProps) {
  const isOperator = view === 'operator'
  const backTo = isOperator ? routes.operator : routes.accounts
  const backLabel = isOperator ? 'Back to operations' : 'Back to accounts'
  const firstPagePath = (accountId: string) =>
    isOperator ? operatorAccountPath(accountId) : accountPath(accountId)

  const { id } = useParams<{ id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parsePage(searchParams.get('page'))

  const account = useAccount(id)
  // Cuentas propias: permiten mostrar el número de la contraparte en transferencias
  const accounts = useAccounts({ enabled: !isOperator })
  const lookup = useMemo(
    () => new Map((accounts.data ?? []).map((a) => [a.id, a.accountNumber])),
    [accounts.data],
  )

  const changePage = (next: number) => {
    setSearchParams(next > 1 ? { page: String(next) } : {})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 400 (id con formato inválido) y 404 (no existe o es ajena) se muestran igual
  const notFound = account.isError && [400, 404].includes(account.error.status)

  return (
    <div className="account-detail-page grid gap-6" data-testid="account-detail-page">
      <Link
        to={backTo}
        className="inline-flex items-center gap-2 justify-self-start rounded-full px-1 font-bold text-muted-foreground hover:text-foreground"
        data-testid="back-to-accounts-link"
      >
        <ArrowLeftIcon className="size-4" aria-hidden="true" />
        {backLabel}
      </Link>

      {account.isPending && (
        <Skeleton className="h-72 rounded-[32px]" data-testid="account-detail-loading" />
      )}

      {notFound && (
        <section
          className="grid justify-items-center gap-3 rounded-3xl bg-card px-6 py-16 text-center"
          data-testid="account-not-found"
        >
          <span
            className="grid size-14 place-items-center rounded-full bg-muted"
            aria-hidden="true"
          >
            <SearchXIcon className="size-6 text-muted-foreground" />
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight">Account not found</h1>
          <p className="max-w-sm text-muted-foreground">
            This account does not exist or you do not have access to it.
          </p>
          <Button asChild className="mt-2">
            <Link to={backTo}>{isOperator ? 'Back to operations' : 'Go to your accounts'}</Link>
          </Button>
        </section>
      )}

      {account.isError && !notFound && (
        <ErrorAlert title="We could not load the account" testId="account-detail-error-alert">
          {getErrorMessage(account.error)}
        </ErrorAlert>
      )}

      {account.data && (
        <>
          <AccountDetailHeader account={account.data} showTransfer={!isOperator} />
          {page === null ? (
            <ErrorAlert title="Invalid page" testId="invalid-page-alert">
              The page number in the address is not valid.{' '}
              <Link to={firstPagePath(account.data.id)} className="font-bold underline">
                Go to the first page
              </Link>
            </ErrorAlert>
          ) : (
            <MovementsSection
              accountId={account.data.id}
              page={page}
              onPageChange={changePage}
              lookup={lookup}
            />
          )}
        </>
      )}
    </div>
  )
}
