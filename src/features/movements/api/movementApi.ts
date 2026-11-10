import { httpClient } from '@/lib/http/httpClient'
import type { MovementPageDto, MovementRepository } from '../types'

// F-10: historial paginado de una cuenta (páginas fijas de 20)
export const movementApi: MovementRepository = {
  list: (accountId: string, page: number) =>
    httpClient.get<MovementPageDto>(`/accounts/${encodeURIComponent(accountId)}/movements`, {
      query: { page },
    }),
}
