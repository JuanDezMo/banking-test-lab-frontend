import { cn } from '@/lib/utils'

type TestEnvBadgeProps = {
  tone?: 'default' | 'inverse'
  className?: string
}

// Aviso discreto de que la app es un entorno de pruebas con datos ficticios
export function TestEnvBadge({ tone = 'default', className }: TestEnvBadgeProps) {
  return (
    <span
      className={cn(
        'test-env-badge inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap',
        tone === 'inverse'
          ? 'bg-inverse-raised text-inverse-foreground ring-1 ring-white/10'
          : 'bg-accent text-accent-foreground',
        className,
      )}
      title="Fictitious data for learning and testing"
      data-testid="test-env-badge"
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
      Test environment
    </span>
  )
}
