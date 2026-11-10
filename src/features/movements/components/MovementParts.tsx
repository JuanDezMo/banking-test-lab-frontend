import { ArrowDownLeftIcon, ArrowUpRightIcon, BanknoteIcon, MinusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MovementType } from '../types'

const iconStyles: Record<MovementType, string> = {
  recharge: 'bg-accent text-accent-foreground',
  transfer_in: 'bg-success-soft text-success',
  transfer_out: 'bg-coral-soft text-coral-ink',
  withdrawal: 'bg-muted text-muted-foreground',
}

const icons = {
  recharge: BanknoteIcon,
  transfer_in: ArrowDownLeftIcon,
  transfer_out: ArrowUpRightIcon,
  withdrawal: MinusIcon,
} satisfies Record<MovementType, unknown>

// Ícono circular por tipo de movimiento
export function MovementIcon({ type, className }: { type: MovementType; className?: string }) {
  const Icon = icons[type]
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid size-11 shrink-0 place-items-center rounded-full',
        iconStyles[type],
        className,
      )}
    >
      <Icon className="size-5" />
    </span>
  )
}
