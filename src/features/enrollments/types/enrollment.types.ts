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
  createdAt: string
  updatedAt: string
  isActive: boolean
  isOnWaitingList: boolean
  isWithdrawn: boolean
  isCompleted: boolean
  wasPromotedFromWaitingList: boolean
  canBeWithdrawn: boolean
  // Enriched data from backend
  studentName: string
  subjectName: string
  subjectCode: string
  groupType: GroupType
  teacherName: string
}

export type EnrollmentStatus = 'ACTIVE' | 'WAITING_LIST' | 'WITHDRAWN' | 'COMPLETED'

// EnrollmentDetail is now the same as Enrollment since backend returns enriched data
export type EnrollmentDetail = Enrollment

export interface EnrollRequest {
  studentId: number
  groupId: number
}

export interface ChangeGroupRequest {
  newGroupId: number
}
