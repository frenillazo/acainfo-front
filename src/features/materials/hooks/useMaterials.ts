import { useQuery } from '@tanstack/react-query'
import { materialApi } from '../services/materialApi'
import type { MaterialFilters } from '../types/material.types'

// Key factory de la feature materials (patrón sessionKeys/reservationKeys).
// Las mutaciones invalidan materialKeys.all para refrescar cualquier lista.
export const materialKeys = {
  all: ['materials'] as const,
  lists: () => [...materialKeys.all, 'list'] as const,
  list: (filters: MaterialFilters) => [...materialKeys.lists(), filters] as const,
  bySubject: (subjectId: number) => [...materialKeys.all, 'subject', subjectId] as const,
  recent: () => [...materialKeys.all, 'recent'] as const,
  detail: (id: number) => [...materialKeys.all, 'detail', id] as const,
}

/** Listado paginado con filtros (página de materiales). */
export function useMaterialsList(filters: MaterialFilters = {}) {
  return useQuery({
    queryKey: materialKeys.list(filters),
    queryFn: () => materialApi.getAll(filters),
  })
}

/** Materiales de una asignatura (detalle de asignatura, alumno y admin). */
export function useMaterialsBySubject(subjectId: number) {
  return useQuery({
    queryKey: materialKeys.bySubject(subjectId),
    queryFn: () => materialApi.getBySubjectId(subjectId),
    enabled: !!subjectId,
  })
}

/** Materiales recientes del alumno (dashboard). */
export function useRecentMaterials(days: number = 3) {
  return useQuery({
    queryKey: materialKeys.recent(),
    queryFn: () => materialApi.getRecent(days),
  })
}
