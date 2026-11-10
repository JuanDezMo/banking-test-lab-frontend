import { parseToCents } from '@/lib/money'
import { rechargeApi } from '../api/rechargeApi'
import type { RechargeFormValues } from '../schemas'
import type { RechargeRepository, RechargeRequest } from '../types'

// Valores del formulario → cuerpo de la API (monto en centavos)
export function toRechargeRequest(values: RechargeFormValues): RechargeRequest {
  const amount = parseToCents(values.amount)
  if (amount === null) throw new Error('Invalid amount')
  return { accountNumber: values.accountNumber.trim(), rechargeType: values.rechargeType, amount }
}

// Huella de una petición: mismos valores = misma operación (misma Idempotency-Key)
export function requestFingerprint(request: RechargeRequest): string {
  return `${request.accountNumber}|${request.rechargeType}|${request.amount}`
}

export function createRechargeService(repository: RechargeRepository) {
  return {
    recharge: (request: RechargeRequest, idempotencyKey: string) =>
      repository.create(request, idempotencyKey),
  }
}

export const rechargeService = createRechargeService(rechargeApi)
