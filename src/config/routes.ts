// Rutas de la app en un solo lugar, para no repetir strings
export const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  accounts: '/accounts',
  operator: '/operator',
} as const

// Página de inicio de cada rol después de iniciar sesión
export function homePathForRole(role: 'customer' | 'operator'): string {
  return role === 'operator' ? routes.operator : routes.accounts
}
