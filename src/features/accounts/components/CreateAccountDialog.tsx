import { zodResolver } from '@hookform/resolvers/zod'
import { useState, type ReactNode } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ErrorAlert } from '@/components/shared/ErrorAlert'
import { SubmitButton } from '@/components/shared/SubmitButton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FieldError } from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { limits } from '@/config/limits'
import { getErrorMessage } from '@/lib/errors'
import { formatCents } from '@/lib/money'
import { cn } from '@/lib/utils'
import { useCreateAccount } from '../hooks/useAccounts'
import { createAccountSchema, type CreateAccountFormValues } from '../schemas'
import { accountTypeLabels, type Account, type AccountType } from '../types'

type CreateAccountDialogProps = {
  // Elemento que abre el diálogo (botón)
  trigger: ReactNode
  onCreated?: (account: Account) => void
}

const options: { value: AccountType; description: string }[] = [
  { value: 'savings', description: 'Save money. Balance can never go below $0.00.' },
  {
    value: 'checking',
    description: `Everyday spending. Overdraft up to ${formatCents(limits.overdraft.checking)}.`,
  },
]

export function CreateAccountDialog({ trigger, onCreated }: CreateAccountDialogProps) {
  const [open, setOpen] = useState(false)
  const createAccount = useCreateAccount()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAccountFormValues>({ resolver: zodResolver(createAccountSchema) })

  // Al cerrar se limpia el formulario y el error anterior
  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      reset()
      createAccount.reset()
    }
  }

  const onSubmit = (values: CreateAccountFormValues) => {
    createAccount.mutate(values, {
      onSuccess: (account) => {
        toast.success(`${accountTypeLabels[account.accountType]} account opened`)
        handleOpenChange(false)
        onCreated?.(account)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent data-testid="create-account-dialog">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold tracking-tight">
            Open an account
          </DialogTitle>
          <DialogDescription>It starts with a $0.00 balance.</DialogDescription>
        </DialogHeader>

        <form
          id="create-account-form"
          className="create-account-form grid gap-5"
          aria-label="Open account form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          data-testid="create-account-form"
        >
          {createAccount.error && (
            <ErrorAlert title="Could not open the account" testId="create-account-error-alert">
              {getErrorMessage(createAccount.error)}
            </ErrorAlert>
          )}

          <fieldset className="grid gap-3">
            <legend className="mb-3 text-sm font-semibold">Account type</legend>
            <Controller
              name="accountType"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ?? ''}
                  onValueChange={field.onChange}
                  aria-invalid={!!errors.accountType}
                  aria-describedby={errors.accountType ? 'account-type-error' : undefined}
                  className="gap-3"
                >
                  {options.map((option) => (
                    <label
                      key={option.value}
                      htmlFor={`account-type-${option.value}`}
                      className={cn(
                        'account-type-option flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors',
                        field.value === option.value
                          ? 'border-brand bg-accent'
                          : 'border-border hover:bg-muted',
                      )}
                      data-testid={`account-type-option-${option.value}`}
                    >
                      <RadioGroupItem
                        id={`account-type-${option.value}`}
                        value={option.value}
                        className="mt-0.5"
                      />
                      <span>
                        <span className="block font-bold">{accountTypeLabels[option.value]}</span>
                        <span className="block text-muted-foreground">{option.description}</span>
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              )}
            />
            <FieldError id="account-type-error" errors={[errors.accountType]} />
          </fieldset>

          <SubmitButton
            size="lg"
            className="w-full"
            isPending={createAccount.isPending}
            pendingText="Opening account..."
            data-testid="create-account-submit-button"
          >
            Open account
          </SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  )
}
