import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { materialFolderApi } from '../services/materialFolderApi'
import type {
  CreateMaterialFolderRequest,
  UpdateMaterialFolderRequest,
} from '../types/material.types'
import { materialKeys } from './useMaterials'

// Key factory de carpetas de materiales (patrón materialKeys).
export const materialFolderKeys = {
  all: ['material-folders'] as const,
  bySubject: (subjectId: number) =>
    [...materialFolderKeys.all, 'subject', subjectId] as const,
}

/** Carpetas de una asignatura, ordenadas por position (las devuelve así el back). */
export function useMaterialFoldersBySubject(subjectId: number) {
  return useQuery({
    queryKey: materialFolderKeys.bySubject(subjectId),
    queryFn: () => materialFolderApi.getBySubjectId(subjectId),
    enabled: !!subjectId,
  })
}

// Las mutaciones invalidan también materialKeys.all: renombrar cambia el
// folderName enriquecido de los materiales y borrar los manda a la raíz.
function useInvalidateFolders() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: materialFolderKeys.all })
    queryClient.invalidateQueries({ queryKey: materialKeys.all })
  }
}

/** ADMIN: crear carpeta en una asignatura. */
export function useCreateMaterialFolder() {
  const invalidate = useInvalidateFolders()
  return useMutation({
    mutationFn: ({
      subjectId,
      payload,
    }: {
      subjectId: number
      payload: CreateMaterialFolderRequest
    }) => materialFolderApi.create(subjectId, payload),
    onSuccess: invalidate,
  })
}

/** ADMIN: renombrar y/o reordenar carpeta. */
export function useUpdateMaterialFolder() {
  const invalidate = useInvalidateFolders()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateMaterialFolderRequest
    }) => materialFolderApi.update(id, payload),
    onSuccess: invalidate,
  })
}

/** ADMIN: borrar carpeta (sus materiales pasan a la raíz). */
export function useDeleteMaterialFolder() {
  const invalidate = useInvalidateFolders()
  return useMutation({
    mutationFn: (id: number) => materialFolderApi.delete(id),
    onSuccess: invalidate,
  })
}
