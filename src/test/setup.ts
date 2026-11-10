// Configuración global de Vitest: agrega matchers como toBeInTheDocument()
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import { useAuthStore } from '@/store/authStore'

// Después de cada prueba: desmonta componentes, restaura mocks globales (fetch)
// y limpia la sesión para que una prueba no afecte a la siguiente
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.useRealTimers()
  useAuthStore.getState().clear()
  sessionStorage.clear()
})
