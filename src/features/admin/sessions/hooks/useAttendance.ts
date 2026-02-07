import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { attendanceApi } from '@/features/reservations/services/attendanceApi'
import type { BulkRecordAttendanceRequest } from '@/features/reservations/types/reservation.types'
import { useAuthStore } from '@/features/auth/store/authStore'

export const useSessionAttendance = (sessionId: number) => {
  return useQuery({
    queryKey: ['session', 'attendance', sessionId],
    queryFn: () => attendanceApi.getSessionAttendance(sessionId),
    enabled: !!sessionId,
  })
}

export const useRecordBulkAttendance = () => {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)

  return useMutation({
    mutationFn: ({
      sessionId,
      data,
    }: {
      sessionId: number
      data: BulkRecordAttendanceRequest
    }) => attendanceApi.recordBulk(sessionId, user?.id ?? 0, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['session', 'attendance', variables.sessionId],
      })
    },
  })
}
