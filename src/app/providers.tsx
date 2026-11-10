import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { getGlobalErrorMessage } from '@/lib/errors'

// Toast global para 5xx y errores de red. El id fijo evita apilar el mismo aviso
// cuando fallan varias peticiones a la vez.
function notifyGlobalError(error: unknown) {
  const message = getGlobalErrorMessage(error)
  if (message) toast.error(message, { id: 'global-error' })
}

type ProvidersProps = {
  children: ReactNode
}

// Agrupa los providers globales: tema, caché de peticiones y notificaciones
export function Providers({ children }: ProvidersProps) {
  // useState garantiza una sola instancia de QueryClient por montaje
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({ onError: notifyGlobalError }),
        mutationCache: new MutationCache({ onError: notifyGlobalError }),
        defaultOptions: {
          queries: { retry: 1, refetchOnWindowFocus: false },
        },
      }),
  )

  return (
    // El tema se guarda en localStorage (btl-theme) y se aplica con la clase .dark en <html>.
    // El script anti-parpadeo de next-themes no se ejecuta en una SPA (React no ejecuta
    // <script>), por eso se desactiva aquí y el tema inicial lo aplica index.html.
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="btl-theme"
      scriptProps={{ type: 'application/json' }}
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
