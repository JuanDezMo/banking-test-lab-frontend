import { parseToCents } from '@/lib/money'
import { transferApi } from '../api/transferApi'
import type { TransferFormValues } from '../schemas'
import type { TransferRepository, TransferRequest } from '../types'

// Convierte los valores del formulario al cuerpo que espera la API (monto en centavos)
export function toTransferRequest(values: TransferFormValues): TransferRequest {
  const amount = parseToCents(values.amount)
  if (amount === null) throw new Error('Invalid amount')
  return {
    accountOrigin: values.accountOrigin,
    accountDestination: values.accountDestination.trim(),
    amount,
  }
}

export function createTransferService(repository: TransferRepository) {
  return {
    transfer: (values: TransferFormValues, idempotencyKey: string) =>
      repository.create(toTransferRequest(values), idempotencyKey),
  }
}

export const transferService = createTransferService(transferApi)
