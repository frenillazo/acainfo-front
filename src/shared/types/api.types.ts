// Pagination
export interface PageResponse<T> {
  content: T[]
  pageNumber: number
  totalPages: number
  totalElements: number
  size: number
  first: boolean
  last: boolean
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
export type SessionStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED'
export type SessionType = 'REGULAR' | 'EXTRA' | 'SCHEDULING'
export type SessionMode = 'IN_PERSON' | 'ONLINE' | 'DUAL'
export type Classroom = 'AULA_PORTAL1' | 'AULA_PORTAL2' | 'AULA_VIRTUAL'
