import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi'
import type {
  CourseFilters,
  CreateCourseRequest,
  UpdateCourseRequest,
} from '../../types/admin.types'

export function useAdminCourses(filters: CourseFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'courses', filters],
    queryFn: () => adminApi.getCourses(filters),
  })
}

export function useAdminCourse(id: number) {
  return useQuery({
    queryKey: ['admin', 'course', id],
    queryFn: () => adminApi.getCourseById(id),
    enabled: !!id,
  })
}

export function useCreateCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    // El componente ya pinta este error en contexto (formulario/modal).
    meta: { silentError: true },
    mutationFn: (data: CreateCourseRequest) => adminApi.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] })
    },
  })
}

export function useUpdateCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    // El componente ya pinta este error en contexto (formulario/modal).
    meta: { silentError: true },
    mutationFn: ({ id, data }: { id: number; data: UpdateCourseRequest }) =>
      adminApi.updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'course'] })
    },
  })
}

export function useDeleteCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => adminApi.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] })
    },
  })
}

export function useCancelCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => adminApi.cancelCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'course'] })
    },
  })
}
