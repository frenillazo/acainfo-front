import { apiClient } from '@/shared/services/apiClient'
import type { PageResponse } from '@/shared/types/api.types'
import type { Payment, PaymentFilters, AccessStatusResponse } from '../types/payment.types'

export const paymentApi = {
  // GET /payments/{id}
  getById: async (id: number): Promise<Payment> => {
    const response = await apiClient.get<Payment>(`/payments/${id}`)
    return response.data
  },

  // GET /payments?filters...
  getAll: async (filters: PaymentFilters = {}): Promise<PageResponse<Payment>> => {
    const response = await apiClient.get<PageResponse<Payment>>('/payments', {
      params: filters,
    })
    return response.data
  },

  // GET /payments/student/{studentId}
  getByStudentId: async (studentId: number): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>(`/payments/student/${studentId}`)
    return response.data
  },

  // GET /payments/student/{studentId}/pending
  getPendingByStudentId: async (studentId: number): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>(`/payments/student/${studentId}/pending`)
    return response.data
  },

  // GET /payments/student/{studentId}/overdue
  getOverdueByStudentId: async (studentId: number): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>(`/payments/student/${studentId}/overdue`)
    return response.data
  },

  // GET /payments/enrollment/{enrollmentId}
  getByEnrollmentId: async (enrollmentId: number): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>(`/payments/enrollment/${enrollmentId}`)
    return response.data
  },

  // GET /payments/student/{studentId}/access
  checkAccessStatus: async (studentId: number): Promise<AccessStatusResponse> => {
    const response = await apiClient.get<AccessStatusResponse>(`/payments/student/${studentId}/access`)
    return response.data
  },

  // POST /payments/{id}/pay
  markAsPaid: async (id: number, transactionId?: string): Promise<Payment> => {
    const response = await apiClient.post<Payment>(`/payments/${id}/pay`, {
      transactionId,
    })
    return response.data
  },
}
