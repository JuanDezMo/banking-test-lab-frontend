import { Link } from 'react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { accountPath } from '@/config/routes'
import { getErrorMessage } from '@/lib/errors'
import { useMovements } from '../hooks/useMovements'
import type { AccountNumberLookup } from '../describe'
import { MovementList } from './MovementList'

type RecentMovementsProps = {
  accountId: string
  lookup: AccountNumberLookup
  limit?: number
}

// Últimos movimientos de la cuenta seleccionada en el dashboard
export function RecentMovements({ accountId, lookup, limit = 5 }: RecentMovementsProps) {
  const { data, isPending, isError, error } = useMovements(accountId, 1)
  const items = data?.items.slice(0, limit) ?? []

  return (
    <section
      aria-labelledby="recent-movements-title"
      className="recent-movements rounded-3xl bg-card p-5 sm:p-6"
      data-testid="recent-movements"
    >
      <div className="flex items-center justify-between">
        <h2 id="recent-movements-title" className="text-lg font-extrabold tracking-tight">
          Recent movements
        </h2>
        <Link
          to={accountPath(accountId)}
          className="text-sm font-bold text-accent-foreground hover:underline"
          data-testid="see-all-movements-link"
        >
          See all
        </Link>
      </div>

      {isPending && <Skeleton className="mt-4 h-40 rounded-2xl" />}
      {isError && <p className="mt-4 text-sm text-destructive">{getErrorMessage(error)}</p>}
      {data && items.length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground" data-testid="recent-movements-empty">
          No movements yet on this account.
        </p>
      )}
      {items.length > 0 && <MovementList movements={items} lookup={lookup} />}
    </section>
  )
}
