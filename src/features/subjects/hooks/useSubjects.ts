import { useQuery } from '@tanstack/react-query'
import { subjectApi, groupApi } from '../services/subjectApi'
import type { SubjectFilters, GroupFilters } from '../types/subject.types'

export const useSubjects = (filters: SubjectFilters = {}) => {
  return useQuery({
    queryKey: ['subjects', filters],
    queryFn: () => subjectApi.getAll(filters),
  })
}

export const useSubject = (id: number) => {
  return useQuery({
    queryKey: ['subject', id],
    queryFn: () => subjectApi.getById(id),
    enabled: !!id,
  })
}

export const useSubjectByCode = (code: string) => {
  return useQuery({
    queryKey: ['subject', 'code', code],
    queryFn: () => subjectApi.getByCode(code),
    enabled: !!code,
  })
}

export const useGroups = (filters: GroupFilters = {}) => {
  return useQuery({
    queryKey: ['groups', filters],
    queryFn: () => groupApi.getAll(filters),
  })
}

export const useGroupsBySubject = (subjectId: number, status?: string) => {
  return useQuery({
    queryKey: ['groups', 'subject', subjectId, status],
    queryFn: () => groupApi.getBySubjectId(subjectId, status),
    enabled: !!subjectId,
  })
}

export const useGroup = (id: number) => {
  return useQuery({
    queryKey: ['group', id],
    queryFn: () => groupApi.getById(id),
    enabled: !!id,
  })
}
