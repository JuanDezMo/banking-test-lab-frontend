import { CircleAlertIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

type ErrorAlertProps = {
  title?: string
  children: ReactNode
  className?: string
  testId?: string
}

// Alerta de error general de un formulario o vista (role="alert" lo anuncia al lector)
export function ErrorAlert({
  title = 'Something went wrong',
  children,
  className,
  testId = 'error-alert',
}: ErrorAlertProps) {
  return (
    <Alert variant="destructive" className={cn('error-alert', className)} data-testid={testId}>
      <CircleAlertIcon aria-hidden="true" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}
