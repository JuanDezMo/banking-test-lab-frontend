import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { accountKeys } from '@/features/accounts/hooks/useAccounts'
import { movementKeys } from '@/features/movements/hooks/useMovements'
import type { ApiError } from '@/lib/http/ApiError'
import { newIdempotencyKey } from '@/lib/idempotency'
import type { RechargeFormValues } from '../schemas'
import { rechargeService, requestFingerprint, toRechargeRequest } from '../services/rechargeService'
import type { RechargeMovementDto } from '../types'

// Recarga (F-08, solo operator).
// Idempotencia: si se reintenta con los MISMOS valores tras un error, se reutiliza la
// misma Idempotency-Key (la API no duplica la recarga). Valores distintos = key nueva.
export function useRecharge() {
  const queryClient = useQueryClient()
  const lastAttempt = useRef<{ fingerprint: string; key: string } | null>(null)

  return useMutation<RechargeMovementDto, ApiError, RechargeFormValues>({
    mutationFn: (values) => {
      const request = toRechargeRequest(values)
      const fingerprint = requestFingerprint(request)
      const key =
        lastAttempt.current?.fingerprint === fingerprint
          ? lastAttempt.current.key
          : newIdempotencyKey()
      lastAttempt.current = { fingerprint, key }
      return rechargeService.recharge(request, key)
    },
    onSuccess: async () => {
      // Operación terminada: la próxima recarga es una operación nueva
      lastAttempt.current = null
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: accountKeys.all }),
        queryClient.invalidateQueries({ queryKey: movementKeys.all }),
      ])
    },
  })
}
