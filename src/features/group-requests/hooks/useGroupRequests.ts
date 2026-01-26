import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { groupRequestApi } from '../services/groupRequestApi'
import type {
  CreateGroupRequestRequest,
  AddSupporterRequest,
  ProcessGroupRequestRequest,
  GroupRequestFilters,
} from '../types/groupRequest.types'

export const useGroupRequests = (filters: GroupRequestFilters = {}) => {
  return useQuery({
    queryKey: ['group-requests', filters],
    queryFn: () => groupRequestApi.getAll(filters),
  })
}

export const useGroupRequest = (id: number) => {
  return useQuery({
    queryKey: ['group-request', id],
    queryFn: () => groupRequestApi.getById(id),
    enabled: !!id,
  })
}

export const useGroupRequestSupporters = (id: number) => {
  return useQuery({
    queryKey: ['group-request', id, 'supporters'],
    queryFn: () => groupRequestApi.getSupporters(id),
    enabled: !!id,
  })
}

export const useCreateGroupRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateGroupRequestRequest) => groupRequestApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-requests'] })
    },
  })
}

export const useAddSupporter = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AddSupporterRequest }) =>
      groupRequestApi.addSupporter(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['group-requests'] })
      queryClient.invalidateQueries({ queryKey: ['group-request', variables.id] })
    },
  })
}

export const useRemoveSupporter = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, studentId }: { id: number; studentId: number }) =>
      groupRequestApi.removeSupporter(id, studentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['group-requests'] })
      queryClient.invalidateQueries({ queryKey: ['group-request', variables.id] })
    },
  })
}

export const useApproveGroupRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProcessGroupRequestRequest }) =>
      groupRequestApi.approve(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['group-requests'] })
      queryClient.invalidateQueries({ queryKey: ['group-request', variables.id] })
    },
  })
}

export const useRejectGroupRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProcessGroupRequestRequest }) =>
      groupRequestApi.reject(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['group-requests'] })
      queryClient.invalidateQueries({ queryKey: ['group-request', variables.id] })
    },
  })
}
