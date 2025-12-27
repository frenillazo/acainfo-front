import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi'
import type {
  SessionFilters,
  CreateSessionRequest,
  UpdateSessionRequest,
  GenerateSessionsRequest,
  PostponeSessionRequest,
} from '../../types/admin.types'

export const sessionKeys = {
  all: ['sessions'] as const,
  lists: () => [...sessionKeys.all, 'list'] as const,
  list: (filters: SessionFilters) => [...sessionKeys.lists(), filters] as const,
  details: () => [...sessionKeys.all, 'detail'] as const,
  detail: (id: number) => [...sessionKeys.details(), id] as const,
  byGroup: (groupId: number) => [...sessionKeys.all, 'group', groupId] as const,
  bySubject: (subjectId: number) => [...sessionKeys.all, 'subject', subjectId] as const,
}

export function useAdminSessions(filters: SessionFilters = {}) {
  return useQuery({
    queryKey: sessionKeys.list(filters),
    queryFn: () => adminApi.getSessions(filters),
  })
}

export function useAdminSession(id: number) {
  return useQuery({
    queryKey: sessionKeys.detail(id),
    queryFn: () => adminApi.getSessionById(id),
    enabled: !!id,
  })
}

export function useSessionsByGroup(groupId: number) {
  return useQuery({
    queryKey: sessionKeys.byGroup(groupId),
    queryFn: () => adminApi.getSessionsByGroup(groupId),
    enabled: !!groupId,
  })
}

export function useSessionsBySubject(subjectId: number) {
  return useQuery({
    queryKey: sessionKeys.bySubject(subjectId),
    queryFn: () => adminApi.getSessionsBySubject(subjectId),
    enabled: !!subjectId,
  })
}

export function useCreateSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSessionRequest) => adminApi.createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all })
    },
  })
}

export function useUpdateSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSessionRequest }) =>
      adminApi.updateSession(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(id) })
    },
  })
}

export function useDeleteSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => adminApi.deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all })
    },
  })
}

// Session generation hooks
export function useGenerateSessions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: GenerateSessionsRequest) => adminApi.generateSessions(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: sessionKeys.byGroup(variables.groupId) })
    },
  })
}

export function usePreviewGenerateSessions() {
  return useMutation({
    mutationFn: (data: GenerateSessionsRequest) => adminApi.previewGenerateSessions(data),
  })
}

// Session lifecycle hooks
export function useStartSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => adminApi.startSession(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(id) })
    },
  })
}

export function useCompleteSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => adminApi.completeSession(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(id) })
    },
  })
}

export function useCancelSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => adminApi.cancelSession(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(id) })
    },
  })
}

export function usePostponeSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PostponeSessionRequest }) =>
      adminApi.postponeSession(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all })
    },
  })
}
