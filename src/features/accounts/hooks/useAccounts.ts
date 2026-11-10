import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ApiError } from '@/lib/http/ApiError'
import { accountService } from '../services/accountService'
import type { Account, CreateAccountInput } from '../types'

// Claves de caché de cuentas en un solo lugar
export const accountKeys = {
  all: ['accounts'] as const,
  detail: (id: string) => ['accounts', id] as const,
}

// Lista de cuentas del cliente (F-06)
export function useAccounts() {
  return useQuery<Account[], ApiError>({
    queryKey: accountKeys.all,
    queryFn: () => accountService.list(),
  })
}

// Una cuenta por id (F-07). 400 y 404 no se reintentan: el resultado no cambiará.
export function useAccount(id: string | undefined) {
  return useQuery<Account, ApiError>({
    queryKey: accountKeys.detail(id ?? ''),
    queryFn: () => accountService.getById(id!),
    enabled: Boolean(id),
    retry: (failureCount, error) => ![400, 404].includes(error.status) && failureCount < 1,
  })
}

// Crear cuenta (F-05): al terminar invalida la lista para volver a pedirla
export function useCreateAccount() {
  const queryClient = useQueryClient()
  return useMutation<Account, ApiError, CreateAccountInput>({
    mutationFn: (input) => accountService.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: accountKeys.all }),
  })
}
