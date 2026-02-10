import type { GroupType, SessionStatus } from '@/shared/types/api.types'

export interface StudentOverviewResponse {
  userId: number
  fullName: string
  email: string
  activeEnrollments: EnrollmentSummary[]
  waitingListCount: number
  upcomingSessions: UpcomingSessionSummary[]
  paymentStatus: PaymentSummary
}

export interface EnrollmentSummary {
  enrollmentId: number
  groupId: number
  subjectName: string
  subjectCode: string
  groupType: GroupType
  teacherName: string
  enrolledAt: string
}

export interface UpcomingSessionSummary {
  sessionId: number
  groupId: number
  enrollmentId: number
  subjectName: string
  subjectCode: string
  groupType: GroupType
  date: string
  startTime: string
  endTime: string
  classroom: string
  sessionStatus: SessionStatus
  hasReservation: boolean
}

export interface PaymentSummary {
  canAccessResources: boolean
  hasOverduePayments: boolean
  pendingPaymentsCount: number
  totalPendingAmount: number
  nextDueDate: string | null
}
