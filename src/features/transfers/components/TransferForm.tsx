import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { MoneyText } from '@/components/shared/MoneyText'
import { SubmitButton } from '@/components/shared/SubmitButton'
import { VirtualCard } from '@/components/shared/VirtualCard'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { availableBalance } from '@/features/accounts/balance'
import { accountTypeLabels, type Account } from '@/features/accounts/types'
import { getErrorMessage, getFieldError } from '@/lib/errors'
import { formatAccountNumber } from '@/lib/format'
import { newIdempotencyKey } from '@/lib/idempotency'
import { formatCents, parseToCents } from '@/lib/money'
import { cn } from '@/lib/utils'
import { useTransfer } from '../hooks/useTransfer'
import { transferFieldByMessage, transferSchema, type TransferFormValues } from '../schemas'
import type { TransferResult } from '../types'
import { ConfirmTransferDialog } from './ConfirmTransferDialog'

type TransferFormProps = {
  accounts: Account[]
  defaultOriginNumber?: string
  onSuccess: (result: TransferResult, origin: Account) => void
}

// Operación pendiente de confirmar: valores + su Idempotency-Key
type PendingTransfer = { values: TransferFormValues; idempotencyKey: string }

export function TransferForm({ accounts, defaultOriginNumber, onSuccess }: TransferFormProps) {
  const transfer = useTransfer()
  const [pending, setPending] = useState<PendingTransfer | null>(null)

  const {
    control,
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      accountOrigin: defaultOriginNumber ?? accounts[0]?.accountNumber ?? '',
      accountDestination: '',
      amount: '',
    },
  })

  // Valores en vivo para la vista previa
  const [originNumber, destination, amountText] = useWatch({
    control,
    name: ['accountOrigin', 'accountDestination', 'amount'],
  })
  const origin = accounts.find((a) => a.accountNumber === originNumber)
  const amountCents = parseToCents(amountText ?? '') ?? 0
  const otherAccounts = accounts.filter((a) => a.accountNumber !== originNumber)

  // Paso 1: formulario válido → se abre la revisión con una Idempotency-Key NUEVA
  const onReview = (values: TransferFormValues) => {
    transfer.reset()
    setPending({ values, idempotencyKey: newIdempotencyKey() })
  }

  // Paso 2: confirmar. Si se reintenta tras un error, se reutiliza la MISMA key:
  // la API no repite la operación aunque la primera petición sí hubiera llegado.
  const onConfirm = () => {
    if (!pending || !origin) return
    transfer.mutate(pending, {
      onSuccess: (result) => {
        setPending(null)
        onSuccess(result, origin)
      },
      onError: (error) => {
        // Un 400 de validación se corrige en el formulario: se cierra la revisión
        const fieldError = getFieldError(error, transferFieldByMessage)
        if (fieldError) {
          setPending(null)
          setError(fieldError.field as keyof TransferFormValues, {
            type: 'server',
            message: fieldError.message,
          })
        }
      },
    })
  }

  return (
    <div className="transfer-layout grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
      <form
        id="transfer-form"
        className="transfer-form rounded-3xl bg-card p-5 sm:p-7"
        aria-label="Transfer form"
        noValidate
        onSubmit={handleSubmit(onReview)}
        data-testid="transfer-form"
      >
        <FieldGroup>
          <Field data-invalid={!!errors.accountOrigin}>
            <FieldLabel htmlFor="transfer-origin">From</FieldLabel>
            <Controller
              name="accountOrigin"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} name={field.name}>
                  <SelectTrigger
                    id="transfer-origin"
                    className="w-full"
                    aria-invalid={!!errors.accountOrigin}
                    data-testid="transfer-origin-select"
                  >
                    <SelectValue placeholder="Choose an account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem
                        key={account.id}
                        value={account.accountNumber}
                        data-testid={`origin-option-${account.accountNumber}`}
                      >
                        {accountTypeLabels[account.accountType]} ·{' '}
                        {formatAccountNumber(account.accountNumber)} ·{' '}
                        {formatCents(account.balance)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {origin && (
              <FieldDescription data-testid="transfer-origin-available">
                Available {formatCents(availableBalance(origin))}
                {origin.accountType === 'checking' && ' including overdraft'}
              </FieldDescription>
            )}
            <FieldError errors={[errors.accountOrigin]} />
          </Field>

          <Field data-invalid={!!errors.accountDestination}>
            <FieldLabel htmlFor="transfer-destination">To account number</FieldLabel>
            <Input
              id="transfer-destination"
              inputMode="numeric"
              autoComplete="off"
              maxLength={10}
              placeholder="0098765432"
              aria-invalid={!!errors.accountDestination}
              aria-describedby={
                errors.accountDestination
                  ? 'transfer-destination-error'
                  : 'transfer-destination-hint'
              }
              data-testid="transfer-destination-input"
              {...register('accountDestination')}
            />
            {errors.accountDestination ? (
              <FieldError id="transfer-destination-error" errors={[errors.accountDestination]} />
            ) : (
              <FieldDescription id="transfer-destination-hint">
                10 digits. It can belong to any customer.
              </FieldDescription>
            )}
            {otherAccounts.length > 0 && (
              <div className="flex flex-wrap gap-2" aria-label="Your other accounts" role="group">
                {otherAccounts.map((account) => (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() =>
                      setValue('accountDestination', account.accountNumber, {
                        shouldValidate: true,
                      })
                    }
                    className={cn(
                      'own-account-chip rounded-full border px-3 py-1.5 text-xs font-bold transition-colors hover:bg-muted',
                      destination === account.accountNumber &&
                        'border-brand bg-accent text-accent-foreground',
                    )}
                    data-testid={`destination-chip-${account.accountNumber}`}
                  >
                    {accountTypeLabels[account.accountType]} ·{' '}
                    {formatAccountNumber(account.accountNumber)}
                  </button>
                ))}
              </div>
            )}
          </Field>

          <Field data-invalid={!!errors.amount}>
            <FieldLabel htmlFor="transfer-amount">Amount</FieldLabel>
            <div className="relative">
              <span
                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 font-bold text-muted-foreground"
                aria-hidden="true"
              >
                $
              </span>
              <Input
                id="transfer-amount"
                inputMode="decimal"
                autoComplete="off"
                placeholder="0.00"
                className="pl-7 text-lg font-bold tabular-nums"
                aria-invalid={!!errors.amount}
                aria-describedby={errors.amount ? 'transfer-amount-error' : undefined}
                data-testid="transfer-amount-input"
                {...register('amount')}
              />
            </div>
            <FieldError id="transfer-amount-error" errors={[errors.amount]} />
          </Field>

          <SubmitButton size="lg" className="w-full" data-testid="review-transfer-button">
            Review transfer
          </SubmitButton>
        </FieldGroup>
      </form>

      {/* Vista previa en vivo de la operación */}
      <aside
        aria-label="Transfer preview"
        className="transfer-preview grid content-start gap-6 rounded-[32px] bg-inverse p-6 text-inverse-foreground sm:p-8"
        data-testid="transfer-preview"
      >
        {origin && (
          <VirtualCard
            label={accountTypeLabels[origin.accountType]}
            accountNumber={origin.accountNumber}
            className="mx-auto max-w-xs -rotate-[4deg]"
          />
        )}
        <div>
          <p className="text-sm font-semibold text-inverse-muted">You send</p>
          <p className="text-4xl font-extrabold tracking-tight">
            <MoneyText cents={amountCents} colorNegative={false} testId="preview-amount" />
          </p>
          <p
            className="mt-2 text-sm text-inverse-muted tabular-nums"
            data-testid="preview-destination"
          >
            To {/^\d{10}$/.test(destination ?? '') ? formatAccountNumber(destination!) : '— — —'}
          </p>
        </div>
        {origin && (
          <p className="border-t border-white/10 pt-4 text-sm text-inverse-muted">
            Balance after transfer{' '}
            <MoneyText
              cents={origin.balance - amountCents}
              colorNegative={false}
              className="font-bold text-inverse-foreground"
              testId="preview-balance-after"
            />
          </p>
        )}
      </aside>

      <ConfirmTransferDialog
        open={pending !== null}
        summary={
          pending && origin
            ? {
                originLabel: accountTypeLabels[origin.accountType],
                originNumber: origin.accountNumber,
                destinationNumber: pending.values.accountDestination,
                amountCents: parseToCents(pending.values.amount) ?? 0,
              }
            : null
        }
        reference={pending?.idempotencyKey.slice(0, 8) ?? null}
        isPending={transfer.isPending}
        errorMessage={transfer.error ? getErrorMessage(transfer.error) : null}
        onConfirm={onConfirm}
        onOpenChange={(open) => !open && setPending(null)}
      />
    </div>
  )
}
