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
  EnrichedReservation,
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

// Hooks
export { useStudentReservations, useSessionReservations, useReservation } from './hooks/useReservations'
export { useCreateReservation, useCancelReservation, useSwitchSession, useRequestOnline } from './hooks/useReservationMutations'
export { useEnrichedReservations } from './hooks/useEnrichedReservations'

// Components
export { ReservationSection } from './components/ReservationSection'
export { ReservationModeBadge } from './components/ReservationModeBadge'
export { ReservationStatusBadge } from './components/ReservationStatusBadge'
export { OnlineRequestBadge } from './components/OnlineRequestBadge'
export { AttendanceHistoryTable } from './components/AttendanceHistoryTable'

// Pages
export { AttendanceHistoryPage } from './pages/AttendanceHistoryPage'
