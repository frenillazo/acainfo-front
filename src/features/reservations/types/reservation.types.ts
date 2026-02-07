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
 * Simple attendance status recorded after a session.
 * Backend: AttendanceStatus.java
 */
export enum AttendanceStatus {
  /** Student attended the session */
  PRESENT = 'PRESENT',
  /** Student did not attend the session */
  ABSENT = 'ABSENT',
}

/**
 * Status of a request to change from in-person to online attendance.
 * Only applicable for regular group sessions.
 * Backend: OnlineRequestStatus.java
 */
export enum OnlineRequestStatus {
  /** Request is pending teacher approval */
  PENDING = 'PENDING',
  /** Request was approved by the teacher */
  APPROVED = 'APPROVED',
  /** Request was rejected by the teacher */
  REJECTED = 'REJECTED',
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

  // Online request fields
  onlineRequestStatus: OnlineRequestStatus | null
  onlineRequestedAt: string | null
  onlineRequestProcessedAt: string | null
  onlineRequestProcessedById: number | null

  // Attendance fields
  attendanceStatus: AttendanceStatus | null
  attendanceRecordedAt: string | null
  attendanceRecordedById: number | null

  // Audit fields
  createdAt: string
  updatedAt: string

  // Convenience flags from domain (computed by backend)
  isConfirmed: boolean
  isCancelled: boolean
  isInPerson: boolean
  isOnline: boolean
  hasOnlineRequest: boolean
  isOnlineRequestPending: boolean
  isOnlineRequestApproved: boolean
  isOnlineRequestRejected: boolean
  hasAttendanceRecorded: boolean
  wasPresent: boolean
  wasAbsent: boolean
  canBeCancelled: boolean
  canRequestOnline: boolean
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
 * Backend: ReservationFilters.java
 */
export interface ReservationFilters {
  studentId?: number
  sessionId?: number
  enrollmentId?: number
  status?: ReservationStatus
  mode?: ReservationMode
  onlineRequestStatus?: OnlineRequestStatus
  attendanceStatus?: AttendanceStatus
  hasAttendanceRecorded?: boolean
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: 'ASC' | 'DESC'
}

/**
 * Request to process (approve/reject) an online attendance request.
 * Backend: ProcessOnlineRequestRequest.java
 */
export interface ProcessOnlineRequestRequest {
  approved: boolean
}

/**
 * Request to record attendance for a single reservation.
 * Backend: RecordAttendanceRequest.java
 */
export interface RecordAttendanceRequest {
  status: AttendanceStatus
}

/**
 * Request to record attendance for multiple reservations in bulk.
 * Backend: BulkRecordAttendanceRequest.java
 */
export interface BulkRecordAttendanceRequest {
  /** Map of reservationId to AttendanceStatus */
  attendanceMap: Record<number, AttendanceStatus>
}
