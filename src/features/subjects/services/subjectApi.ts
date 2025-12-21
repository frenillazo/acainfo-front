import { apiClient } from '@/shared/services/apiClient'
import type { PageResponse } from '@/shared/types/api.types'
import type { Subject, SubjectFilters, Group, GroupFilters } from '../types/subject.types'

export const subjectApi = {
  // GET /subjects
  getAll: async (filters: SubjectFilters = {}): Promise<PageResponse<Subject>> => {
    const response = await apiClient.get<PageResponse<Subject>>('/subjects', {
      params: filters,
    })
    return response.data
  },

  // GET /subjects/{id}
  getById: async (id: number): Promise<Subject> => {
    const response = await apiClient.get<Subject>(`/subjects/${id}`)
    return response.data
  },

  // GET /subjects/code/{code}
  getByCode: async (code: string): Promise<Subject> => {
    const response = await apiClient.get<Subject>(`/subjects/code/${code}`)
    return response.data
  },
}

export const groupApi = {
  // GET /groups
  getAll: async (filters: GroupFilters = {}): Promise<PageResponse<Group>> => {
    const response = await apiClient.get<PageResponse<Group>>('/groups', {
      params: filters,
    })
    return response.data
  },

  // GET /groups/{id}
  getById: async (id: number): Promise<Group> => {
    const response = await apiClient.get<Group>(`/groups/${id}`)
    return response.data
  },

  // GET /groups?subjectId={subjectId}
  getBySubjectId: async (subjectId: number, status?: string): Promise<PageResponse<Group>> => {
    const response = await apiClient.get<PageResponse<Group>>('/groups', {
      params: { subjectId, status, size: 50 },
    })
    return response.data
  },
}
