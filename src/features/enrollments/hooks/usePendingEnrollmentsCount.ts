import { useQuery } from '@tanstack/react-query'
import { enrollmentApi } from '../services/enrollmentApi'

/**
 * Nº de solicitudes esperando respuesta del admin.
 *
 * Desde que la expiración automática a 48 h está apagada (16-jul-2026), las
 * solicitudes esperan indefinidamente y no hay emails: este contador es la única
 * forma de que el admin sepa que alguien está esperando sin entrar a la página.
 *
 * Reutiliza el listado de pendientes (su totalElements), sin endpoint nuevo.
 */
export function usePendingEnrollmentsCount(enabled = true) {
  const { data } = useQuery({
    queryKey: ['pendingEnrollments', 'count'],
    queryFn: () => enrollmentApi.getAll({ status: 'PENDING_APPROVAL', size: 1 }),
    enabled,
    staleTime: 1000 * 60,
  })

  return data?.totalElements ?? 0
}
