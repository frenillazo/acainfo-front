import type { GroupType } from '@/shared/types/api.types'

export interface Enrollment {
  id: number
  studentId: number
  groupId: number
  status: EnrollmentStatus
  waitingListPosition: number | null
  enrolledAt: string
  promotedAt: string | null
  withdrawnAt: string | null
  approvedAt: string | null
  rejectedAt: string | null
  approvedByUserId: number | null
  approvedByUserName: string | null
  rejectionReason: string | null
  createdAt: string
  updatedAt: string
  // Status flags
  isActive: boolean
  isOnWaitingList: boolean
  isWithdrawn: boolean
  isCompleted: boolean
  isPendingApproval: boolean
  isRejected: boolean
  isExpired: boolean
  wasPromotedFromWaitingList: boolean
  canBeWithdrawn: boolean
  canBeApproved: boolean
  canBeRejected: boolean
  // Enriched data from backend
  studentName: string
  studentEmail: string
  subjectId: number
  subjectName: string
  subjectCode: string
  groupType: GroupType
  groupName: string
  teacherName: string
  scheduleSummary: string
  groupCapacity: number
  currentEnrollmentCount: number
}

export type EnrollmentStatus =
  | 'PENDING_APPROVAL'
  | 'ACTIVE'
  | 'WAITING_LIST'
  | 'WITHDRAWN'
  | 'COMPLETED'
  | 'REJECTED'
  | 'EXPIRED'

// EnrollmentDetail is now the same as Enrollment since backend returns enriched data
export type EnrollmentDetail = Enrollment

export interface EnrollRequest {
  studentId: number
  groupId: number
}

export interface ChangeGroupRequest {
  newGroupId: number
}

export interface RejectEnrollmentRequest {
  reason?: string
}
