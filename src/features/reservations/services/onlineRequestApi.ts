import { apiClient } from '@/shared/services/apiClient'
import type { Reservation, ProcessOnlineRequestRequest } from '../types/reservation.types'

/**
 * Online Request API Service
 * Handles online attendance requests and their processing
 * Backend: OnlineRequestController.java
 */
export const onlineRequestApi = {
  /**
   * Request online attendance for a reservation.
   * POST /api/reservations/{id}/online-request
   * Student requests to change from in-person to online attendance.
   * Requires 6+ hours advance notice and teacher approval (regular groups only).
   * Requires ADMIN or STUDENT role.
   * @param id - Reservation ID
   * @param studentId - Student ID (for authorization)
   * @returns Updated reservation with pending online request
   */
  requestOnline: async (id: number, studentId: number): Promise<Reservation> => {
    const response = await apiClient.post<Reservation>(
      `/reservations/${id}/online-request`,
      null,
      {
        params: { studentId },
      }
    )
    return response.data
  },

  /**
   * Process (approve/reject) an online attendance request.
   * PUT /api/reservations/{id}/online-request/process
   * Teacher approves or rejects student's request to attend online.
   * Requires ADMIN or TEACHER role.
   * @param id - Reservation ID
   * @param teacherId - Teacher ID processing the request
   * @param data - Approval decision (true = approve, false = reject)
   * @returns Updated reservation with processed online request
   */
  processRequest: async (
    id: number,
    teacherId: number,
    data: ProcessOnlineRequestRequest
  ): Promise<Reservation> => {
    const response = await apiClient.put<Reservation>(
      `/reservations/${id}/online-request/process`,
      data,
      {
        params: { teacherId },
      }
    )
    return response.data
  },

  /**
   * Get pending online requests for a teacher.
   * GET /api/online-requests/pending?teacherId=1
   * Returns all pending online attendance requests for sessions taught by this teacher.
   * Requires ADMIN or TEACHER role.
   * @param teacherId - Teacher ID
   * @returns List of reservations with pending online requests
   */
  getPendingForTeacher: async (teacherId: number): Promise<Reservation[]> => {
    const response = await apiClient.get<Reservation[]>('/online-requests/pending', {
      params: { teacherId },
    })
    return response.data
  },
}
