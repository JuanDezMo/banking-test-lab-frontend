import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { ApiError } from '@/lib/http/ApiError'
import { queryKeys } from '@/lib/queryKeys'
import { movementService } from '../services/movementService'
import type { MovementPage } from '../types'

// Historial de una cuenta. keepPreviousData mantiene la página anterior visible
// mientras carga la siguiente, así la tabla no parpadea al paginar.
export function useMovements(accountId: string | undefined, page: number) {
  return useQuery<MovementPage, ApiError>({
    queryKey: queryKeys.movements.page(accountId ?? '', page),
    queryFn: () => movementService.list(accountId!, page),
    enabled: Boolean(accountId),
    placeholderData: keepPreviousData,
  })
}
