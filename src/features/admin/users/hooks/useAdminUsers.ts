import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi'
import type { UserFilters } from '../../types/admin.types'

export function useAdminUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: () => adminApi.getUsers(filters),
  })
}

export function useAdminUser(id: number) {
  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: () => adminApi.getUserById(id),
    enabled: !!id,
  })
}
