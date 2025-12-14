import { apiClient } from '@/shared/services/apiClient'
import type { StudentOverviewResponse } from '../types/student.types'

export const studentApi = {
  getOverview: async (upcomingSessionsLimit = 5): Promise<StudentOverviewResponse> => {
    const response = await apiClient.get<StudentOverviewResponse>('/student/overview', {
      params: { upcomingSessionsLimit },
    })
    return response.data
  },

  getOverviewByStudentId: async (
    studentId: number,
    upcomingSessionsLimit = 5
  ): Promise<StudentOverviewResponse> => {
    const response = await apiClient.get<StudentOverviewResponse>(
      `/student/${studentId}/overview`,
      { params: { upcomingSessionsLimit } }
    )
    return response.data
  },
}
