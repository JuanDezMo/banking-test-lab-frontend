import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ApiError } from '@/lib/http/ApiError'
import { queryKeys } from '@/lib/queryKeys'
import type { TransferFormValues } from '../schemas'
import { transferService } from '../services/transferService'
import type { TransferResult } from '../types'

type TransferVariables = { values: TransferFormValues; idempotencyKey: string }

// Transferencia (F-09): al terminar se refrescan saldos y movimientos
export function useTransfer() {
  const queryClient = useQueryClient()
  return useMutation<TransferResult, ApiError, TransferVariables>({
    mutationFn: ({ values, idempotencyKey }) => transferService.transfer(values, idempotencyKey),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.movements.all }),
      ])
    },
  })
}
