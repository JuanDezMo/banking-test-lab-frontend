import { movementApi } from '../api/movementApi'
import type { Movement, MovementDto, MovementPage, MovementRepository } from '../types'

// Convierte el DTO de la API al modelo propio (details siempre presente)
export function toMovement(dto: MovementDto): Movement {
  switch (dto.movementType) {
    case 'recharge':
      return {
        ...dto,
        movementType: 'recharge',
        details: { rechargeType: dto.details?.rechargeType ?? 'cash' },
      }
    case 'transfer_in':
    case 'transfer_out':
      return {
        ...dto,
        movementType: dto.movementType,
        details: { relatedAccountId: dto.details?.relatedAccountId ?? '' },
      }
    case 'withdrawal':
      return { ...dto, movementType: 'withdrawal', details: {} }
  }
}

export function createMovementService(repository: MovementRepository) {
  return {
    list: async (accountId: string, page: number): Promise<MovementPage> => {
      const dto = await repository.list(accountId, page)
      return { page: dto.page, pageSize: dto.pageSize, items: dto.items.map(toMovement) }
    },
  }
}

export const movementService = createMovementService(movementApi)
