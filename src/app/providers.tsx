import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { useState, type ReactNode } from 'react'
import { Toaster } from '@/components/ui/sonner'

type ProvidersProps = {
  children: ReactNode
}

// Agrupa los providers globales: tema, caché de peticiones y notificaciones
export function Providers({ children }: ProvidersProps) {
  // useState garantiza una sola instancia de QueryClient por montaje
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, refetchOnWindowFocus: false },
        },
      }),
  )

  return (
    // El tema se guarda en localStorage (btl-theme) y se aplica con la clase .dark en <html>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="btl-theme"
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
