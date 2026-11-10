import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2Icon } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { ErrorAlert } from '@/components/shared/ErrorAlert'
import { AmountInput } from '@/components/shared/AmountInput'
import { MoneyText } from '@/components/shared/MoneyText'
import { RadioCard } from '@/components/shared/RadioCard'
import { SubmitButton } from '@/components/shared/SubmitButton'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RadioGroup } from '@/components/ui/radio-group'
import { limits } from '@/config/limits'
import { operatorAccountPath } from '@/config/routes'
import { formatDateTime } from '@/lib/date'
import { getErrorMessage, getFieldError } from '@/lib/errors'
import { formatAccountNumber } from '@/lib/format'
import { formatCents, parseToCents } from '@/lib/money'
import { cn } from '@/lib/utils'
import { useRecharge } from '../hooks/useRecharge'
import { rechargeFieldByMessage, rechargeSchema, type RechargeFormValues } from '../schemas'
import { rechargeTypeOptions, type RechargeMovementDto } from '../types'

const typeLabel = Object.fromEntries(rechargeTypeOptions.map((o) => [o.value, o.label]))

type Receipt = { movement: RechargeMovementDto; accountNumber: string }

// Recarga de una cuenta por número (F-08, solo operator)
export function RechargeForm() {
  const recharge = useRecharge()
  const [receipt, setReceipt] = useState<Receipt | null>(null)

  const {
    control,
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<RechargeFormValues>({
    resolver: zodResolver(rechargeSchema),
    defaultValues: { accountNumber: '', amount: '' },
  })
  const [rechargeType, amountText] = useWatch({ control, name: ['rechargeType', 'amount'] })
  const cashOverLimit =
    rechargeType === 'cash' && (parseToCents(amountText ?? '') ?? 0) > limits.cashRechargeMax

  const onSubmit = (values: RechargeFormValues) => {
    recharge.mutate(values, {
      onSuccess: (movement) => {
        setReceipt({ movement, accountNumber: values.accountNumber.trim() })
        toast.success(`Recharge of ${formatCents(movement.amount)} completed`)
      },
      onError: (error) => {
        const fieldError = getFieldError(error, rechargeFieldByMessage)
        if (fieldError) {
          setError(fieldError.field as keyof RechargeFormValues, {
            type: 'server',
            message: fieldError.message,
          })
        }
      },
    })
  }

  const startNew = () => {
    setReceipt(null)
    recharge.reset()
    reset({ accountNumber: '', amount: '' })
  }

  if (receipt) {
    const { movement } = receipt
    return (
      <section
        aria-labelledby="recharge-receipt-title"
        className="recharge-receipt grid gap-5 rounded-3xl bg-card p-5 sm:p-7"
        data-testid="recharge-receipt"
      >
        <div className="flex items-center gap-3">
          <CheckCircle2Icon className="size-8 text-success" aria-hidden="true" />
          <h2 id="recharge-receipt-title" className="text-xl font-extrabold tracking-tight">
            Recharge completed
          </h2>
        </div>
        <dl className="grid gap-3 rounded-2xl bg-muted p-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">Amount</dt>
            <dd className="text-2xl font-extrabold">
              <MoneyText cents={movement.amount} testId="receipt-amount" />
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Account</dt>
            <dd className="font-bold tabular-nums" data-testid="receipt-account">
              {formatAccountNumber(receipt.accountNumber)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Type</dt>
            <dd className="font-bold" data-testid="receipt-type">
              {typeLabel[movement.details?.rechargeType ?? 'cash']}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Date</dt>
            <dd className="font-bold">
              <time dateTime={movement.createdAt}>{formatDateTime(movement.createdAt)}</time>
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm text-muted-foreground">Movement id</dt>
            <dd className="font-mono text-sm break-all" data-testid="receipt-movement-id">
              {movement.id}
            </dd>
          </div>
        </dl>
        <div className="flex flex-wrap gap-3">
          <Button onClick={startNew} size="lg" data-testid="new-recharge-button">
            New recharge
          </Button>
          <Button asChild variant="outline" size="lg" data-testid="receipt-view-account-link">
            <Link to={operatorAccountPath(movement.accountId)}>View account</Link>
          </Button>
        </div>
      </section>
    )
  }

  return (
    <form
      id="recharge-form"
      className="recharge-form rounded-3xl bg-card p-5 sm:p-7"
      aria-labelledby="recharge-form-title"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      data-testid="recharge-form"
    >
      <h2 id="recharge-form-title" className="mb-5 text-xl font-extrabold tracking-tight">
        Recharge an account
      </h2>
      <FieldGroup>
        {recharge.error && !getFieldError(recharge.error, rechargeFieldByMessage) && (
          <ErrorAlert title="The recharge was not completed" testId="recharge-error-alert">
            {getErrorMessage(recharge.error)}
          </ErrorAlert>
        )}

        <Field data-invalid={!!errors.accountNumber}>
          <FieldLabel htmlFor="recharge-account-number">Account number</FieldLabel>
          <Input
            id="recharge-account-number"
            inputMode="numeric"
            autoComplete="off"
            maxLength={10}
            placeholder="0012345678"
            aria-invalid={!!errors.accountNumber}
            aria-describedby={errors.accountNumber ? 'recharge-account-number-error' : undefined}
            data-testid="recharge-account-number-input"
            {...register('accountNumber')}
          />
          <FieldError id="recharge-account-number-error" errors={[errors.accountNumber]} />
        </Field>

        <fieldset className="grid gap-3">
          <legend className="mb-3 text-sm font-medium">Recharge type</legend>
          <Controller
            name="rechargeType"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value ?? ''}
                onValueChange={field.onChange}
                className="grid gap-3 sm:grid-cols-3"
                aria-invalid={!!errors.rechargeType}
              >
                {rechargeTypeOptions.map((option) => (
                  <RadioCard
                    key={option.value}
                    id={`recharge-type-${option.value}`}
                    value={option.value}
                    label={option.label}
                    description={option.hint}
                    checked={field.value === option.value}
                    testId={`recharge-type-option-${option.value}`}
                  />
                ))}
              </RadioGroup>
            )}
          />
          <FieldError errors={[errors.rechargeType]} />
        </fieldset>

        <Field data-invalid={!!errors.amount}>
          <FieldLabel htmlFor="recharge-amount">Amount</FieldLabel>
          <AmountInput
            id="recharge-amount"
            aria-invalid={!!errors.amount}
            aria-describedby={errors.amount ? 'recharge-amount-error' : 'recharge-amount-hint'}
            data-testid="recharge-amount-input"
            {...register('amount')}
          />
          {errors.amount ? (
            <FieldError id="recharge-amount-error" errors={[errors.amount]} />
          ) : (
            <FieldDescription
              id="recharge-amount-hint"
              className={cn(cashOverLimit && 'text-coral-ink')}
              data-testid="recharge-amount-hint"
            >
              {cashOverLimit
                ? `Cash recharges above ${formatCents(limits.cashRechargeMax)} are rejected by the bank.`
                : 'Each account accepts up to 5 recharges and $3,000,000.00 per day.'}
            </FieldDescription>
          )}
        </Field>

        <SubmitButton
          size="lg"
          variant="brand"
          className="w-full"
          isPending={recharge.isPending}
          pendingText="Recharging..."
          data-testid="recharge-submit-button"
        >
          Recharge account
        </SubmitButton>
      </FieldGroup>
    </form>
  )
}
