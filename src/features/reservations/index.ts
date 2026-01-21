/**
 * Reservations Module
 * Handles session reservations, attendance, and online requests
 */

// Services
export { reservationApi } from './services/reservationApi'
export { attendanceApi } from './services/attendanceApi'
export { onlineRequestApi } from './services/onlineRequestApi'

// Types
export type {
  Reservation,
  CreateReservationRequest,
  SwitchSessionRequest,
  ReservationFilters,
  ProcessOnlineRequestRequest,
  RecordAttendanceRequest,
  BulkRecordAttendanceRequest,
} from './types/reservation.types'

export {
  ReservationMode,
  ReservationStatus,
  AttendanceStatus,
  OnlineRequestStatus,
} from './types/reservation.types'
