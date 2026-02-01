import type { GroupType } from '@/shared/types/api.types'

export type GroupRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED'

export interface GroupRequest {
  id: number
  subjectId: number
  subjectName?: string
  subjectDegree?: string
  requesterId: number
  requesterName?: string
  requestedGroupType: GroupType
  status: GroupRequestStatus
  supporterIds: number[]
  supporterNames?: Record<number, string>
  justification: string | null
  expiresAt: string
  createdGroupId: number | null
  adminResponse: string | null
  processedByAdminId: number | null
  processedByAdminName?: string
  processedAt: string | null
  createdAt: string
  updatedAt: string
  // Computed properties from backend
  supporterCount: number
  hasMinimumSupporters: boolean
  supportersNeeded: number
  isPending: boolean
  isApproved: boolean
  isRejected: boolean
  isExpired: boolean
  isProcessed: boolean
}

export interface CreateGroupRequestRequest {
  subjectId: number
  requesterId: number
  requestedGroupType: GroupType
  justification?: string
}

export interface AddSupporterRequest {
  studentId: number
}

export interface ProcessGroupRequestRequest {
  adminId: number
  adminResponse?: string
}

export interface GroupRequestFilters {
  subjectId?: number
  requesterId?: number
  requestedGroupType?: GroupType
  status?: GroupRequestStatus
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: 'ASC' | 'DESC'
}

// "Me Interesa" types
export interface SubjectInterestSummary {
  subjectId: number
  subjectName: string
  subjectCode: string
  degreeName: string
  interestedCount: number
}

export interface MarkInterestRequest {
  subjectId: number
  requesterId: number
}
