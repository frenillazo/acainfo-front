import { apiClient } from '@/shared/services/apiClient'
import type { PageResponse } from '@/shared/types/api.types'
import type {
  GroupRequest,
  CreateGroupRequestRequest,
  AddSupporterRequest,
  ProcessGroupRequestRequest,
  GroupRequestFilters,
  SubjectInterestSummary,
  MarkInterestRequest,
} from '../types/groupRequest.types'

// Backend returns Spring Page format, we need to transform it
interface SpringPage<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
  }
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  empty: boolean
}

function transformPage<T>(springPage: SpringPage<T>): PageResponse<T> {
  return {
    content: springPage.content,
    page: springPage.pageable.pageNumber,
    size: springPage.pageable.pageSize,
    totalElements: springPage.totalElements,
    totalPages: springPage.totalPages,
    first: springPage.first,
    last: springPage.last,
    empty: springPage.empty,
  }
}

export const groupRequestApi = {
  // POST /group-requests - Create a new group request
  create: async (data: CreateGroupRequestRequest): Promise<GroupRequest> => {
    const response = await apiClient.post<GroupRequest>('/group-requests', data)
    return response.data
  },

  // GET /group-requests/{id} - Get group request by ID
  getById: async (id: number): Promise<GroupRequest> => {
    const response = await apiClient.get<GroupRequest>(`/group-requests/${id}`)
    return response.data
  },

  // GET /group-requests - Get group requests with filters
  getAll: async (filters: GroupRequestFilters = {}): Promise<PageResponse<GroupRequest>> => {
    const response = await apiClient.get<SpringPage<GroupRequest>>('/group-requests', {
      params: filters,
    })
    return transformPage(response.data)
  },

  // GET /group-requests/{id}/supporters - Get supporters for a group request
  getSupporters: async (id: number): Promise<number[]> => {
    const response = await apiClient.get<number[]>(`/group-requests/${id}/supporters`)
    return response.data
  },

  // POST /group-requests/{id}/support - Add a supporter
  addSupporter: async (id: number, data: AddSupporterRequest): Promise<GroupRequest> => {
    const response = await apiClient.post<GroupRequest>(`/group-requests/${id}/support`, data)
    return response.data
  },

  // DELETE /group-requests/{id}/support/{studentId} - Remove a supporter
  removeSupporter: async (id: number, studentId: number): Promise<GroupRequest> => {
    const response = await apiClient.delete<GroupRequest>(`/group-requests/${id}/support/${studentId}`)
    return response.data
  },

  // PUT /group-requests/{id}/approve - Approve a group request (admin only)
  approve: async (id: number, data: ProcessGroupRequestRequest): Promise<GroupRequest> => {
    const response = await apiClient.put<GroupRequest>(`/group-requests/${id}/approve`, data)
    return response.data
  },

  // PUT /group-requests/{id}/reject - Reject a group request (admin only)
  reject: async (id: number, data: ProcessGroupRequestRequest): Promise<GroupRequest> => {
    const response = await apiClient.put<GroupRequest>(`/group-requests/${id}/reject`, data)
    return response.data
  },

  // ==================== "Me Interesa" API ====================

  // GET /group-requests/interest-summary - Get interest summary by subject (admin only)
  getInterestSummary: async (): Promise<SubjectInterestSummary[]> => {
    const response = await apiClient.get<SubjectInterestSummary[]>('/group-requests/interest-summary')
    return response.data
  },

  // GET /group-requests/interest/{subjectId}/student/{studentId} - Check if student is interested
  checkInterest: async (subjectId: number, studentId: number): Promise<boolean> => {
    const response = await apiClient.get<boolean>(`/group-requests/interest/${subjectId}/student/${studentId}`)
    return response.data
  },

  // POST /group-requests - Mark interest (reuses create endpoint with simplified data)
  markInterest: async (data: MarkInterestRequest): Promise<GroupRequest> => {
    // Use REGULAR_Q1 as default type since we're simplifying the flow
    const response = await apiClient.post<GroupRequest>('/group-requests', {
      subjectId: data.subjectId,
      requesterId: data.requesterId,
      requestedGroupType: 'REGULAR_Q1',
    })
    return response.data
  },

  // DELETE /group-requests/interest/{subjectId}/student/{studentId} - Remove interest
  removeInterest: async (subjectId: number, studentId: number): Promise<void> => {
    await apiClient.delete(`/group-requests/interest/${subjectId}/student/${studentId}`)
  },
}
