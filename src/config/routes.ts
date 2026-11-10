// Rutas de la app en un solo lugar, para no repetir strings
export const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  accounts: '/accounts',
  accountDetail: '/accounts/:id',
  operator: '/operator',
} as const

// Ruta del detalle de una cuenta, con página opcional del historial
export function accountPath(id: string, page?: number): string {
  const path = `/accounts/${encodeURIComponent(id)}`
  return page && page > 1 ? `${path}?page=${page}` : path
}

// Página de inicio de cada rol después de iniciar sesión
export function homePathForRole(role: 'customer' | 'operator'): string {
  return role === 'operator' ? routes.operator : routes.accounts
}
