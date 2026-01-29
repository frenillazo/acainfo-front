import { useQuery } from '@tanstack/react-query'
import { FileText, Download, FolderOpen } from 'lucide-react'
import { materialApi } from '@/features/materials/services/materialApi'
import type { Material, MaterialCategory } from '@/features/materials/types/material.types'
import { formatDate } from '@/shared/utils/formatters'
import { Spinner } from '@/shared/components/ui/Spinner'
import { Badge } from '@/shared/components/ui/Badge'
import { useState } from 'react'

interface EnrollmentMaterialsSectionProps {
  subjectId: number
  subjectName: string
}

const CATEGORY_CONFIG: Record<MaterialCategory, { label: string; emoji: string }> = {
  TEORIA: { label: 'Teoria', emoji: '📚' },
  EJERCICIOS: { label: 'Ejercicios', emoji: '✏️' },
  EXAMENES: { label: 'Examenes', emoji: '📝' },
  PROYECTOS: { label: 'Proyectos', emoji: '🎯' },
  LABORATORIOS: { label: 'Laboratorios', emoji: '🔬' },
  OTROS: { label: 'Otros', emoji: '📁' },
}

export function EnrollmentMaterialsSection({ subjectId, subjectName }: EnrollmentMaterialsSectionProps) {
  const [downloadingId, setDownloadingId] = useState<number | null>(null)

  const { data: materials, isLoading, error } = useQuery({
    queryKey: ['materials', 'subject', subjectId],
    queryFn: () => materialApi.getBySubjectId(subjectId),
  })

  const handleDownload = async (material: Material) => {
    setDownloadingId(material.id)
    try {
      await materialApi.download(material.id, material.originalFilename)
    } finally {
      setDownloadingId(null)
    }
  }

  // Group materials by category
  const groupedMaterials = materials?.reduce((acc, material) => {
    const category = material.category || 'OTROS'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(material)
    return acc
  }, {} as Record<string, Material[]>)

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Materiales de {subjectName}
          </h2>
        </div>
        <div className="flex justify-center p-8">
          <Spinner />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Materiales de {subjectName}
          </h2>
        </div>
        <div className="p-6 text-center text-red-600">
          Error al cargar los materiales
        </div>
      </div>
    )
  }

  if (!materials || materials.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Materiales de {subjectName}
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center p-8 text-gray-500">
          <FolderOpen className="mb-2 h-12 w-12 text-gray-300" />
          <p>No hay materiales disponibles para esta asignatura</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Materiales de {subjectName}
          </h2>
          <span className="text-sm text-gray-500">
            {materials.length} {materials.length === 1 ? 'archivo' : 'archivos'}
          </span>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {Object.entries(groupedMaterials || {}).map(([category, categoryMaterials]) => {
          const config = CATEGORY_CONFIG[category as MaterialCategory] || CATEGORY_CONFIG.OTROS
          return (
            <div key={category} className="p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
                <span>{config.emoji}</span>
                {config.label}
                <Badge variant="default" className="ml-1">
                  {categoryMaterials.length}
                </Badge>
              </h3>
              <div className="space-y-2">
                {categoryMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                  >
                    <FileText className="h-5 w-5 flex-shrink-0 text-blue-500" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {material.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {material.fileSizeFormatted} &bull; {material.fileExtension?.toUpperCase()} &bull; {formatDate(material.uploadedAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownload(material)}
                      disabled={downloadingId === material.id}
                      className="flex-shrink-0 rounded-md bg-blue-50 p-2 text-blue-600 transition-colors hover:bg-blue-100 disabled:opacity-50"
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
            </div>
          )
        })}
      </div>
    </div>
  )
}
