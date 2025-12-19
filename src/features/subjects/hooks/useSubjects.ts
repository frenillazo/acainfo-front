import { useQuery } from '@tanstack/react-query'
import { subjectApi } from '../services/subjectApi'
import type { SubjectFilters } from '../types/subject.types'

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
