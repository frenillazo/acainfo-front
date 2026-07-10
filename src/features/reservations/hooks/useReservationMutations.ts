import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reservationApi } from '../services/reservationApi'
import { reservationKeys } from './useReservations'
import type { CreateReservationRequest, SwitchSessionRequest } from '../types/reservation.types'

export const useCreateReservation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateReservationRequest) => reservationApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.all })
      queryClient.invalidateQueries({ queryKey: ['student', 'overview'] })
    },
  })
}

export const useCancelReservation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, studentId }: { id: number; studentId: number }) =>
      reservationApi.cancel(id, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.all })
      queryClient.invalidateQueries({ queryKey: ['student', 'overview'] })
    },
  })
}

export const useSwitchSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, studentId, data }: { id: number; studentId: number; data: SwitchSessionRequest }) =>
      reservationApi.switchSession(id, studentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.all })
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      queryClient.invalidateQueries({ queryKey: ['student', 'overview'] })
    },
  })
}
