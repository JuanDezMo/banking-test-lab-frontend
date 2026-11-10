import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  // compact: dentro de un panel pequeño (por ejemplo, el resumen del dashboard)
  compact?: boolean
  // Nivel del título: h1 cuando el estado es toda la página
  headingLevel?: 'h1' | 'h2' | 'h3'
  className?: string
  testId?: string
}

// Estado vacío o "no encontrado" con el mismo aspecto en toda la app
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  compact = false,
  headingLevel: Heading = 'h3',
  className,
  testId,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'empty-state grid justify-items-center gap-2 text-center',
        compact ? 'py-6' : 'py-12',
        className,
      )}
      data-testid={testId}
    >
      <span
        className={cn(
          'grid place-items-center rounded-full bg-muted',
          compact ? 'size-10' : 'size-14',
        )}
        aria-hidden="true"
      >
        <Icon className={cn('text-muted-foreground', compact ? 'size-4' : 'size-6')} />
      </span>
      <Heading className={cn('font-extrabold tracking-tight', compact ? 'text-base' : 'text-xl')}>
        {title}
      </Heading>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
