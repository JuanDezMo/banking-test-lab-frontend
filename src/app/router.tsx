import { createBrowserRouter } from 'react-router'
import { routes } from '@/config/routes'
import { AccountDetailPage } from '@/pages/AccountDetailPage'
import { AccountsPage } from '@/pages/AccountsPage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { OperatorPage } from '@/pages/OperatorPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { TransferPage } from '@/pages/TransferPage'
import { GuestRoute } from './guards/GuestRoute'
import { ProtectedRoute } from './guards/ProtectedRoute'
import { AppLayout } from './layouts/AppLayout'
import { AuthLayout } from './layouts/AuthLayout'

// Rutas: las guardas deciden quién entra; los layouts, cómo se ve cada grupo
export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      // Público: solo invitados (con sesión redirige al inicio del rol)
      { element: <GuestRoute />, children: [{ path: routes.home, element: <HomePage /> }] },
      // Cliente
      {
        element: <ProtectedRoute roles={['customer']} />,
        children: [
          { path: routes.accounts, element: <AccountsPage /> },
          { path: routes.accountDetail, element: <AccountDetailPage /> },
          { path: routes.transfer, element: <TransferPage /> },
        ],
      },
      // Operador
      {
        element: <ProtectedRoute roles={['operator']} />,
        children: [{ path: routes.operator, element: <OperatorPage /> }],
      },
    ],
  },
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: routes.login, element: <LoginPage /> },
          { path: routes.register, element: <RegisterPage /> },
        ],
      },
    ],
  },
])
