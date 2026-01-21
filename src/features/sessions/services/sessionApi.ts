import { apiClient } from '@/shared/services/apiClient'
import type { Session, SessionFilters } from '../types/session.types'
import type { PageResponse } from '@/shared/types/api.types'

export const sessionApi = {
  // Get session by ID
  getSessionById: async (id: number): Promise<Session> => {
    const response = await apiClient.get<Session>(`/sessions/${id}`)
    return response.data
  },

  // Get sessions with filters
  getSessionsWithFilters: async (filters: SessionFilters = {}): Promise<PageResponse<Session>> => {
    const response = await apiClient.get<PageResponse<Session>>('/sessions', {
      params: filters,
    })
    return response.data
  },

  // Get sessions by group
  getSessionsByGroup: async (groupId: number): Promise<Session[]> => {
    const response = await apiClient.get<Session[]>(`/sessions/group/${groupId}`)
    return response.data
  },

  // Get sessions by subject
  getSessionsBySubject: async (subjectId: number): Promise<Session[]> => {
    const response = await apiClient.get<Session[]>(`/sessions/subject/${subjectId}`)
    return response.data
  },

  // Get sessions by schedule
  getSessionsBySchedule: async (scheduleId: number): Promise<Session[]> => {
    const response = await apiClient.get<Session[]>(`/sessions/schedule/${scheduleId}`)
    return response.data
  },
}
