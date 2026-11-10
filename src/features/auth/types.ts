import type { components } from '@/lib/api-types'

// Modelos del dominio de autenticación (alias de los tipos generados desde openapi.yaml)
export type User = components['schemas']['User']
export type Role = components['schemas']['Role']
export type TokenPair = components['schemas']['TokenPair']

export type RegisterInput = components['schemas']['RegisterRequest']
export type LoginInput = components['schemas']['LoginRequest']

// Contrato del acceso a datos: el servicio depende de esta interfaz, no de HTTP
export interface AuthRepository {
  register(input: RegisterInput): Promise<User>
  login(input: LoginInput): Promise<TokenPair>
  logout(refreshToken: string): Promise<void>
}

// Estado de navegación que recibe la página de login (por ejemplo, tras registrarse)
export type LoginLocationState = { email?: string }
