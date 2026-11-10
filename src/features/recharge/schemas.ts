import { z } from 'zod'
import { accountNumberField, amountField } from '@/lib/validation'

// Formulario de recarga (F-08). Los topes de efectivo y diarios (422) los valida la API.
export const rechargeSchema = z.object({
  accountNumber: accountNumberField(),
  rechargeType: z.enum(['cash', 'employer_bonus', 'salary'], { error: 'Choose a recharge type' }),
  amount: amountField(),
})

export type RechargeFormValues = z.infer<typeof rechargeSchema>

// Errores 400 del backend que van bajo un campo de este formulario
export const rechargeFieldByMessage: Record<string, string> = {
  'Invalid account number': 'accountNumber',
  'Invalid recharge type': 'rechargeType',
  'Amount must be greater than zero': 'amount',
  'Amount exceeds maximum': 'amount',
}
