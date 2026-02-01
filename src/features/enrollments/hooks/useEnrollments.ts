import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { enrollmentApi } from '../services/enrollmentApi'
import type { EnrollRequest, ChangeGroupRequest } from '../types/enrollment.types'
import { useMemo } from 'react'

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

/**
 * Hook to get the set of subject IDs where the student has an active enrollment.
 * Useful for checking if a student can access materials for a specific subject.
 */
export const useActiveEnrollmentSubjectIds = (studentId: number) => {
  const { data: enrollments, isLoading, error } = useEnrollments(studentId)

  const activeSubjectIds = useMemo(() => {
    if (!enrollments) return new Set<number>()
    return new Set(
      enrollments
        .filter((e) => e.status === 'ACTIVE')
        .map((e) => e.subjectId)
    )
  }, [enrollments])

  const hasActiveEnrollment = (subjectId: number) => activeSubjectIds.has(subjectId)

  return {
    activeSubjectIds,
    hasActiveEnrollment,
    isLoading,
    error,
  }
}
