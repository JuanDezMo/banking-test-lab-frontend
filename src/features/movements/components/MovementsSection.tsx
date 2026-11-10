import { ReceiptTextIcon, RotateCwIcon } from 'lucide-react'
import { ErrorAlert } from '@/components/shared/ErrorAlert'
import { Pagination } from '@/components/shared/Pagination'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { limits } from '@/config/limits'
import { getErrorMessage } from '@/lib/errors'
import { useMovements } from '../hooks/useMovements'
import type { AccountNumberLookup } from '../describe'
import { MovementList } from './MovementList'
import { MovementsTable } from './MovementsTable'

type MovementsSectionProps = {
  accountId: string
  page: number
  onPageChange: (page: number) => void
  lookup: AccountNumberLookup
}

// Historial paginado: tabla en escritorio, lista en móvil, con todos sus estados
export function MovementsSection({ accountId, page, onPageChange, lookup }: MovementsSectionProps) {
  const { data, isPending, isError, error, isFetching, isPlaceholderData, refetch } = useMovements(
    accountId,
    page,
  )
  const items = data?.items ?? []
  const pageSize = limits.movementsPageSize
  const first = (page - 1) * pageSize + 1
  // Si llega una página completa puede haber otra; si no, es la última
  const hasNext = items.length === pageSize

  return (
    <section
      aria-labelledby="movements-title"
      aria-busy={isFetching}
      className="movements-section rounded-3xl bg-card p-5 sm:p-6"
      data-testid="movements-section"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="movements-title" className="text-lg font-extrabold tracking-tight">
          Movements
        </h2>
        {items.length > 0 && (
          <span
            className="text-sm text-muted-foreground tabular-nums"
            data-testid="movements-range"
          >
            Showing {first}–{first + items.length - 1}
          </span>
        )}
      </div>

      {isPending && (
        <div
          className="mt-4 grid gap-3"
          aria-label="Loading movements"
          data-testid="movements-loading"
        >
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 rounded-2xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="mt-4 grid gap-3" data-testid="movements-error">
          <ErrorAlert title="We could not load the movements" testId="movements-error-alert">
            {getErrorMessage(error)}
          </ErrorAlert>
          <Button variant="outline" className="justify-self-start" onClick={() => void refetch()}>
            <RotateCwIcon aria-hidden="true" />
            Try again
          </Button>
        </div>
      )}

      {data && items.length === 0 && (
        <div
          className="grid justify-items-center gap-2 py-12 text-center"
          data-testid="movements-empty"
        >
          <span
            className="grid size-12 place-items-center rounded-full bg-muted"
            aria-hidden="true"
          >
            <ReceiptTextIcon className="size-5 text-muted-foreground" />
          </span>
          <p className="font-bold">{page > 1 ? 'No more movements' : 'No movements yet'}</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            {page > 1
              ? 'You reached the end of the history.'
              : 'Recharges and transfers on this account will appear here.'}
          </p>
        </div>
      )}

      {items.length > 0 && (
        <div className={isPlaceholderData ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          <MovementList movements={items} lookup={lookup} className="md:hidden" />
          <div className="mt-2 hidden md:block">
            <MovementsTable
              movements={items}
              lookup={lookup}
              caption={`Movements ${first} to ${first + items.length - 1}`}
            />
          </div>
        </div>
      )}

      {data && (page > 1 || hasNext) && (
        <div className="mt-5 border-t pt-5">
          <Pagination
            page={page}
            hasNext={hasNext}
            onPageChange={onPageChange}
            isFetching={isFetching}
            label="Movements pages"
          />
        </div>
      )}
    </section>
  )
}
