import { useMutation } from '@tanstack/react-query'
import type { ApiError } from '@/lib/http/ApiError'
import { authService } from '../services/authService'
import type { LoginInput, RegisterInput, TokenPair, User } from '../types'

// Hook de registro: expone mutate, isPending, error y data a la UI
export function useRegister() {
  return useMutation<User, ApiError, RegisterInput>({
    mutationFn: (input) => authService.register(input),
  })
}

// Hook de login
export function useLogin() {
  return useMutation<TokenPair, ApiError, LoginInput>({
    mutationFn: (input) => authService.login(input),
  })
}
