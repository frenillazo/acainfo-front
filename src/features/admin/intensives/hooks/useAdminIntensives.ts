import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { intensiveApi } from '../services/intensiveApi'
import type {
  CreateIntensiveRequest,
  IntensiveFilters,
  IntensiveSessionEntry,
  UpdateIntensiveRequest,
} from '../types/intensive.types'

export function useAdminIntensives(filters: IntensiveFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'intensives', filters],
    queryFn: () => intensiveApi.list(filters),
  })
}

export function useAdminIntensive(id: number) {
  return useQuery({
    queryKey: ['admin', 'intensive', id],
    queryFn: () => intensiveApi.getById(id),
    enabled: !!id,
  })
}

export function useIntensiveSessions(id: number) {
  return useQuery({
    queryKey: ['intensive', 'sessions', id],
    queryFn: () => intensiveApi.listSessions(id),
    enabled: !!id,
  })
}

export function useCreateIntensive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateIntensiveRequest) => intensiveApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'intensives'] })
    },
  })
}

export function useUpdateIntensive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateIntensiveRequest }) =>
      intensiveApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'intensives'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'intensive', variables.id] })
    },
  })
}

export function useDeleteIntensive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => intensiveApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'intensives'] })
    },
  })
}

export function useCancelIntensive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => intensiveApi.cancel(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'intensives'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'intensive', id] })
    },
  })
}

export function useCreateIntensiveSessionsBulk() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, entries }: { id: number; entries: IntensiveSessionEntry[] }) =>
      intensiveApi.createSessionsBulk(id, entries),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'intensive', variables.id] })
      // Sessions list (for the intensive's session view) lives in the session module —
      // invalidate the broad sessions cache so the calendar refreshes.
      queryClient.invalidateQueries({ queryKey: ['admin', 'sessions'] })
      queryClient.invalidateQueries({ queryKey: ['intensive', 'sessions', variables.id] })
    },
  })
}

export function useCreateIntensiveSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, entry }: { id: number; entry: IntensiveSessionEntry }) =>
      intensiveApi.createSession(id, entry),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'intensive', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'sessions'] })
      queryClient.invalidateQueries({ queryKey: ['intensive', 'sessions', variables.id] })
    },
  })
}
