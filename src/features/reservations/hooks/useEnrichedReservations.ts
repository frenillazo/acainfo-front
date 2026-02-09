import { useQuery } from '@tanstack/react-query'
import { reservationApi } from '../services/reservationApi'
import { reservationKeys } from './useReservations'

export const useEnrichedReservations = (studentId: number) => {
  return useQuery({
    queryKey: [...reservationKeys.byStudent(studentId), 'enriched'],
    queryFn: () => reservationApi.getEnrichedByStudentId(studentId),
    enabled: !!studentId,
  })
}
