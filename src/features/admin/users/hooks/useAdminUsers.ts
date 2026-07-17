import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi'
import type { UserFilters } from '../../types/admin.types'

export function useAdminUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: () => adminApi.getUsers(filters),
    // Al cambiar de página o de filtro, mantener la tabla anterior mientras
    // llega la nueva: la query key nueva vacía los datos y la lista parpadea.
    placeholderData: keepPreviousData,
  })
}

export function useAdminUser(id: number) {
  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: () => adminApi.getUserById(id),
    enabled: !!id,
  })
}
