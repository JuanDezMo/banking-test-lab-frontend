import { CircleAlertIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ErrorAlertProps = {
  title?: string
  children: ReactNode
  // center: para diálogos y estados de una sola acción
  align?: 'start' | 'center'
  className?: string
  testId?: string
}

// Alerta de error de un formulario o vista (role="alert" la anuncia al lector de pantalla)
export function ErrorAlert({
  title = 'Something went wrong',
  children,
  align = 'start',
  className,
  testId = 'error-alert',
}: ErrorAlertProps) {
  const centered = align === 'center'

  return (
    <div
      role="alert"
      className={cn(
        'error-alert rounded-2xl bg-destructive/10 px-4 py-3.5 text-destructive',
        centered ? 'grid justify-items-center gap-2 py-5 text-center' : 'flex items-start gap-3',
        className,
      )}
      data-testid={testId}
      data-align={align}
    >
      <span
        aria-hidden="true"
        className={cn(
          'grid shrink-0 place-items-center rounded-full bg-destructive/15',
          centered ? 'size-10' : 'mt-0.5 size-6',
        )}
      >
        <CircleAlertIcon className={centered ? 'size-5' : 'size-3.5'} />
      </span>
      <div className="min-w-0">
        <p className="font-bold">{title}</p>
        <div className="text-sm text-destructive/90" data-testid={`${testId}-message`}>
          {children}
        </div>
      </div>
    </div>
  )
}
