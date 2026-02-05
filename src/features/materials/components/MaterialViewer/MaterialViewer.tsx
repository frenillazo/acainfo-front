import type { Material, ViewerType } from '../../types/material.types'
import { PdfViewer } from './PdfViewer'
import { CodeViewer } from './CodeViewer'
import { ImageViewer } from './ImageViewer'
import { FallbackViewer } from './FallbackViewer'
import { Loader2, AlertTriangle } from 'lucide-react'

interface MaterialViewerProps {
  material: Material
  content: Blob | string | null
  viewerType: ViewerType
  isLoading: boolean
  error: string | null
  onDownload: () => void
}

export function MaterialViewer({
  material,
  content,
  viewerType,
  isLoading,
  error,
  onDownload,
}: MaterialViewerProps) {
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />
          <p className="mt-4 text-sm text-gray-500">Cargando archivo...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-96 flex-col items-center justify-center text-center">
        <div className="rounded-full bg-red-100 p-3">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <p className="mt-4 text-sm font-medium text-gray-900">Error al cargar el archivo</p>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-sm text-gray-500">No hay contenido disponible</p>
      </div>
    )
  }

  switch (viewerType) {
    case 'pdf':
      return <PdfViewer content={content as Blob} />
    case 'code':
      return <CodeViewer content={content as string} language={material.fileExtension} />
    case 'image':
      return <ImageViewer content={content as Blob} alt={material.name} />
    default:
      return <FallbackViewer material={material} onDownload={onDownload} />
  }
}
