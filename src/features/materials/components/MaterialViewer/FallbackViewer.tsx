import type { Material } from '../../types/material.types'
import { getFileIcon } from '../../types/material.types'
import { Download } from 'lucide-react'

interface FallbackViewerProps {
  material: Material
  onDownload: () => void
}

export function FallbackViewer({ material, onDownload }: FallbackViewerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {/* Large file icon */}
      <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gray-100 text-5xl">
        {getFileIcon(material.fileExtension)}
      </div>

      {/* File info */}
      <h3 className="mt-6 text-lg font-medium text-gray-900">{material.name}</h3>
      <p className="mt-1 text-sm text-gray-500">{material.originalFilename}</p>

      {/* Metadata */}
      <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1">
          .{material.fileExtension.toUpperCase()}
        </span>
        <span>{material.fileSizeFormatted}</span>
      </div>

      {/* Message */}
      <p className="mt-6 max-w-sm text-sm text-gray-600">
        Este tipo de archivo no puede visualizarse en el navegador. Puedes descargarlo para verlo en
        tu dispositivo.
      </p>

      {/* Download button */}
      <button
        onClick={onDownload}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <Download className="h-5 w-5" />
        Descargar archivo
      </button>
    </div>
  )
}
