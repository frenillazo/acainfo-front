import { apiClient } from '@/shared/services/apiClient'
import type { PageResponse } from '@/shared/types/api.types'
import type {
  Reservation,
  EnrichedReservation,
  CreateReservationRequest,
  SwitchSessionRequest,
  ReservationFilters,
} from '../types/reservation.types'

/**
 * Reservation API Service
 * Handles session reservations CRUD operations
 * Backend: ReservationController.java
 */
export const reservationApi = {
  /**
   * Create a new reservation.
   * POST /api/reservations
   * @param data - Reservation creation data
   * @returns Created reservation
   */
  create: async (data: CreateReservationRequest): Promise<Reservation> => {
    const response = await apiClient.post<Reservation>('/reservations', data)
    return response.data
  },

  /**
   * Get reservation by ID.
   * GET /api/reservations/{id}
   * @param id - Reservation ID
   * @returns Reservation details
   */
  getById: async (id: number): Promise<Reservation> => {
    const response = await apiClient.get<Reservation>(`/reservations/${id}`)
    return response.data
  },

  /**
   * Get reservations with filters (pagination + sorting + filtering).
   * GET /api/reservations?studentId=1&sessionId=2&status=CONFIRMED&...
   * @param filters - Query filters
   * @returns Paginated list of reservations
   */
  getWithFilters: async (
    filters: ReservationFilters = {}
  ): Promise<PageResponse<Reservation>> => {
    const response = await apiClient.get<PageResponse<Reservation>>('/reservations', {
      params: filters,
    })
    return response.data
  },

  /**
   * Get reservations for a session.
   * GET /api/reservations/session/{sessionId}
   * @param sessionId - Session ID
   * @returns List of reservations for the session
   */
  getBySessionId: async (sessionId: number): Promise<Reservation[]> => {
    const response = await apiClient.get<Reservation[]>(`/reservations/session/${sessionId}`)
    return response.data
  },

  /**
   * Get reservations for a student.
   * GET /api/reservations/student/{studentId}
   * @param studentId - Student ID
   * @returns List of reservations for the student
   */
  getByStudentId: async (studentId: number): Promise<Reservation[]> => {
    const response = await apiClient.get<Reservation[]>(`/reservations/student/${studentId}`)
    return response.data
  },

  /**
   * Cancel a reservation.
   * DELETE /api/reservations/{id}
   * @param id - Reservation ID
   * @param studentId - Student ID (for authorization)
   * @returns Updated reservation with CANCELLED status
   */
  cancel: async (id: number, studentId: number): Promise<Reservation> => {
    const response = await apiClient.delete<Reservation>(`/reservations/${id}`, {
      params: { studentId },
    })
    return response.data
  },

  /**
   * Switch to a different session.
   * PUT /api/reservations/{id}/switch-session
   * @param id - Reservation ID
   * @param studentId - Student ID (for authorization)
   * @param data - New session data
   * @returns Updated reservation
   */
  switchSession: async (
    id: number,
    studentId: number,
    data: SwitchSessionRequest
  ): Promise<Reservation> => {
    const response = await apiClient.put<Reservation>(
      `/reservations/${id}/switch-session`,
      data,
      {
        params: { studentId },
      }
    )
    return response.data
  },

  /**
   * Get enriched reservations for a student (with session details).
   * GET /api/reservations/student/{studentId}/enriched
   */
  getEnrichedByStudentId: async (studentId: number): Promise<EnrichedReservation[]> => {
    const response = await apiClient.get<EnrichedReservation[]>(
      `/reservations/student/${studentId}/enriched`
    )
    return response.data
  },

  /**
   * Generate reservations for a session from enrolled students.
   * POST /api/sessions/{sessionId}/reservations/generate?groupId=1
   * Admin only operation.
   * Backend: ReservationGenerationController.java
   * @param sessionId - Session ID
   * @param groupId - Group ID to generate reservations for
   * @returns List of generated reservations
   */
  generateForSession: async (sessionId: number, groupId: number): Promise<Reservation[]> => {
    const response = await apiClient.post<Reservation[]>(
      `/sessions/${sessionId}/reservations/generate`,
      null,
      {
        params: { groupId },
      }
    )
    return response.data
  },
}
