import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi'
import type {
  PaymentFilters,
  GeneratePaymentRequest,
  GenerateMonthlyPaymentsRequest,
  CancelPaymentRequest,
  MarkPaymentPaidRequest,
} from '@/features/payments/types/payment.types'

export const paymentKeys = {
  all: ['admin-payments'] as const,
  lists: () => [...paymentKeys.all, 'list'] as const,
  list: (filters: PaymentFilters) => [...paymentKeys.lists(), filters] as const,
  details: () => [...paymentKeys.all, 'detail'] as const,
  detail: (id: number) => [...paymentKeys.details(), id] as const,
  byStudent: (studentId: number) => [...paymentKeys.all, 'student', studentId] as const,
  byEnrollment: (enrollmentId: number) => [...paymentKeys.all, 'enrollment', enrollmentId] as const,
  pendingByStudent: (studentId: number) => [...paymentKeys.all, 'student', studentId, 'pending'] as const,
  overdueByStudent: (studentId: number) => [...paymentKeys.all, 'student', studentId, 'overdue'] as const,
  allOverdue: () => [...paymentKeys.all, 'overdue'] as const,
}

export function useAdminPayments(filters: PaymentFilters = {}) {
  return useQuery({
    queryKey: paymentKeys.list(filters),
    queryFn: () => adminApi.getPaymentsWithFilters(filters),
  })
}

export function useAdminPayment(id: number) {
  return useQuery({
    queryKey: paymentKeys.detail(id),
    queryFn: () => adminApi.getPaymentById(id),
    enabled: !!id,
  })
}

export function usePaymentsByStudent(studentId: number) {
  return useQuery({
    queryKey: paymentKeys.byStudent(studentId),
    queryFn: () => adminApi.getPaymentsByStudentId(studentId),
    enabled: !!studentId,
  })
}

export function usePaymentsByEnrollment(enrollmentId: number) {
  return useQuery({
    queryKey: paymentKeys.byEnrollment(enrollmentId),
    queryFn: () => adminApi.getPaymentsByEnrollmentId(enrollmentId),
    enabled: !!enrollmentId,
  })
}

export function usePendingPaymentsByStudent(studentId: number) {
  return useQuery({
    queryKey: paymentKeys.pendingByStudent(studentId),
    queryFn: () => adminApi.getPendingPaymentsByStudentId(studentId),
    enabled: !!studentId,
  })
}

export function useOverduePaymentsByStudent(studentId: number) {
  return useQuery({
    queryKey: paymentKeys.overdueByStudent(studentId),
    queryFn: () => adminApi.getOverduePaymentsByStudentId(studentId),
    enabled: !!studentId,
  })
}

export function useAllOverduePayments() {
  return useQuery({
    queryKey: paymentKeys.allOverdue(),
    queryFn: () => adminApi.getAllOverduePayments(),
  })
}

export function useGeneratePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: GeneratePaymentRequest) => adminApi.generatePayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all })
    },
  })
}

export function useGenerateMonthlyPayments() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: GenerateMonthlyPaymentsRequest) => adminApi.generateMonthlyPayments(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all })
    },
  })
}

export function useMarkPaymentAsPaid() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data?: MarkPaymentPaidRequest }) =>
      adminApi.markPaymentAsPaid(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: paymentKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: paymentKeys.allOverdue() })
    },
  })
}

export function useCancelPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data?: CancelPaymentRequest }) =>
      adminApi.cancelPayment(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: paymentKeys.detail(id) })
    },
  })
}
