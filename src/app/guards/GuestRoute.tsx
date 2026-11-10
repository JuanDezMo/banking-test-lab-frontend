import { Navigate, Outlet, useLocation } from 'react-router'
import { homePathForRole } from '@/config/routes'
import { selectUser, useAuthStore } from '@/store/authStore'

type GuestLocationState = { from?: string } | null

// Guarda de rutas públicas (inicio, login, registro). Con sesión redirige a la página
// que el usuario intentaba abrir (state.from) o al inicio de su rol.
export function GuestRoute() {
  const user = useAuthStore(selectUser)
  const location = useLocation()

  if (user) {
    const from = (location.state as GuestLocationState)?.from
    return <Navigate to={from ?? homePathForRole(user.role)} replace />
  }
  return <Outlet />
}
