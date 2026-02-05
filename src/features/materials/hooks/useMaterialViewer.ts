import { useState, useCallback } from 'react'
import { materialApi } from '../services/materialApi'
import type { Material, ViewerState, ViewerType } from '../types/material.types'
import { getViewerType } from '../types/material.types'

interface UseMaterialViewerReturn extends ViewerState {
  viewerType: ViewerType | null
  openViewer: (material: Material) => Promise<void>
  closeViewer: () => void
}

export function useMaterialViewer(): UseMaterialViewerReturn {
  const [state, setState] = useState<ViewerState>({
    isOpen: false,
    material: null,
    content: null,
    isLoading: false,
    error: null,
  })

  const openViewer = useCallback(async (material: Material) => {
    const viewerType = getViewerType(material.fileExtension)

    setState({
      isOpen: true,
      material,
      content: null,
      isLoading: true,
      error: null,
    })

    try {
      const blob = await materialApi.getContent(material.id)

      // Para código, convertir blob a texto
      let content: Blob | string = blob
      if (viewerType === 'code') {
        content = await blob.text()
      }

      setState((prev) => ({
        ...prev,
        content,
        isLoading: false,
      }))
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al cargar el archivo'
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }))
    }
  }, [])

  const closeViewer = useCallback(() => {
    setState({
      isOpen: false,
      material: null,
      content: null,
      isLoading: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    viewerType: state.material ? getViewerType(state.material.fileExtension) : null,
    openViewer,
    closeViewer,
  }
}
