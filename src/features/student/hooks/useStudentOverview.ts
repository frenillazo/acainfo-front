import { useQuery } from '@tanstack/react-query'
import { studentApi } from '../services/studentApi'

export const useStudentOverview = (limit = 5) => {
  return useQuery({
    queryKey: ['student', 'overview', limit],
    queryFn: () => studentApi.getOverview(limit),
  })
}

export const useStudentOverviewById = (studentId: number, limit = 5) => {
  return useQuery({
    queryKey: ['student', 'overview', studentId, limit],
    queryFn: () => studentApi.getOverviewByStudentId(studentId, limit),
    enabled: !!studentId,
  })
}
