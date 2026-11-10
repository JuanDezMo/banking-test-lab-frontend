import type { components } from '@/lib/api-types'

// DTOs de F-09 (generados desde openapi.yaml)
export type TransferRequest = components['schemas']['TransferRequest']
export type TransferResult = components['schemas']['TransferResult']

// Contrato del acceso a datos: cada transferencia lleva su Idempotency-Key (RN-28)
export interface TransferRepository {
  create(request: TransferRequest, idempotencyKey: string): Promise<TransferResult>
}
