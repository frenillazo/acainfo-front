import type { SessionStatus } from '@/shared/types/api.types'

export interface StudentOverviewResponse {
  userId: number
  fullName: string
  email: string
  activeEnrollments: EnrollmentSummary[]
  waitingListCount: number
  upcomingSessions: UpcomingSessionSummary[]
}

export interface EnrollmentSummary {
  enrollmentId: number
  courseId: number
  subjectName: string
  subjectCode: string
  teacherName: string | null
  enrolledAt: string
}

export interface UpcomingSessionSummary {
  sessionId: number
  courseId: number
  enrollmentId: number
  subjectName: string
  subjectCode: string
  date: string
  startTime: string
  endTime: string
  classroom: string
  sessionStatus: SessionStatus
  hasReservation: boolean
}
