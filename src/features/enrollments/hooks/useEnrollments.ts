import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { enrollmentApi } from '../services/enrollmentApi'
import type { EnrollRequest, ChangeGroupRequest } from '../types/enrollment.types'

export const useEnrollments = (studentId: number) => {
  return useQuery({
    queryKey: ['enrollments', 'student', studentId],
    queryFn: () => enrollmentApi.getByStudentId(studentId),
    enabled: !!studentId,
  })
}

export const useEnrollment = (id: number) => {
  return useQuery({
    queryKey: ['enrollment', id],
    queryFn: () => enrollmentApi.getById(id),
    enabled: !!id,
  })
}

export const useEnroll = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: EnrollRequest) => enrollmentApi.enroll(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['student', 'overview'] })
    },
  })
}

export const useWithdraw = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => enrollmentApi.withdraw(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['student', 'overview'] })
    },
  })
}

export const useChangeGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ChangeGroupRequest }) =>
      enrollmentApi.changeGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['enrollment'] })
    },
  })
}
