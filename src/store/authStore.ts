import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Role, TokenPair } from '@/features/auth/types'
import { decodeAccessToken } from '@/lib/jwt'

// Datos del usuario que el frontend conoce (la API no tiene endpoint /me)
export type SessionUser = {
  id: string
  role: Role
  email: string
}

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  user: SessionUser | null
  // Guarda la sesión a partir del par de tokens; el email viene del formulario de login
  setSession: (tokens: TokenPair, email: string) => void
  // Reemplaza los tokens tras un refresh, conservando el usuario
  updateTokens: (tokens: TokenPair) => void
  clear: () => void
}

const emptySession = { accessToken: null, refreshToken: null, user: null }

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...emptySession,
      setSession: (tokens, email) => {
        const claims = decodeAccessToken(tokens.accessToken)
        if (!claims) {
          set(emptySession)
          return
        }
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user: { id: claims.sub, role: claims.role, email },
        })
      },
      updateTokens: (tokens) => {
        const current = get().user
        if (!current) return
        set({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken })
      },
      clear: () => set(emptySession),
    }),
    {
      name: 'btl-session',
      // sessionStorage: sobrevive a recargar la página y se borra al cerrar la pestaña
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

// Selectores reutilizables (evitan re-renders innecesarios)
export const selectUser = (state: AuthState) => state.user
export const selectIsAuthenticated = (state: AuthState) => state.accessToken !== null
