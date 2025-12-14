import { apiClient } from '@/shared/services/apiClient'
import type { PageResponse, PaginationParams } from '@/shared/types/api.types'
import type {
  Enrollment,
  EnrollmentDetail,
  EnrollRequest,
  ChangeGroupRequest,
} from '../types/enrollment.types'

interface EnrollmentFilters extends PaginationParams {
  studentId?: number
  groupId?: number
  status?: string
}

export const enrollmentApi = {
  // GET /enrollments?studentId=&groupId=&status=&page=&size=
  getAll: async (filters: EnrollmentFilters = {}): Promise<PageResponse<Enrollment>> => {
    const response = await apiClient.get<PageResponse<Enrollment>>('/enrollments', {
      params: filters,
    })
    return response.data
  },

  // GET /enrollments/{id}
  getById: async (id: number): Promise<EnrollmentDetail> => {
    const response = await apiClient.get<EnrollmentDetail>(`/enrollments/${id}`)
    return response.data
  },

  // GET /enrollments/student/{studentId}
  getByStudentId: async (studentId: number): Promise<Enrollment[]> => {
    const response = await apiClient.get<Enrollment[]>(`/enrollments/student/${studentId}`)
    return response.data
  },

  // POST /enrollments
  enroll: async (data: EnrollRequest): Promise<Enrollment> => {
    const response = await apiClient.post<Enrollment>('/enrollments', data)
    return response.data
  },

  // DELETE /enrollments/{id}
  withdraw: async (id: number): Promise<void> => {
    await apiClient.delete(`/enrollments/${id}`)
  },

  // PUT /enrollments/{id}/change-group
  changeGroup: async (id: number, data: ChangeGroupRequest): Promise<Enrollment> => {
    const response = await apiClient.put<Enrollment>(`/enrollments/${id}/change-group`, data)
    return response.data
  },
}
