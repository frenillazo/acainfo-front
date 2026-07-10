import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { subjectApi } from '../services/subjectApi'

/**
 * "Me interesa" hooks — minimal subject-level interest.
 * Endpoints operate on the authenticated student (no ids in the body).
 */

const interestKeys = {
  all: ['subjects', 'interest'] as const,
  me: (subjectId: number) => ['subjects', 'interest', 'me', subjectId] as const,
  mine: () => ['subjects', 'interest', 'mine'] as const,
  summary: () => ['subjects', 'interest', 'summary'] as const,
}

/** Whether the current student has marked interest in a subject. */
export const useCheckInterest = (subjectId: number, enabled = true) => {
  return useQuery({
    queryKey: interestKeys.me(subjectId),
    queryFn: () => subjectApi.hasInterest(subjectId),
    enabled: enabled && !!subjectId,
  })
}

/** Subject ids the current student is interested in. */
export const useMyInterests = () => {
  return useQuery({
    queryKey: interestKeys.mine(),
    queryFn: () => subjectApi.myInterests(),
  })
}

export const useMarkInterest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (subjectId: number) => subjectApi.markInterest(subjectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interestKeys.all })
    },
  })
}

export const useRemoveInterest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (subjectId: number) => subjectApi.removeInterest(subjectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interestKeys.all })
    },
  })
}

/** Interest count per subject (ADMIN only). */
export const useInterestSummary = () => {
  return useQuery({
    queryKey: interestKeys.summary(),
    queryFn: () => subjectApi.interestSummary(),
  })
}
