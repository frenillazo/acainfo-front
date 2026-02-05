import type { Material, ViewerType } from '../../types/material.types'
import { Modal, ModalFooter } from '@/shared/components/ui/Modal'
import { MaterialViewer } from './MaterialViewer'
import { Download, X } from 'lucide-react'

interface MaterialViewerModalProps {
  isOpen: boolean
  material: Material | null
  content: Blob | string | null
  viewerType: ViewerType | null
  isLoading: boolean
  error: string | null
  onClose: () => void
  onDownload: () => void
}

export function MaterialViewerModal({
  isOpen,
  material,
  content,
  viewerType,
  isLoading,
  error,
  onClose,
  onDownload,
}: MaterialViewerModalProps) {
  if (!material) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={material.name}
      size="2xl"
      className="max-h-[90vh] overflow-hidden"
    >
      <MaterialViewer
        material={material}
        content={content}
        viewerType={viewerType ?? 'unsupported'}
        isLoading={isLoading}
        error={error}
        onDownload={onDownload}
      />

      <ModalFooter>
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <X className="h-4 w-4" />
          Cerrar
        </button>
        <button
          onClick={onDownload}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Download className="h-4 w-4" />
          Descargar
        </button>
      </ModalFooter>
    </Modal>
  )
}
