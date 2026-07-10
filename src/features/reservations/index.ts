/**
 * Reservations Module
 * Handles session reservations
 */

// Services
export { reservationApi } from './services/reservationApi'

// Types
export type {
  Reservation,
  EnrichedReservation,
  CreateReservationRequest,
  SwitchSessionRequest,
  ReservationFilters,
} from './types/reservation.types'

export {
  ReservationMode,
  ReservationStatus,
} from './types/reservation.types'

// Hooks
export { useStudentReservations, useSessionReservations, useReservation } from './hooks/useReservations'
export { useCreateReservation, useCancelReservation, useSwitchSession } from './hooks/useReservationMutations'
export { useEnrichedReservations } from './hooks/useEnrichedReservations'

// Components
export { ReservationSection } from './components/ReservationSection'
