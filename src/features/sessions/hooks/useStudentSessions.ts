import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { sessionApi } from '../services/sessionApi'
import { sessionKeys } from './useSessions'
import type { Session, StudentSession } from '../types/session.types'
import type { Enrollment } from '@/features/enrollments/types/enrollment.types'

interface UseStudentSessionsOptions {
  includeAlternatives?: boolean
}

interface UseStudentSessionsResult {
  sessions: StudentSession[]
  isLoading: boolean
  error: Error | null
}

/**
 * Hook that fetches sessions for a student, optionally including
 * alternative sessions from other courses of the same subjects.
 *
 * When includeAlternatives is true:
 * - Fetches sessions for all subjects the student is enrolled in
 * - Marks each session as isOwnSession or isAlternative
 *
 * When includeAlternatives is false (default):
 * - Only returns sessions from the student's enrolled courses
 * - All sessions are marked as isOwnSession=true, isAlternative=false
 */
export function useStudentSessions(
  enrollments: Enrollment[] | undefined,
  options: UseStudentSessionsOptions = {}
): UseStudentSessionsResult {
  const { includeAlternatives = false } = options

  // Get active enrollments and their course/subject IDs
  const activeEnrollments = useMemo(() => {
    if (!enrollments) return []
    return enrollments.filter((e) => e.isActive || e.isOnWaitingList)
  }, [enrollments])

  const enrolledCourseIds = useMemo(() => {
    return new Set(activeEnrollments.map((e) => e.courseId))
  }, [activeEnrollments])

  const enrolledSubjectIds = useMemo(() => {
    return [...new Set(activeEnrollments.map((e) => e.subjectId))]
  }, [activeEnrollments])

  // When not including alternatives, fetch sessions for enrolled courses only
  const courseQueries = useQueries({
    queries: !includeAlternatives
      ? activeEnrollments.map((enrollment) => ({
          queryKey: sessionKeys.byCourse(enrollment.courseId),
          queryFn: () => sessionApi.getSessionsByCourse(enrollment.courseId),
          enabled: !!enrollment.courseId,
        }))
      : [],
  })

  // When including alternatives, fetch sessions for all subjects
  const subjectQueries = useQueries({
    queries: includeAlternatives
      ? enrolledSubjectIds.map((subjectId) => ({
          queryKey: sessionKeys.bySubject(subjectId),
          queryFn: () => sessionApi.getSessionsBySubject(subjectId),
          enabled: !!subjectId,
        }))
      : [],
  })

  // Combine and process the results
  const result = useMemo((): UseStudentSessionsResult => {
    const queries = includeAlternatives ? subjectQueries : courseQueries

    const isLoading = queries.some((q) => q.isLoading)
    const error = queries.find((q) => q.error)?.error as Error | null

    if (isLoading || error) {
      return { sessions: [], isLoading, error }
    }

    // Collect all sessions from all queries
    const allSessions: Session[] = queries
      .filter((q) => q.data)
      .flatMap((q) => q.data as Session[])

    // Remove duplicates by session ID (in case sessions appear in multiple queries)
    const uniqueSessions = Array.from(
      new Map(allSessions.map((s) => [s.id, s])).values()
    )

    // Mark each session as own or alternative
    const studentSessions: StudentSession[] = uniqueSessions.map((session) => ({
      ...session,
      isOwnSession: enrolledCourseIds.has(session.courseId),
      isAlternative: !enrolledCourseIds.has(session.courseId),
    }))

    // Sort by date and start time
    studentSessions.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date)
      if (dateCompare !== 0) return dateCompare
      return a.startTime.localeCompare(b.startTime)
    })

    return { sessions: studentSessions, isLoading: false, error: null }
  }, [includeAlternatives, subjectQueries, courseQueries, enrolledCourseIds])

  return result
}
