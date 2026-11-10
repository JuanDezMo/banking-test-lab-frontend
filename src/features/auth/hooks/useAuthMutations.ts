import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ApiError } from '@/lib/http/ApiError'
import { useAuthStore } from '@/store/authStore'
import { authService } from '../services/authService'
import type { LoginInput, RegisterInput, TokenPair, User } from '../types'

// Hook de registro: expone mutate, isPending, error y data a la UI
export function useRegister() {
  return useMutation<User, ApiError, RegisterInput>({
    mutationFn: (input) => authService.register(input),
  })
}

// Hook de login: al tener éxito guarda la sesión en el store
export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation<TokenPair, ApiError, LoginInput>({
    mutationFn: (input) => authService.login(input),
    onSuccess: (tokens, input) => setSession(tokens, input.email.trim().toLowerCase()),
  })
}

// Hook de logout: revoca el refresh token y SIEMPRE limpia la sesión local,
// aunque la API falle (por ejemplo, si el token ya había vencido)
export function useLogout() {
  const queryClient = useQueryClient()
  const clear = useAuthStore((state) => state.clear)

  return useMutation<void, ApiError, void>({
    mutationFn: async () => {
      const { refreshToken } = useAuthStore.getState()
      if (refreshToken) await authService.logout(refreshToken)
    },
    onSettled: () => {
      clear()
      queryClient.clear()
    },
  })
}
