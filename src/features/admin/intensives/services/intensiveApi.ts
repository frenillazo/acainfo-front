import { apiClient } from '@/shared/services/apiClient'
import type {
  Intensive,
  IntensiveFilters,
  IntensivePageResponse,
  CreateIntensiveRequest,
  UpdateIntensiveRequest,
  IntensiveSessionEntry,
  BulkCreateIntensiveSessionsRequest,
} from '../types/intensive.types'
import type { Session } from '../../types/admin.types'

export const intensiveApi = {
  // GET /api/intensives
  list: async (filters: IntensiveFilters = {}): Promise<IntensivePageResponse> => {
    const response = await apiClient.get<IntensivePageResponse>('/intensives', {
      params: filters,
    })
    return response.data
  },

  // GET /api/intensives/{id}
  getById: async (id: number): Promise<Intensive> => {
    const response = await apiClient.get<Intensive>(`/intensives/${id}`)
    return response.data
  },

  // POST /api/intensives
  create: async (data: CreateIntensiveRequest): Promise<Intensive> => {
    const response = await apiClient.post<Intensive>('/intensives', data)
    return response.data
  },

  // PATCH /api/intensives/{id}
  update: async (id: number, data: UpdateIntensiveRequest): Promise<Intensive> => {
    const response = await apiClient.patch<Intensive>(`/intensives/${id}`, data)
    return response.data
  },

  // DELETE /api/intensives/{id}
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/intensives/${id}`)
  },

  // POST /api/intensives/{id}/cancel
  cancel: async (id: number): Promise<Intensive> => {
    const response = await apiClient.post<Intensive>(`/intensives/${id}/cancel`)
    return response.data
  },

  // POST /api/intensives/{id}/sessions/bulk → returns the IDs of the created sessions
  createSessionsBulk: async (
    id: number,
    entries: IntensiveSessionEntry[]
  ): Promise<number[]> => {
    const body: BulkCreateIntensiveSessionsRequest = { entries }
    const response = await apiClient.post<number[]>(
      `/intensives/${id}/sessions/bulk`,
      body
    )
    return response.data
  },

  // POST /api/intensives/{id}/sessions → returns the created session ID
  createSession: async (
    id: number,
    entry: IntensiveSessionEntry
  ): Promise<number> => {
    const response = await apiClient.post<number>(`/intensives/${id}/sessions`, entry)
    return response.data
  },

  // GET /api/sessions/intensive/{id} → all sessions of an intensive (enriched)
  listSessions: async (id: number): Promise<Session[]> => {
    const response = await apiClient.get<Session[]>(`/sessions/intensive/${id}`)
    return response.data
  },
}
