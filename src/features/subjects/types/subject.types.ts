import type { CourseStatus, DayOfWeek } from '@/shared/types/api.types'

export type Degree = 'INGENIERIA_INFORMATICA' | 'INGENIERIA_INDUSTRIAL'

export interface ScheduleSummary {
  dayOfWeek: DayOfWeek
  startTime: string // Format: "HH:mm"
  endTime: string // Format: "HH:mm"
}
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

export interface Course {
  id: number
  name: string
  subjectId: number
  teacherId: number | null
  status: CourseStatus
  currentEnrollmentCount: number
  /** null = unlimited (virtual/dual course) */
  capacity: number | null
  /** null = unlimited */
  availableSeats: number | null
  /** Informative only */
  pricePerMonth: number | null
  startDate: string // yyyy-MM-dd
  endDate: string // yyyy-MM-dd
  // Enriched data
  subjectName: string
  subjectCode: string
  teacherName: string | null
  createdAt: string
  updatedAt: string
  // Convenience flags
  isOpen: boolean
  canEnroll: boolean
  // Schedule summary
  schedules: ScheduleSummary[]
}

export interface CourseFilters {
  subjectId?: number
  teacherId?: number
  status?: CourseStatus
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: 'ASC' | 'DESC'
}

// Subject interest summary (admin demand view)
export interface SubjectInterestSummary {
  subjectId: number
  subjectName: string
  subjectCode: string
  degreeName: string | null
  interestedCount: number
}
