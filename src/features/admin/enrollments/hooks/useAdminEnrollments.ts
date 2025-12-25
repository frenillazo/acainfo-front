import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { enrollmentApi } from '@/features/enrollments/services/enrollmentApi'
import type { EnrollRequest, ChangeGroupRequest, EnrollmentStatus } from '@/features/enrollments/types/enrollment.types'

export interface AdminEnrollmentFilters {
  studentId?: number
  groupId?: number
  status?: EnrollmentStatus
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: 'ASC' | 'DESC'
}

export function useAdminEnrollments(filters: AdminEnrollmentFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'enrollments', filters],
    queryFn: () => enrollmentApi.getAll(filters),
  })
}

export function useAdminEnrollment(id: number) {
  return useQuery({
    queryKey: ['admin', 'enrollment', id],
    queryFn: () => enrollmentApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateEnrollment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: EnrollRequest) => enrollmentApi.enroll(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
    },
  })
}

export function useWithdrawEnrollment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => enrollmentApi.withdraw(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'enrollment'] })
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
    },
  })
}

export function useChangeEnrollmentGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ChangeGroupRequest }) =>
      enrollmentApi.changeGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'enrollment'] })
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
    },
  })
}
