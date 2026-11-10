import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorAlert } from '@/components/shared/ErrorAlert'
import { SubmitButton } from '@/components/shared/SubmitButton'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { getErrorMessage, getFieldError } from '@/lib/errors'
import { useRegister } from '../hooks/useAuthMutations'
import { registerSchema, type RegisterFormValues } from '../schemas'
import type { User } from '../types'

type RegisterFormProps = {
  onSuccess: (user: User) => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const registerMutation = useRegister()
  // Error general que no corresponde a un campo (por ejemplo, email ya registrado)
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  const onSubmit = (values: RegisterFormValues) => {
    setFormError(null)
    registerMutation.mutate(values, {
      onSuccess,
      onError: (error) => {
        // Un 400 de validación va bajo su campo; el resto, en la alerta general
        const fieldError = getFieldError(error)
        if (fieldError) {
          setError(fieldError.field as keyof RegisterFormValues, {
            type: 'server',
            message: fieldError.message,
          })
        } else {
          setFormError(getErrorMessage(error))
        }
      },
    })
  }

  return (
    <form
      id="register-form"
      className="register-form"
      aria-label="Sign up form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      data-testid="register-form"
    >
      <FieldGroup>
        {formError && (
          <ErrorAlert title="Registration failed" testId="register-error-alert">
            {formError}
          </ErrorAlert>
        )}

        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="register-name">Full name</FieldLabel>
          <Input
            id="register-name"
            type="text"
            autoComplete="name"
            placeholder="Ana Pérez"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'register-name-error' : undefined}
            data-testid="register-name-input"
            {...register('name')}
          />
          <FieldError id="register-name-error" errors={[errors.name]} />
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="register-email">Email</FieldLabel>
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="ana@mail.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'register-email-error' : undefined}
            data-testid="register-email-input"
            {...register('email')}
          />
          <FieldError id="register-email-error" errors={[errors.email]} />
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="register-password">Password</FieldLabel>
          <Input
            id="register-password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            aria-invalid={!!errors.password}
            aria-describedby={
              errors.password ? 'register-password-error' : 'register-password-hint'
            }
            data-testid="register-password-input"
            {...register('password')}
          />
          {errors.password ? (
            <FieldError id="register-password-error" errors={[errors.password]} />
          ) : (
            <FieldDescription id="register-password-hint">
              Between 8 and 128 characters.
            </FieldDescription>
          )}
        </Field>

        <SubmitButton
          className="w-full"
          isPending={registerMutation.isPending}
          pendingText="Creating account..."
          data-testid="register-submit-button"
        >
          Create account
        </SubmitButton>
      </FieldGroup>
    </form>
  )
}
