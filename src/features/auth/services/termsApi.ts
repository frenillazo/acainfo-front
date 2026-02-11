import { apiClient } from '@/shared/services/apiClient'

export interface TermsStatusResponse {
  accepted: boolean
  currentVersion: string
}

export interface TermsAcceptResponse {
  message: string
  version: string
  acceptedAt: string
}

export const termsApi = {
  getStatus: async (): Promise<TermsStatusResponse> => {
    const response = await apiClient.get<TermsStatusResponse>('/terms/status')
    return response.data
  },

  accept: async (): Promise<TermsAcceptResponse> => {
    const response = await apiClient.post<TermsAcceptResponse>('/terms/accept')
    return response.data
  },
}
