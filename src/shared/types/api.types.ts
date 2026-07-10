// Pagination - matches backend: page, size (not pageNumber, pageSize)
export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  empty?: boolean
}

export interface PaginationParams {
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: 'ASC' | 'DESC'
}

// API Error
export interface ApiError {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}

// Common enums
export type CourseStatus = 'OPEN' | 'CLOSED' | 'CANCELLED'
export type SessionStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED'
export type SessionType = 'REGULAR' | 'EXTRA'
export type SessionMode = 'IN_PERSON' | 'ONLINE' | 'DUAL'
export type Classroom = 'AULA_PORTAL1' | 'AULA_PORTAL2' | 'AULA_VIRTUAL'
export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'

// Short labels for days of week (Spanish abbreviations)
export const DAY_OF_WEEK_SHORT_LABELS: Record<DayOfWeek, string> = {
  MONDAY: 'L',
  TUESDAY: 'M',
  WEDNESDAY: 'X',
  THURSDAY: 'J',
  FRIDAY: 'V',
  SATURDAY: 'S',
  SUNDAY: 'D',
}
