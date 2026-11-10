import { httpClient } from '@/lib/http/httpClient'
import type { AuthRepository, LoginInput, RegisterInput, TokenPair, User } from '../types'

// Implementación HTTP del repositorio: una función por endpoint.
// Registro y login son públicos (auth: false). El refresh lo hace lib/http/tokenRefresh.
export const authApi: AuthRepository = {
  register: (input: RegisterInput) =>
    httpClient.post<User>('/auth/register', input, { auth: false }),
  login: (input: LoginInput) => httpClient.post<TokenPair>('/auth/login', input, { auth: false }),
  logout: (refreshToken: string) => httpClient.post<void>('/auth/logout', { refreshToken }),
}
