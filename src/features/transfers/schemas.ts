import { z } from 'zod'
import { limits } from '@/config/limits'
import { parseToCents } from '@/lib/money'

const accountNumberPattern = /^\d{10}$/

// Formulario de transferencia (F-09). El monto se escribe como texto ("1,500.50")
// y se valida convirtiéndolo a centavos, igual que lo hará el servicio.
export const transferSchema = z
  .object({
    accountOrigin: z.string().min(1, 'Choose the account to send from'),
    accountDestination: z.string().trim().regex(accountNumberPattern, 'Invalid account number'),
    amount: z
      .string()
      .trim()
      .min(1, 'Enter an amount')
      .refine((value) => parseToCents(value) !== null, 'Enter a valid amount, e.g. 150.00')
      .refine((value) => (parseToCents(value) ?? 1) > 0, 'Amount must be greater than zero')
      .refine((value) => (parseToCents(value) ?? 0) <= limits.maxAmount, 'Amount exceeds maximum'),
  })
  .refine((values) => values.accountOrigin !== values.accountDestination, {
    path: ['accountDestination'],
    message: 'Cannot transfer to the same account',
  })

export type TransferFormValues = z.infer<typeof transferSchema>

// Errores 400 del backend que van bajo un campo de este formulario
export const transferFieldByMessage: Record<string, string> = {
  'Invalid account number': 'accountDestination',
  'Cannot transfer to the same account': 'accountDestination',
  'Amount must be greater than zero': 'amount',
  'Amount exceeds maximum': 'amount',
}
