import { Navigate, Outlet, useLocation } from 'react-router'
import type { Role } from '@/features/auth/types'
import { homePathForRole, routes } from '@/config/routes'
import { selectUser, useAuthStore } from '@/store/authStore'

type ProtectedRouteProps = {
  // Roles permitidos; si se omite, basta con tener sesión
  roles?: Role[]
}

// Guarda de rutas privadas: sin sesión → login; rol incorrecto → inicio de su rol
export function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const user = useAuthStore(selectUser)
  const location = useLocation()

  if (!user) {
    return <Navigate to={routes.login} replace state={{ from: location.pathname }} />
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={homePathForRole(user.role)} replace />
  }
  return <Outlet />
}
