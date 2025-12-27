import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi'
import type {
  ScheduleFilters,
  CreateScheduleRequest,
  UpdateScheduleRequest,
} from '../../types/admin.types'

export const scheduleKeys = {
  all: ['schedules'] as const,
  lists: () => [...scheduleKeys.all, 'list'] as const,
  list: (filters: ScheduleFilters) => [...scheduleKeys.lists(), filters] as const,
  details: () => [...scheduleKeys.all, 'detail'] as const,
  detail: (id: number) => [...scheduleKeys.details(), id] as const,
  byGroup: (groupId: number) => [...scheduleKeys.all, 'group', groupId] as const,
  enriched: () => [...scheduleKeys.all, 'enriched'] as const,
  enrichedList: (filters: ScheduleFilters) => [...scheduleKeys.enriched(), filters] as const,
}

export function useAdminSchedules(filters: ScheduleFilters = {}) {
  return useQuery({
    queryKey: scheduleKeys.list(filters),
    queryFn: () => adminApi.getSchedules(filters),
  })
}

export function useAdminSchedule(id: number) {
  return useQuery({
    queryKey: scheduleKeys.detail(id),
    queryFn: () => adminApi.getScheduleById(id),
    enabled: !!id,
  })
}

export function useSchedulesByGroup(groupId: number) {
  return useQuery({
    queryKey: scheduleKeys.byGroup(groupId),
    queryFn: () => adminApi.getSchedulesByGroup(groupId),
    enabled: !!groupId,
  })
}

export function useCreateSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateScheduleRequest) => adminApi.createSchedule(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() })
      queryClient.invalidateQueries({ queryKey: scheduleKeys.byGroup(variables.groupId) })
    },
  })
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateScheduleRequest }) =>
      adminApi.updateSchedule(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() })
      queryClient.invalidateQueries({ queryKey: scheduleKeys.detail(id) })
      // Also invalidate group schedules (we don't have groupId here, so invalidate all)
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all })
    },
  })
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => adminApi.deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all })
    },
  })
}

export function useEnrichedSchedules(filters: ScheduleFilters = {}) {
  return useQuery({
    queryKey: scheduleKeys.enrichedList(filters),
    queryFn: () => adminApi.getEnrichedSchedules(filters),
  })
}
