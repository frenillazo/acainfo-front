import { useQuery } from '@tanstack/react-query'
import { reservationApi } from '../services/reservationApi'

export const reservationKeys = {
  all: ['reservations'] as const,
  byStudent: (studentId: number) => [...reservationKeys.all, 'student', studentId] as const,
  bySession: (sessionId: number) => [...reservationKeys.all, 'session', sessionId] as const,
  detail: (id: number) => [...reservationKeys.all, 'detail', id] as const,
}

export const useStudentReservations = (studentId: number) => {
  return useQuery({
    queryKey: reservationKeys.byStudent(studentId),
    queryFn: () => reservationApi.getByStudentId(studentId),
    enabled: !!studentId,
  })
}

export const useSessionReservations = (sessionId: number) => {
  return useQuery({
    queryKey: reservationKeys.bySession(sessionId),
    queryFn: () => reservationApi.getBySessionId(sessionId),
    enabled: !!sessionId,
  })
}

export const useReservation = (id: number) => {
  return useQuery({
    queryKey: reservationKeys.detail(id),
    queryFn: () => reservationApi.getById(id),
    enabled: !!id,
  })
}
