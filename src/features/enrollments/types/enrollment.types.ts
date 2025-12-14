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
  isActive: boolean
  isOnWaitingList: boolean
  isWithdrawn: boolean
  canBeWithdrawn: boolean
}

export type EnrollmentStatus = 'ACTIVE' | 'WAITING_LIST' | 'WITHDRAWN' | 'COMPLETED'

export interface EnrollmentDetail extends Enrollment {
  group: GroupInfo
  subject: SubjectInfo
}

export interface GroupInfo {
  id: number
  type: GroupType
  teacherName: string
  capacity: number | null
  currentEnrollmentCount: number
}

export interface SubjectInfo {
  id: number
  code: string
  name: string
  description: string | null
}

export interface EnrollRequest {
  studentId: number
  groupId: number
}

export interface ChangeGroupRequest {
  newGroupId: number
}
