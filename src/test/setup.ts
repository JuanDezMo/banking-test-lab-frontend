// Configuración global de Vitest: agrega matchers como toBeInTheDocument()
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Después de cada prueba: desmonta componentes y restaura mocks globales (fetch)
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})
