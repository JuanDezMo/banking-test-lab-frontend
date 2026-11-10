// Configuración global de Vitest: agrega matchers como toBeInTheDocument()
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Desmonta los componentes renderizados después de cada prueba
afterEach(() => {
  cleanup()
})
