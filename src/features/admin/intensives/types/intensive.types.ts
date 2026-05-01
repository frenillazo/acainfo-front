import type { PageResponse } from '@/shared/types/api.types'
import type { Classroom } from '../../types/admin.types'

export type IntensiveStatus = 'OPEN' | 'CLOSED' | 'CANCELLED'

/**
 * Intensive course (mirror of backend `IntensiveResponse`).
 *
 * Intensives are short-format courses with non-recurring sessions:
 * sessions are created ad-hoc by admin (no Schedule recurrence).
 */
export interface Intensive {
  id: number
  name: string
  subjectId: number
  teacherId: number
  status: IntensiveStatus
  currentEnrollmentCount: number
  capacity: number | null
  maxCapacity: number
  availableSeats: number
  pricePerHour: number
  startDate: string // yyyy-MM-dd (inclusive)
  endDate: string   // yyyy-MM-dd (inclusive)
  // Enriched
  subjectName: string
  subjectCode: string
  teacherName: string
  // Audit
  createdAt: string
  updatedAt: string
  // Convenience flags
  isOpen: boolean
  canEnroll: boolean
}

export interface CreateIntensiveRequest {
  subjectId: number
  teacherId: number
  startDate: string // yyyy-MM-dd
  endDate: string   // yyyy-MM-dd
  capacity?: number
  pricePerHour?: number
}

export interface UpdateIntensiveRequest {
  status?: IntensiveStatus
  capacity?: number
  pricePerHour?: number
  startDate?: string
  endDate?: string
}

export interface IntensiveFilters {
  subjectId?: number
  teacherId?: number
  status?: IntensiveStatus
  searchTerm?: string
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: 'ASC' | 'DESC'
}

export type IntensivePageResponse = PageResponse<Intensive>

/**
 * One date/time/classroom entry for creating an intensive session.
 */
export interface IntensiveSessionEntry {
  date: string         // yyyy-MM-dd
  startTime: string    // HH:mm
  endTime: string      // HH:mm
  classroom: Classroom
}

export interface BulkCreateIntensiveSessionsRequest {
  entries: IntensiveSessionEntry[]
}
