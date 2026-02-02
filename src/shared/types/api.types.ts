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
export type Degree = 'GRADO' | 'MASTER'
export type GroupType = 'REGULAR_Q1' | 'REGULAR_Q2' | 'INTENSIVE_Q1' | 'INTENSIVE_Q2'
export type GroupStatus = 'OPEN' | 'CLOSED' | 'CANCELLED'

// Labels for display
export const GROUP_TYPE_LABELS: Record<GroupType, string> = {
  REGULAR_Q1: 'Cuatrimestre 1',
  REGULAR_Q2: 'Cuatrimestre 2',
  INTENSIVE_Q1: 'Intensivo Enero',
  INTENSIVE_Q2: 'Intensivo Junio',
}
export type SessionStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED'
export type SessionType = 'REGULAR' | 'EXTRA' | 'SCHEDULING'
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
