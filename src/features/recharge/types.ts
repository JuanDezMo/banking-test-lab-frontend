import type { components } from '@/lib/api-types'

// DTOs de F-08 (generados desde openapi.yaml)
export type RechargeRequest = components['schemas']['RechargeRequest']
export type RechargeType = components['schemas']['RechargeType']
export type RechargeMovementDto = components['schemas']['RechargeMovement']

export const rechargeTypeOptions: { value: RechargeType; label: string; hint: string }[] = [
  { value: 'cash', label: 'Cash', hint: 'Up to $3,000.00 per recharge' },
  { value: 'salary', label: 'Salary', hint: 'No per-recharge limit' },
  { value: 'employer_bonus', label: 'Employer bonus', hint: 'No per-recharge limit' },
]

// Contrato del acceso a datos: cada recarga lleva su Idempotency-Key (RN-28)
export interface RechargeRepository {
  create(request: RechargeRequest, idempotencyKey: string): Promise<RechargeMovementDto>
}
