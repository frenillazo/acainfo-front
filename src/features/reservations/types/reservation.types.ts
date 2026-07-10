/**
 * Reservation Types - Mapped from backend Java enums and DTOs
 * Backend: com.acainfo.reservation.domain.model.*
 */

/**
 * Mode of attendance for a session reservation.
 * Backend: ReservationMode.java
 */
export enum ReservationMode {
  /** Student will attend in person (limited to classroom capacity, typically 24) */
  IN_PERSON = 'IN_PERSON',
  /** Student will attend online */
  ONLINE = 'ONLINE',
}

/**
 * Status of a session reservation.
 * Backend: ReservationStatus.java
 */
export enum ReservationStatus {
  /** Reservation is confirmed and active */
  CONFIRMED = 'CONFIRMED',
  /** Reservation was cancelled by the student */
  CANCELLED = 'CANCELLED',
}

/**
 * Session Reservation entity.
 * Backend: SessionReservation.java + ReservationResponse.java
 */
export interface Reservation {
  id: number
  studentId: number
  studentName: string
  studentEmail: string
  sessionId: number
  enrollmentId: number

  // Reservation fields
  mode: ReservationMode
  status: ReservationStatus
  reservedAt: string // ISO 8601 format: "yyyy-MM-dd'T'HH:mm:ss"
  cancelledAt: string | null

  // Audit fields
  createdAt: string
  updatedAt: string

  // Convenience flags from domain (computed by backend)
  isConfirmed: boolean
  isCancelled: boolean
  isInPerson: boolean
  isOnline: boolean
  canBeCancelled: boolean
}

/**
 * Request to create a new reservation.
 * Backend: CreateReservationRequest.java
 */
export interface CreateReservationRequest {
  studentId: number
  sessionId: number
  enrollmentId: number
  mode: ReservationMode
}

/**
 * Request to switch to a different session.
 * Backend: SwitchSessionRequest.java
 */
export interface SwitchSessionRequest {
  newSessionId: number
}

/**
 * Filters for querying reservations.
 * Backend: ReservationController.java query params
 */
export interface ReservationFilters {
  studentId?: number
  sessionId?: number
  enrollmentId?: number
  status?: ReservationStatus
  mode?: ReservationMode
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: 'ASC' | 'DESC'
}

/**
 * Enriched reservation with session details.
 * Backend: EnrichedReservationResponse.java
 * GET /api/reservations/student/{studentId}/enriched
 */
export interface EnrichedReservation extends Reservation {
  sessionDate: string
  sessionStartTime: string
  sessionEndTime: string
  sessionStatus: string
  classroom: string
  subjectName: string
  subjectCode: string
  teacherName: string | null
}
