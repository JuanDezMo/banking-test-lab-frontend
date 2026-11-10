import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router'
import { vi } from 'vitest'

// Renderiza un componente con los providers que necesita (caché de queries y router)
export function renderWithProviders(ui: ReactElement, { route = '/' } = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </QueryClientProvider>,
  )
}

// Crea una Response JSON como la que devolvería la API
export function jsonResponse(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
  })
}

// Reemplaza fetch global por un mock que devuelve las respuestas indicadas en orden
export function mockFetch(...responses: Response[]) {
  const fetchMock = vi.fn<typeof fetch>()
  for (const response of responses) fetchMock.mockResolvedValueOnce(response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

// Crea un JWT de prueba (firma falsa: el frontend nunca la valida)
export function fakeJwt(claims: { sub?: string; role?: 'customer' | 'operator'; exp?: number }) {
  const encode = (value: object) =>
    btoa(JSON.stringify(value)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')
  const payload = {
    sub: claims.sub ?? '1b7e0000-0000-4000-8000-000000000001',
    role: claims.role ?? 'customer',
    iat: 1_700_000_000,
    exp: claims.exp ?? 1_700_000_900,
  }
  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(payload)}.signature`
}

// Par de tokens de prueba
export function fakeTokens(role: 'customer' | 'operator' = 'customer', refreshToken = 'refresh-1') {
  return {
    accessToken: fakeJwt({ role }),
    refreshToken,
    tokenType: 'Bearer' as const,
    expiresIn: 900 as const,
  }
}
