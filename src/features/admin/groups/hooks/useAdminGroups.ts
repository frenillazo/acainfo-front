import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi'
import type {
  GroupFilters,
  CreateGroupRequest,
  UpdateGroupRequest,
} from '../../types/admin.types'

export function useAdminGroups(filters: GroupFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'groups', filters],
    queryFn: () => adminApi.getGroups(filters),
  })
}

export function useAdminGroup(id: number) {
  return useQuery({
    queryKey: ['admin', 'group', id],
    queryFn: () => adminApi.getGroupById(id),
    enabled: !!id,
  })
}

export function useCreateGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateGroupRequest) => adminApi.createGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'groups'] })
    },
  })
}

export function useUpdateGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateGroupRequest }) =>
      adminApi.updateGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'groups'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'group'] })
    },
  })
}

export function useDeleteGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => adminApi.deleteGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'groups'] })
    },
  })
}

export function useCancelGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => adminApi.cancelGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'groups'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'group'] })
    },
  })
}
