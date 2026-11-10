import { Outlet } from 'react-router'
import { AppHeader } from './AppHeader'

// Layout base: header + contenido de la ruta actual (Outlet)
export function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <AppHeader />
      <main id="main-content" className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 md:py-10">
        <Outlet />
      </main>
    </div>
  )
}
