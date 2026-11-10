import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorAlert } from '@/components/shared/ErrorAlert'
import { SubmitButton } from '@/components/shared/SubmitButton'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { getErrorMessage } from '@/lib/errors'
import { useLogin } from '../hooks/useAuthMutations'
import { formatCountdown, useCountdown } from '../hooks/useCountdown'
import { loginSchema, type LoginFormValues } from '../schemas'
import type { TokenPair } from '../types'

// Espera por defecto si el 429 no trae Retry-After (ventana de 15 minutos)
const DEFAULT_LOCKOUT_SECONDS = 15 * 60

type LoginFormProps = {
  defaultEmail?: string
  onSuccess: (tokens: TokenPair) => void
}

export function LoginForm({ defaultEmail = '', onSuccess }: LoginFormProps) {
  const loginMutation = useLogin()
  const lockout = useCountdown()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: defaultEmail, password: '' },
  })

  const onSubmit = (values: LoginFormValues) => {
    setFormError(null)
    loginMutation.mutate(values, {
      onSuccess,
      onError: (error) => {
        // 429: bloqueo temporal con cuenta regresiva desde Retry-After
        if (error.code === 'TOO_MANY_REQUESTS') {
          lockout.start(error.retryAfter ?? DEFAULT_LOCKOUT_SECONDS)
          return
        }
        setFormError(getErrorMessage(error))
      },
    })
  }

  return (
    <form
      id="login-form"
      className="login-form"
      aria-label="Sign in form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      data-testid="login-form"
    >
      <FieldGroup>
        {lockout.isRunning && (
          <ErrorAlert title="Too many login attempts" testId="login-lockout-alert">
            Try again in {/* role="timer" no anuncia cada segundo al lector de pantalla */}
            <span
              role="timer"
              className="font-semibold tabular-nums"
              data-testid="login-lockout-countdown"
            >
              {formatCountdown(lockout.secondsLeft)}
            </span>
            .
          </ErrorAlert>
        )}

        {formError && !lockout.isRunning && (
          <ErrorAlert title="Sign in failed" testId="login-error-alert">
            {formError}
          </ErrorAlert>
        )}

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="login-email">Email</FieldLabel>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="ana@mail.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            data-testid="login-email-input"
            {...register('email')}
          />
          <FieldError id="login-email-error" errors={[errors.email]} />
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="login-password">Password</FieldLabel>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
            data-testid="login-password-input"
            {...register('password')}
          />
          <FieldError id="login-password-error" errors={[errors.password]} />
        </Field>

        <SubmitButton
          size="lg"
          className="w-full"
          isPending={loginMutation.isPending}
          pendingText="Signing in..."
          disabled={lockout.isRunning}
          data-testid="login-submit-button"
        >
          Sign in
        </SubmitButton>
      </FieldGroup>
    </form>
  )
}
