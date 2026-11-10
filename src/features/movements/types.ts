import type { components } from '@/lib/api-types'

// DTOs tal como los devuelve la API (generados desde openapi.yaml)
export type MovementDto = components['schemas']['Movement']
export type MovementPageDto = components['schemas']['MovementPage']
export type RechargeType = components['schemas']['RechargeType']

// Modelo propio: unión discriminada por movementType.
// TypeScript sabe qué hay en `details` según el valor de movementType.
type MovementBase = {
  id: string
  accountId: string
  amount: number
  createdAt: string
}

export type RechargeMovement = MovementBase & {
  movementType: 'recharge'
  details: { rechargeType: RechargeType }
}

export type TransferMovement = MovementBase & {
  movementType: 'transfer_in' | 'transfer_out'
  details: { relatedAccountId: string }
}

export type WithdrawalMovement = MovementBase & {
  movementType: 'withdrawal'
  details: Record<string, never>
}

export type Movement = RechargeMovement | TransferMovement | WithdrawalMovement
export type MovementType = Movement['movementType']

export type MovementPage = {
  page: number
  pageSize: number
  items: Movement[]
}

export const movementTypeLabels: Record<MovementType, string> = {
  recharge: 'Recharge',
  transfer_in: 'Transfer in',
  transfer_out: 'Transfer out',
  withdrawal: 'Withdrawal',
}

export const rechargeTypeLabels: Record<RechargeType, string> = {
  cash: 'Cash deposit',
  employer_bonus: 'Employer bonus',
  salary: 'Salary',
}

// Signo de un movimiento: recargas y entradas suman; salidas y retiros restan (RN-17)
export function signedAmount(movement: Movement): number {
  return movement.movementType === 'recharge' || movement.movementType === 'transfer_in'
    ? movement.amount
    : -movement.amount
}

export interface MovementRepository {
  list(accountId: string, page: number): Promise<MovementPageDto>
}
