import { apiClient } from '@/shared/services/apiClient'
import type {
  Reservation,
  RecordAttendanceRequest,
  BulkRecordAttendanceRequest,
} from '../types/reservation.types'

/**
 * Attendance API Service
 * Handles attendance recording operations
 * Backend: AttendanceController.java
 */
export const attendanceApi = {
  /**
   * Record attendance for a single reservation.
   * PUT /api/reservations/{id}/attendance
   * Requires ADMIN or TEACHER role.
   * @param id - Reservation ID
   * @param recordedById - ID of user recording attendance (teacher/admin)
   * @param data - Attendance status (PRESENT/ABSENT)
   * @returns Updated reservation with attendance recorded
   */
  recordSingle: async (
    id: number,
    recordedById: number,
    data: RecordAttendanceRequest
  ): Promise<Reservation> => {
    const response = await apiClient.put<Reservation>(
      `/reservations/${id}/attendance`,
      data,
      {
        params: { recordedById },
      }
    )
    return response.data
  },

  /**
   * Record attendance for all reservations in a session (bulk operation).
   * POST /api/sessions/{sessionId}/attendance
   * Requires ADMIN or TEACHER role.
   * @param sessionId - Session ID
   * @param recordedById - ID of user recording attendance (teacher/admin)
   * @param data - Map of reservationId to AttendanceStatus
   * @returns List of updated reservations with attendance recorded
   */
  recordBulk: async (
    sessionId: number,
    recordedById: number,
    data: BulkRecordAttendanceRequest
  ): Promise<Reservation[]> => {
    const response = await apiClient.post<Reservation[]>(
      `/sessions/${sessionId}/attendance`,
      data,
      {
        params: { recordedById },
      }
    )
    return response.data
  },

  /**
   * Get reservations for a session (for attendance taking).
   * GET /api/sessions/{sessionId}/attendance
   * Requires ADMIN or TEACHER role.
   * @param sessionId - Session ID
   * @returns List of reservations for the session
   */
  getSessionAttendance: async (sessionId: number): Promise<Reservation[]> => {
    const response = await apiClient.get<Reservation[]>(`/sessions/${sessionId}/attendance`)
    return response.data
  },
}
