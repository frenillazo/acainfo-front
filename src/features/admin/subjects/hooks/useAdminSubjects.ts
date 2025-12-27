import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi'
import type {
  SubjectFilters,
  CreateSubjectRequest,
  UpdateSubjectRequest,
} from '../../types/admin.types'

export const subjectKeys = {
  all: ['subjects'] as const,
  lists: () => [...subjectKeys.all, 'list'] as const,
  list: (filters: SubjectFilters) => [...subjectKeys.lists(), filters] as const,
  details: () => [...subjectKeys.all, 'detail'] as const,
  detail: (id: number) => [...subjectKeys.details(), id] as const,
}

export function useAdminSubjects(filters: SubjectFilters = {}) {
  return useQuery({
    queryKey: subjectKeys.list(filters),
    queryFn: () => adminApi.getSubjects(filters),
  })
}

export function useAdminSubject(id: number) {
  return useQuery({
    queryKey: subjectKeys.detail(id),
    queryFn: () => adminApi.getSubjectById(id),
    enabled: !!id,
  })
}

export function useCreateSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSubjectRequest) => adminApi.createSubject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() })
    },
  })
}

export function useUpdateSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSubjectRequest }) =>
      adminApi.updateSubject(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() })
      queryClient.invalidateQueries({ queryKey: subjectKeys.detail(id) })
    },
  })
}

export function useDeleteSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => adminApi.deleteSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() })
    },
  })
}

export function useArchiveSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => adminApi.archiveSubject(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() })
      queryClient.invalidateQueries({ queryKey: subjectKeys.detail(id) })
    },
  })
}
