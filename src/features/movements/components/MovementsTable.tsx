import { MoneyText } from '@/components/shared/MoneyText'
import { formatDateTime } from '@/lib/date'
import { cn } from '@/lib/utils'
import { movementTypeLabels, signedAmount, type Movement } from '../types'
import { describeMovement, type AccountNumberLookup } from '../describe'
import { MovementIcon } from './MovementParts'

type MovementsTableProps = {
  movements: Movement[]
  lookup: AccountNumberLookup
  caption: string
}

// Tabla de movimientos para escritorio (estructura thead/tbody predecible)
export function MovementsTable({ movements, lookup, caption }: MovementsTableProps) {
  return (
    <table
      className="movements-table w-full border-collapse text-left"
      data-testid="movements-table"
    >
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
          <th scope="col" className="py-3 pr-4 font-bold">
            Date
          </th>
          <th scope="col" className="py-3 pr-4 font-bold">
            Description
          </th>
          <th scope="col" className="py-3 pr-4 font-bold">
            Type
          </th>
          <th scope="col" className="py-3 text-right font-bold">
            Amount
          </th>
        </tr>
      </thead>
      <tbody>
        {movements.map((movement) => {
          const amount = signedAmount(movement)
          return (
            <tr
              key={movement.id}
              className="movement-row border-t transition-colors hover:bg-muted/60"
              data-testid={`movement-row-${movement.id}`}
              data-movement-type={movement.movementType}
            >
              <td className="py-3 pr-4 whitespace-nowrap text-muted-foreground tabular-nums">
                <time dateTime={movement.createdAt}>{formatDateTime(movement.createdAt)}</time>
              </td>
              <td className="py-3 pr-4">
                <span className="flex items-center gap-3 font-bold">
                  <MovementIcon type={movement.movementType} className="size-9 [&_svg]:size-4" />
                  {describeMovement(movement, lookup)}
                </span>
              </td>
              <td className="py-3 pr-4 text-muted-foreground">
                {movementTypeLabels[movement.movementType]}
              </td>
              <td className="py-3 text-right">
                <MoneyText
                  cents={amount}
                  signed
                  colorNegative={false}
                  className={cn('font-extrabold', amount > 0 && 'text-success')}
                />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
