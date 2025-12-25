import { useQuery } from '@tanstack/react-query'
import { studentApi } from '../services/studentApi'
import { useAuthStore } from '@/features/auth/store/authStore'

interface UseStudentOverviewOptions {
  limit?: number
  enabled?: boolean
}

export const useStudentOverview = (options: UseStudentOverviewOptions = {}) => {
  const { limit = 5, enabled = true } = options
  const { user, hasRole } = useAuthStore()

  // Only enable if user is loaded and has STUDENT role (or enabled is explicitly true and user is student)
  const isStudent = hasRole('STUDENT')
  const shouldFetch = enabled && !!user && isStudent

  return useQuery({
    queryKey: ['student', 'overview', limit],
    queryFn: () => studentApi.getOverview(limit),
    enabled: shouldFetch,
  })
}

export const useStudentOverviewById = (studentId: number, limit = 5) => {
  return useQuery({
    queryKey: ['student', 'overview', studentId, limit],
    queryFn: () => studentApi.getOverviewByStudentId(studentId, limit),
    enabled: !!studentId,
  })
}
