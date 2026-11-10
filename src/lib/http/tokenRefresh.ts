import { env } from '@/config/env'
import type { TokenPair } from '@/features/auth/types'
import { useAuthStore } from '@/store/authStore'

// Promesa de renovación en curso: varias peticiones con 401 simultáneas comparten
// una sola llamada a /auth/refresh (el refresh token es de un solo uso, RN-26).
let refreshInFlight: Promise<string | null> | null = null

async function requestNewTokens(refreshToken: string): Promise<TokenPair | null> {
  try {
    const response = await fetch(`${env.apiBaseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    if (!response.ok) return null
    return (await response.json()) as TokenPair
  } catch {
    return null
  }
}

// Renueva los tokens y devuelve el nuevo access token, o null si la sesión terminó
export function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight

  refreshInFlight = (async () => {
    const { refreshToken, updateTokens, clear } = useAuthStore.getState()
    if (!refreshToken) return null

    const tokens = await requestNewTokens(refreshToken)
    if (!tokens) {
      // Refresh inválido o vencido: se cierra la sesión (las guardas redirigen a /login)
      clear()
      return null
    }
    updateTokens(tokens)
    return tokens.accessToken
  })().finally(() => {
    refreshInFlight = null
  })

  return refreshInFlight
}
