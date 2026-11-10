import { authApi } from '../api/authApi'
import type { AuthRepository, LoginInput, RegisterInput } from '../types'

// Casos de uso de autenticación. Recibe el repositorio por parámetro (inversión de
// dependencias), así en las pruebas se puede usar un repositorio falso.
export function createAuthService(repository: AuthRepository) {
  return {
    register: (input: RegisterInput) => repository.register(input),
    login: (input: LoginInput) => repository.login(input),
    logout: (refreshToken: string) => repository.logout(refreshToken),
  }
}

export type AuthService = ReturnType<typeof createAuthService>

// Instancia por defecto conectada a la API real
export const authService = createAuthService(authApi)
