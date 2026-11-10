import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

type SubmitButtonProps = Omit<ComponentProps<typeof Button>, 'type'> & {
  isPending?: boolean
  pendingText?: string
}

// Botón de envío: se deshabilita y muestra un spinner mientras la petición está en curso
export function SubmitButton({
  isPending = false,
  pendingText,
  disabled,
  children,
  ...props
}: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={disabled || isPending} aria-busy={isPending} {...props}>
      {isPending && <Spinner aria-hidden="true" />}
      {isPending && pendingText ? pendingText : children}
    </Button>
  )
}
