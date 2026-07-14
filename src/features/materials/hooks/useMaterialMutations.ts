import { useMutation, useQueryClient } from '@tanstack/react-query'
import { materialApi } from '../services/materialApi'
import type { UpdateMaterialRequest, UploadMaterialRequest } from '../types/material.types'
import { materialKeys } from './useMaterials'

// Mutaciones de materials. Todas las que cambian datos invalidan
// materialKeys.all: cualquier lista (paginada, por asignatura, recientes)
// se refresca sola, sin recargas manuales en las páginas.

export function useUploadMaterial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ metadata, file }: { metadata: UploadMaterialRequest; file: File }) =>
      materialApi.upload(metadata, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: materialKeys.all }),
  })
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => materialApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: materialKeys.all }),
  })
}

/** ADMIN: metadatos + flags (visible, downloadDisabled) de un material. */
export function useUpdateMaterial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateMaterialRequest }) =>
      materialApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: materialKeys.all }),
  })
}

/** ADMIN: (des)habilitar descarga por lotes. */
export function useBatchSetDownloadDisabled() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ ids, disabled }: { ids: number[]; disabled: boolean }) =>
      materialApi.batchSetDownloadDisabled(ids, disabled),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: materialKeys.all }),
  })
}

/** ADMIN: mostrar/ocultar por lotes. */
export function useBatchSetVisibility() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ ids, visible }: { ids: number[]; visible: boolean }) =>
      materialApi.batchSetVisibility(ids, visible),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: materialKeys.all }),
  })
}

/** Descarga (efecto secundario, no toca caché). */
export function useDownloadMaterial() {
  return useMutation({
    mutationFn: ({ id, filename }: { id: number; filename: string }) =>
      materialApi.download(id, filename),
  })
}
