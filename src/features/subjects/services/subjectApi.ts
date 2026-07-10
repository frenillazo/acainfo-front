import { apiClient } from '@/shared/services/apiClient'
import type { PageResponse } from '@/shared/types/api.types'
import type {
  Subject,
  SubjectFilters,
  SubjectInterestSummary,
  Course,
  CourseFilters,
} from '../types/subject.types'

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

  // ===== Subject interest ("me interesa") =====

  // POST /subjects/{id}/interest (201)
  markInterest: async (subjectId: number): Promise<void> => {
    await apiClient.post(`/subjects/${subjectId}/interest`)
  },

  // DELETE /subjects/{id}/interest (204)
  removeInterest: async (subjectId: number): Promise<void> => {
    await apiClient.delete(`/subjects/${subjectId}/interest`)
  },

  // GET /subjects/{id}/interest/me -> boolean
  hasInterest: async (subjectId: number): Promise<boolean> => {
    const response = await apiClient.get<boolean>(`/subjects/${subjectId}/interest/me`)
    return response.data
  },

  // GET /subjects/interest/mine -> subject ids
  myInterests: async (): Promise<number[]> => {
    const response = await apiClient.get<number[]>('/subjects/interest/mine')
    return response.data
  },

  // GET /subjects/interest-summary (ADMIN)
  interestSummary: async (): Promise<SubjectInterestSummary[]> => {
    const response = await apiClient.get<SubjectInterestSummary[]>('/subjects/interest-summary')
    return response.data
  },
}

export const courseApi = {
  // GET /courses
  getAll: async (filters: CourseFilters = {}): Promise<PageResponse<Course>> => {
    const response = await apiClient.get<PageResponse<Course>>('/courses', {
      params: filters,
    })
    return response.data
  },

  // GET /courses/{id}
  getById: async (id: number): Promise<Course> => {
    const response = await apiClient.get<Course>(`/courses/${id}`)
    return response.data
  },

  // GET /courses?subjectId={subjectId}
  getBySubjectId: async (subjectId: number, status?: string): Promise<PageResponse<Course>> => {
    const response = await apiClient.get<PageResponse<Course>>('/courses', {
      params: { subjectId, status, size: 50 },
    })
    return response.data
  },
}
