import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi'
import type {
  TeacherFilters,
  CreateTeacherRequest,
  UpdateTeacherRequest,
} from '../../types/admin.types'

export function useAdminTeachers(filters: TeacherFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'teachers', filters],
    queryFn: () => adminApi.getTeachers(filters),
  })
}

export function useAdminTeacher(id: number) {
  return useQuery({
    queryKey: ['admin', 'teachers', id],
    queryFn: () => adminApi.getTeacherById(id),
    enabled: !!id,
  })
}

export function useDeleteTeacher() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => adminApi.deleteTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'teachers'] })
    },
  })
}

export function useCreateTeacher() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTeacherRequest) => adminApi.createTeacher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'teachers'] })
    },
  })
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTeacherRequest }) =>
      adminApi.updateTeacher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'teachers'] })
    },
  })
}
