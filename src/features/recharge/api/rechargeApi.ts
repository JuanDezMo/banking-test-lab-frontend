import { httpClient } from '@/lib/http/httpClient'
import type { RechargeMovementDto, RechargeRepository, RechargeRequest } from '../types'

export const rechargeApi: RechargeRepository = {
  create: (request: RechargeRequest, idempotencyKey: string) =>
    httpClient.post<RechargeMovementDto>('/recharge', request, {
      headers: { 'Idempotency-Key': idempotencyKey },
    }),
}
