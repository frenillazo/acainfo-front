import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, type ReactNode } from 'react'
import { toast } from '@/shared/hooks/useToast'
import { getApiErrorMessage } from '@/shared/utils/apiError'

interface QueryProviderProps {
  children: ReactNode
}

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      /**
       * Marca las mutaciones cuyo componente ya pinta el error en contexto
       * (banner en el formulario o el modal). Sin esto saldría además un toast
       * diciendo lo mismo.
       */
      silentError?: boolean
    }
  }
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // Red de seguridad: sin esto, una mutación sin onError falla en
        // silencio y el usuario cree que su acción se completó.
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            if (mutation.meta?.silentError) return
            toast.error(
              getApiErrorMessage(error, 'No se ha podido completar la acción. Inténtalo de nuevo.')
            )
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
