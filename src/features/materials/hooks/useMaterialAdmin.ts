import { useState } from 'react'
import { materialApi } from '../services/materialApi'
import type { Material, UpdateMaterialRequest } from '../types/material.types'
import { getApiErrorMessage } from '@/shared/utils/apiError'

/**
 * Admin-only material operations: edit single material metadata + flags,
 * and batch toggle visibility / downloadDisabled.
 */
export function useMaterialAdmin() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isBatching, setIsBatching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  const update = async (
    id: number,
    payload: UpdateMaterialRequest
  ): Promise<Material | null> => {
    setIsUpdating(true)
    setError(null)
    try {
      return await materialApi.update(id, payload)
    } catch (err) {
      const message = getApiErrorMessage(err, 'No se pudo actualizar el material')
      setError(message)
      return null
    } finally {
      setIsUpdating(false)
    }
  }

  const batchSetDownloadDisabled = async (
    ids: number[],
    disabled: boolean
  ): Promise<number> => {
    if (ids.length === 0) return 0
    setIsBatching(true)
    setError(null)
    try {
      const result = await materialApi.batchSetDownloadDisabled(ids, disabled)
      return result.updated
    } catch (err) {
      const message = getApiErrorMessage(err, 'Error al actualizar la descarga por lotes')
      setError(message)
      return 0
    } finally {
      setIsBatching(false)
    }
  }

  const batchSetVisibility = async (
    ids: number[],
    visible: boolean
  ): Promise<number> => {
    if (ids.length === 0) return 0
    setIsBatching(true)
    setError(null)
    try {
      const result = await materialApi.batchSetVisibility(ids, visible)
      return result.updated
    } catch (err) {
      const message = getApiErrorMessage(err, 'Error al actualizar la visibilidad por lotes')
      setError(message)
      return 0
    } finally {
      setIsBatching(false)
    }
  }

  return {
    isUpdating,
    isBatching,
    error,
    clearError,
    update,
    batchSetDownloadDisabled,
    batchSetVisibility,
  }
}
