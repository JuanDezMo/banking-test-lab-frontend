import { httpClient } from '@/lib/http/httpClient'
import type { AuthRepository, LoginInput, RegisterInput, TokenPair, User } from '../types'

// Implementación HTTP del repositorio: una función por endpoint
export const authApi: AuthRepository = {
  register: (input: RegisterInput) => httpClient.post<User>('/auth/register', input),
  login: (input: LoginInput) => httpClient.post<TokenPair>('/auth/login', input),
}
