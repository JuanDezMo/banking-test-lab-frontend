import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { Toaster } from '@/components/ui/sonner'

type ProvidersProps = {
  children: ReactNode
}

// Agrupa los providers globales: caché de peticiones y notificaciones
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
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  )
}
