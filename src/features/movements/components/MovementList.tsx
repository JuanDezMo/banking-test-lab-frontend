import { MoneyText } from '@/components/shared/MoneyText'
import { dayKey, formatDayLabel, formatTime } from '@/lib/date'
import { cn } from '@/lib/utils'
import { movementTypeLabels, signedAmount, type Movement } from '../types'
import { describeMovement, type AccountNumberLookup } from '../describe'
import { MovementIcon } from './MovementParts'

type MovementListProps = {
  movements: Movement[]
  lookup: AccountNumberLookup
  className?: string
}

// Agrupa los movimientos por día local, conservando el orden (más reciente primero)
function groupByDay(movements: Movement[]) {
  const groups: { key: string; label: string; items: Movement[] }[] = []
  for (const movement of movements) {
    const key = dayKey(movement.createdAt)
    const last = groups.at(-1)
    if (last?.key === key) last.items.push(movement)
    else groups.push({ key, label: formatDayLabel(movement.createdAt), items: [movement] })
  }
  return groups
}

// Lista de movimientos agrupada por día (móvil y resumen del dashboard)
export function MovementList({ movements, lookup, className }: MovementListProps) {
  return (
    <div className={cn('movement-list grid gap-1', className)} data-testid="movement-list">
      {groupByDay(movements).map((group) => (
        <section key={group.key} aria-label={group.label}>
          <h3 className="mt-3 mb-1 text-xs font-bold tracking-wide text-muted-foreground uppercase">
            {group.label}
          </h3>
          <ul className="grid">
            {group.items.map((movement) => (
              <li
                key={movement.id}
                className="movement-item -mx-2 grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3.5 rounded-2xl p-2 transition-colors hover:bg-muted"
                data-testid={`movement-item-${movement.id}`}
                data-movement-type={movement.movementType}
              >
                <MovementIcon type={movement.movementType} />
                <span className="min-w-0">
                  <span className="block truncate font-bold">
                    {describeMovement(movement, lookup)}
                  </span>
                  <span className="block text-sm text-muted-foreground">
                    {formatTime(movement.createdAt)} · {movementTypeLabels[movement.movementType]}
                  </span>
                </span>
                <MoneyText
                  cents={signedAmount(movement)}
                  signed
                  colorNegative={false}
                  className={cn('font-extrabold', signedAmount(movement) > 0 && 'text-success')}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
