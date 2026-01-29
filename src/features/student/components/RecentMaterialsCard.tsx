import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { FileText, Download, ExternalLink } from 'lucide-react'
import { materialApi } from '@/features/materials/services/materialApi'
import type { Material } from '@/features/materials/types/material.types'
import { formatDate } from '@/shared/utils/formatters'
import { Spinner } from '@/shared/components/ui/Spinner'
import { useState } from 'react'

export function RecentMaterialsCard() {
  const [downloadingId, setDownloadingId] = useState<number | null>(null)

  const { data: materials, isLoading, error } = useQuery({
    queryKey: ['materials', 'recent'],
    queryFn: () => materialApi.getRecent(3),
  })

  const handleDownload = async (material: Material) => {
    setDownloadingId(material.id)
    try {
      await materialApi.download(material.id, material.originalFilename)
    } finally {
      setDownloadingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Materiales Recientes
        </h3>
        <div className="flex justify-center py-4">
          <Spinner size="sm" />
        </div>
      </div>
    )
  }

  if (error) {
    return null // Silently hide on error
  }

  if (!materials || materials.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Materiales Recientes
        </h3>
        <p className="text-sm text-gray-500">
          No hay materiales nuevos en los ultimos 3 dias
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Materiales Recientes
        </h3>
        <span className="text-xs text-gray-500">Ultimos 3 dias</span>
      </div>

      <div className="space-y-3">
        {materials.slice(0, 5).map((material) => (
          <div
            key={material.id}
            className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3"
          >
            <div className="flex-shrink-0">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                {material.name}
              </p>
              <p className="text-xs text-gray-500">
                {material.subjectName} &bull; {formatDate(material.uploadedAt)}
              </p>
            </div>
            <button
              onClick={() => handleDownload(material)}
              disabled={downloadingId === material.id}
              className="flex-shrink-0 rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 disabled:opacity-50"
              title="Descargar"
              aria-label={`Descargar ${material.name}`}
            >
              {downloadingId === material.id ? (
                <Spinner size="sm" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </button>
          </div>
        ))}
      </div>

      {materials.length > 5 && (
        <div className="mt-3 text-center">
          <span className="text-xs text-gray-500">
            +{materials.length - 5} materiales mas
          </span>
        </div>
      )}
    </div>
  )
}
