import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { paymentApi } from '../services/paymentApi'
import type { PaymentFilters } from '../types/payment.types'

export const usePayments = (studentId: number) => {
  return useQuery({
    queryKey: ['payments', 'student', studentId],
    queryFn: () => paymentApi.getByStudentId(studentId),
    enabled: !!studentId,
  })
}

export const usePayment = (id: number) => {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: () => paymentApi.getById(id),
    enabled: !!id,
  })
}

export const usePendingPayments = (studentId: number) => {
  return useQuery({
    queryKey: ['payments', 'student', studentId, 'pending'],
    queryFn: () => paymentApi.getPendingByStudentId(studentId),
    enabled: !!studentId,
  })
}

export const useOverduePayments = (studentId: number) => {
  return useQuery({
    queryKey: ['payments', 'student', studentId, 'overdue'],
    queryFn: () => paymentApi.getOverdueByStudentId(studentId),
    enabled: !!studentId,
  })
}

export const usePaymentsWithFilters = (filters: PaymentFilters) => {
  return useQuery({
    queryKey: ['payments', 'filtered', filters],
    queryFn: () => paymentApi.getAll(filters),
  })
}

export const useMarkPaymentPaid = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, transactionId }: { id: number; transactionId?: string }) =>
      paymentApi.markAsPaid(id, transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['student', 'overview'] })
    },
  })
}
