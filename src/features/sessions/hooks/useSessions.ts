import { useQuery } from '@tanstack/react-query'
import { sessionApi } from '../services/sessionApi'
import type { SessionFilters } from '../types/session.types'

export const sessionKeys = {
  all: ['sessions'] as const,
  lists: () => [...sessionKeys.all, 'list'] as const,
  list: (filters: SessionFilters) => [...sessionKeys.lists(), filters] as const,
  details: () => [...sessionKeys.all, 'detail'] as const,
  detail: (id: number) => [...sessionKeys.details(), id] as const,
  byGroup: (groupId: number) => [...sessionKeys.all, 'group', groupId] as const,
  bySubject: (subjectId: number) => [...sessionKeys.all, 'subject', subjectId] as const,
  bySchedule: (scheduleId: number) => [...sessionKeys.all, 'schedule', scheduleId] as const,
}

export function useSessions(filters: SessionFilters = {}) {
  return useQuery({
    queryKey: sessionKeys.list(filters),
    queryFn: () => sessionApi.getSessionsWithFilters(filters),
  })
}

export function useSession(id: number) {
  return useQuery({
    queryKey: sessionKeys.detail(id),
    queryFn: () => sessionApi.getSessionById(id),
    enabled: !!id,
  })
}

export function useSessionsByGroup(groupId: number) {
  return useQuery({
    queryKey: sessionKeys.byGroup(groupId),
    queryFn: () => sessionApi.getSessionsByGroup(groupId),
    enabled: !!groupId,
  })
}

export function useSessionsBySubject(subjectId: number) {
  return useQuery({
    queryKey: sessionKeys.bySubject(subjectId),
    queryFn: () => sessionApi.getSessionsBySubject(subjectId),
    enabled: !!subjectId,
  })
}

export function useSessionsBySchedule(scheduleId: number) {
  return useQuery({
    queryKey: sessionKeys.bySchedule(scheduleId),
    queryFn: () => sessionApi.getSessionsBySchedule(scheduleId),
    enabled: !!scheduleId,
  })
}
