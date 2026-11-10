import { createBrowserRouter } from 'react-router'
import { routes } from '@/config/routes'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { AppLayout } from './layouts/AppLayout'
import { AuthLayout } from './layouts/AuthLayout'

// Definición de rutas: cada layout agrupa las páginas que comparten estructura
export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [{ path: routes.home, element: <HomePage /> }],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: routes.login, element: <LoginPage /> },
      { path: routes.register, element: <RegisterPage /> },
    ],
  },
])
