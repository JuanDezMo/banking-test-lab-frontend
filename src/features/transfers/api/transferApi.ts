import { httpClient } from '@/lib/http/httpClient'
import type { TransferRepository, TransferRequest, TransferResult } from '../types'

export const transferApi: TransferRepository = {
  create: (request: TransferRequest, idempotencyKey: string) =>
    httpClient.post<TransferResult>('/transfers', request, {
      headers: { 'Idempotency-Key': idempotencyKey },
    }),
}
