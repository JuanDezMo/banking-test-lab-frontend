import { cn } from '@/lib/utils'

type BrandLogoProps = {
  // inverse: para fondos oscuros (marca blanca sobre el bloque oscuro)
  tone?: 'default' | 'inverse'
  showName?: boolean
  size?: number
  className?: string
}

// Logo de Banking Test Lab: una "B" de trazo continuo con un punto coral
export function BrandLogo({
  tone = 'default',
  showName = true,
  size = 32,
  className,
}: BrandLogoProps) {
  const isInverse = tone === 'inverse'

  return (
    <span
      className={cn(
        'brand-logo inline-flex items-center gap-2.5 font-extrabold tracking-tight',
        className,
      )}
      data-testid="brand-logo"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        role="img"
        aria-label="Banking Test Lab logo"
      >
        <title>Banking Test Lab logo</title>
        <rect width="32" height="32" rx="10" fill={isInverse ? '#ffffff' : 'var(--inverse)'} />
        <path
          d="M10 22V10h6.5a3 3 0 0 1 0 6H10m6.5 0H18a3 3 0 0 1 0 6h-8"
          fill="none"
          stroke={isInverse ? '#121216' : '#ffffff'}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <circle cx="24" cy="10" r="3" fill="var(--coral)" />
      </svg>
      {showName && (
        <span className={isInverse ? 'text-inverse-foreground' : ''}>Banking Test Lab</span>
      )}
    </span>
  )
}
