import { createBrowserRouter } from 'react-router'
import { routes } from '@/config/routes'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { RootLayout } from './layouts/RootLayout'

// Definición de rutas: cada ruta apunta a una página
export const router = createBrowserRouter([
  {
    path: routes.home,
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: routes.login, element: <LoginPage /> },
      { path: routes.register, element: <RegisterPage /> },
    ],
  },
])
