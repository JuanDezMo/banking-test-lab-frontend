import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/lib/http/ApiError'
import { movementService } from '../services/movementService'
import type { MovementPage } from '../types'

export const movementKeys = {
  all: ['movements'] as const,
  page: (accountId: string, page: number) => ['movements', accountId, page] as const,
}

// Historial de una cuenta. keepPreviousData mantiene la página anterior visible
// mientras carga la siguiente, así la tabla no parpadea al paginar.
export function useMovements(accountId: string | undefined, page: number) {
  return useQuery<MovementPage, ApiError>({
    queryKey: movementKeys.page(accountId ?? '', page),
    queryFn: () => movementService.list(accountId!, page),
    enabled: Boolean(accountId),
    placeholderData: keepPreviousData,
  })
}
