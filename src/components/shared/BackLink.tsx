import { ArrowLeftIcon } from 'lucide-react'
import { Link } from 'react-router'

type BackLinkProps = {
  to: string
  label: string
  testId?: string
}

// Enlace "volver" de las páginas de detalle y formularios
export function BackLink({ to, label, testId = 'back-link' }: BackLinkProps) {
  return (
    <Link
      to={to}
      className="back-link inline-flex items-center gap-2 justify-self-start rounded-full px-1 font-bold text-muted-foreground hover:text-foreground"
      data-testid={testId}
    >
      <ArrowLeftIcon className="size-4" aria-hidden="true" />
      {label}
    </Link>
  )
}
