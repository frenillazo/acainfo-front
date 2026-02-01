import type { GroupType, GroupStatus } from '@/shared/types/api.types'

export type Degree = 'INGENIERIA_INFORMATICA' | 'INGENIERIA_INDUSTRIAL'
export type SubjectStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'

export interface Subject {
  id: number
  code: string
  name: string
  displayName: string
  degree: Degree
  year: number | null
  status: SubjectStatus
  currentGroupCount: number
  active: boolean
  archived: boolean
  canCreateGroup: boolean
  createdAt: string
  updatedAt: string
}

export interface SubjectFilters {
  code?: string
  searchTerm?: string
  degree?: Degree
  year?: number
  status?: SubjectStatus
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: 'ASC' | 'DESC'
}

export interface Group {
  id: number
  name: string
  subjectId: number
  teacherId: number
  type: GroupType
  status: GroupStatus
  currentEnrollmentCount: number
  capacity: number | null
  availableSeats: number | null
  maxCapacity: number | null
  pricePerHour: number
  // Enriched data
  subjectName: string
  subjectCode: string
  teacherName: string
  createdAt: string
  updatedAt: string
  // Convenience flags
  isOpen: boolean
  canEnroll: boolean
  isIntensive: boolean
  isRegular: boolean
}

export interface GroupFilters {
  subjectId?: number
  teacherId?: number
  type?: GroupType
  status?: GroupStatus
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: 'ASC' | 'DESC'
}
