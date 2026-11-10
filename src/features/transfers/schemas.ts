import { z } from 'zod'
import { accountNumberField, amountField } from '@/lib/validation'

// Formulario de transferencia (F-09). El monto se escribe como texto ("1,500.50")
// y se valida convirtiéndolo a centavos, igual que lo hará el servicio.
export const transferSchema = z
  .object({
    accountOrigin: z.string().min(1, 'Choose the account to send from'),
    accountDestination: accountNumberField(),
    amount: amountField(),
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
