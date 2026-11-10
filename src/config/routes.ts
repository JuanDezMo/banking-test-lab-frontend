// Rutas de la app en un solo lugar, para no repetir strings
export const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  accounts: '/accounts',
  accountDetail: '/accounts/:id',
  transfer: '/transfer',
  operator: '/operator',
} as const

// Ruta del detalle de una cuenta, con página opcional del historial
export function accountPath(id: string, page?: number): string {
  const path = `/accounts/${encodeURIComponent(id)}`
  return page && page > 1 ? `${path}?page=${page}` : path
}

// Ruta de nueva transferencia, opcionalmente con la cuenta origen preseleccionada
export function transferPath(fromAccountId?: string): string {
  return fromAccountId ? `/transfer?from=${encodeURIComponent(fromAccountId)}` : '/transfer'
}

// Página de inicio de cada rol después de iniciar sesión
export function homePathForRole(role: 'customer' | 'operator'): string {
  return role === 'operator' ? routes.operator : routes.accounts
}
