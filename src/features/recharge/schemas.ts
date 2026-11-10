import { z } from 'zod'
import { limits } from '@/config/limits'
import { parseToCents } from '@/lib/money'

// Formulario de recarga (F-08). Los topes de efectivo y diarios (422) los valida la API.
export const rechargeSchema = z.object({
  accountNumber: z
    .string()
    .trim()
    .regex(/^\d{10}$/, 'Invalid account number'),
  rechargeType: z.enum(['cash', 'employer_bonus', 'salary'], { error: 'Choose a recharge type' }),
  amount: z
    .string()
    .trim()
    .min(1, 'Enter an amount')
    .refine((value) => parseToCents(value) !== null, 'Enter a valid amount, e.g. 150.00')
    .refine((value) => (parseToCents(value) ?? 1) > 0, 'Amount must be greater than zero')
    .refine((value) => (parseToCents(value) ?? 0) <= limits.maxAmount, 'Amount exceeds maximum'),
})

export type RechargeFormValues = z.infer<typeof rechargeSchema>

// Errores 400 del backend que van bajo un campo de este formulario
export const rechargeFieldByMessage: Record<string, string> = {
  'Invalid account number': 'accountNumber',
  'Invalid recharge type': 'rechargeType',
  'Amount must be greater than zero': 'amount',
  'Amount exceeds maximum': 'amount',
}
