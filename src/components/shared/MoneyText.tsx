import { formatCents, splitFormattedCents } from '@/lib/money'
import { cn } from '@/lib/utils'

type MoneyTextProps = {
  cents: number
  // split: decimales más pequeños (para saldos grandes)
  split?: boolean
  // signed: muestra "+" en positivos (movimientos)
  signed?: boolean
  // Color para negativos; false cuando el fondo ya define el color
  colorNegative?: boolean
  className?: string
  fractionClassName?: string
  testId?: string
}

// Muestra un monto en centavos. <data value> expone el valor exacto en el DOM.
export function MoneyText({
  cents,
  split = false,
  signed = false,
  colorNegative = true,
  className,
  fractionClassName,
  testId,
}: MoneyTextProps) {
  const sign = signed && cents > 0 ? '+' : ''
  const { whole, fraction } = splitFormattedCents(cents)

  return (
    <data
      value={cents}
      className={cn(
        'money tabular-nums',
        colorNegative && cents < 0 && 'text-destructive',
        className,
      )}
      data-testid={testId}
    >
      {split ? (
        <>
          {sign}
          {whole}
          <span className={cn('text-[0.5em]', fractionClassName)}>{fraction}</span>
        </>
      ) : (
        `${sign}${formatCents(cents)}`
      )}
    </data>
  )
}
