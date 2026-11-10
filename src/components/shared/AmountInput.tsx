import type { ComponentProps } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// Campo de monto con el símbolo "$" delante. Se usa con register() de React Hook Form:
// en React 19 `ref` llega como prop normal y se pasa al <input>.
export function AmountInput({ className, ...props }: ComponentProps<typeof Input>) {
  return (
    <div className="amount-input relative">
      <span
        className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 font-bold text-muted-foreground"
        aria-hidden="true"
      >
        $
      </span>
      <Input
        inputMode="decimal"
        autoComplete="off"
        placeholder="0.00"
        className={cn('pl-7 text-lg font-bold tabular-nums', className)}
        {...props}
      />
    </div>
  )
}
