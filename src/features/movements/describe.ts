import { formatAccountNumber } from '@/lib/format'
import { rechargeTypeLabels, type Movement } from './types'

// Mapa id de cuenta → número, con las cuentas propias del cliente.
// Una cuenta ajena no se puede consultar (404), así que se muestra como "another customer".
export type AccountNumberLookup = Map<string, string>

// Texto principal del movimiento según su tipo
export function describeMovement(movement: Movement, lookup: AccountNumberLookup): string {
  switch (movement.movementType) {
    case 'recharge':
      return rechargeTypeLabels[movement.details.rechargeType]
    case 'transfer_in':
    case 'transfer_out': {
      const number = lookup.get(movement.details.relatedAccountId)
      const direction = movement.movementType === 'transfer_in' ? 'From' : 'To'
      return number
        ? `${direction} ${formatAccountNumber(number)}`
        : `${direction} another customer`
    }
    case 'withdrawal':
      return 'Withdrawal'
  }
}
