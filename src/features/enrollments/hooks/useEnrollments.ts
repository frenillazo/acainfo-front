import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { enrollmentApi } from '../services/enrollmentApi'
import type { EnrollRequest, ChangeGroupRequest, RejectEnrollmentRequest } from '../types/enrollment.types'
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

export const useApproveEnrollment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => enrollmentApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['enrollment'] })
      queryClient.invalidateQueries({ queryKey: ['pendingEnrollments'] })
    },
  })
}

export const useRejectEnrollment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data?: RejectEnrollmentRequest }) =>
      enrollmentApi.reject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['enrollment'] })
      queryClient.invalidateQueries({ queryKey: ['pendingEnrollments'] })
    },
  })
}

export const usePendingEnrollmentsByGroupId = (groupId: number) => {
  return useQuery({
    queryKey: ['pendingEnrollments', 'group', groupId],
    queryFn: () => enrollmentApi.getPendingApprovalByGroupId(groupId),
    enabled: !!groupId,
  })
}

/**
 * Enrollment statuses that count as "enrolled" (student has a relationship with the subject).
 */
const ENROLLED_STATUSES: readonly string[] = ['ACTIVE', 'PENDING_APPROVAL', 'WAITING_LIST']

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

/**
 * Hook to get the set of subject IDs where the student is enrolled (ACTIVE, PENDING_APPROVAL, WAITING_LIST).
 * Also returns a map of subjectId -> Enrollment for enriching subject cards.
 */
export const useEnrolledSubjectIds = (studentId: number) => {
  const { data: enrollments, isLoading, error } = useEnrollments(studentId)

  const enrolledSubjectIds = useMemo(() => {
    if (!enrollments) return new Set<number>()
    return new Set(
      enrollments
        .filter((e) => ENROLLED_STATUSES.includes(e.status))
        .map((e) => e.subjectId)
    )
  }, [enrollments])

  const enrollmentsBySubjectId = useMemo(() => {
    if (!enrollments) return new Map<number, typeof enrollments[0]>()
    return new Map(
      enrollments
        .filter((e) => ENROLLED_STATUSES.includes(e.status))
        .map((e) => [e.subjectId, e])
    )
  }, [enrollments])

  const hasEnrollment = (subjectId: number) => enrolledSubjectIds.has(subjectId)
  const getEnrollment = (subjectId: number) => enrollmentsBySubjectId.get(subjectId)

  return {
    enrolledSubjectIds,
    enrollmentsBySubjectId,
    hasEnrollment,
    getEnrollment,
    isLoading,
    error,
  }
}

/**
 * Hook to get pending enrollment requests by group for a student.
 * Returns a map of groupId -> enrollment for quick lookup.
 */
export const usePendingEnrollmentsByStudent = (studentId: number) => {
  const { data: enrollments, isLoading, error } = useEnrollments(studentId)

  const pendingByGroupId = useMemo(() => {
    if (!enrollments) return new Map<number, typeof enrollments[0]>()
    const pending = enrollments.filter((e) => e.status === 'PENDING_APPROVAL')
    return new Map(pending.map((e) => [e.groupId, e]))
  }, [enrollments])

  const pendingSubjectIds = useMemo(() => {
    if (!enrollments) return new Set<number>()
    return new Set(
      enrollments
        .filter((e) => e.status === 'PENDING_APPROVAL')
        .map((e) => e.subjectId)
    )
  }, [enrollments])

  const hasPendingEnrollment = (groupId: number) => pendingByGroupId.has(groupId)
  const getPendingEnrollment = (groupId: number) => pendingByGroupId.get(groupId)
  const hasPendingEnrollmentForSubject = (subjectId: number) => pendingSubjectIds.has(subjectId)

  return {
    pendingByGroupId,
    hasPendingEnrollment,
    getPendingEnrollment,
    hasPendingEnrollmentForSubject,
    isLoading,
    error,
  }
}
