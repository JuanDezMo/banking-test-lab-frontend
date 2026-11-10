import { z } from 'zod'
import { limits } from '@/config/limits'
import { parseToCents } from '@/lib/money'

// Campos de formulario compartidos por varias features (mismos mensajes que la API)

// Número de cuenta: exactamente 10 dígitos (I-04)
export const accountNumberField = () =>
  z
    .string()
    .trim()
    .regex(/^\d{10}$/, 'Invalid account number')

// Monto escrito como texto ("1,500.50"): se valida convirtiéndolo a centavos (I-01, RN-30)
export const amountField = () =>
  z
    .string()
    .trim()
    .min(1, 'Enter an amount')
    .refine((value) => parseToCents(value) !== null, 'Enter a valid amount, e.g. 150.00')
    .refine((value) => (parseToCents(value) ?? 1) > 0, 'Amount must be greater than zero')
    .refine((value) => (parseToCents(value) ?? 0) <= limits.maxAmount, 'Amount exceeds maximum')
