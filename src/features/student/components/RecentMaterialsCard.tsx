import { useQuery } from '@tanstack/react-query'
import { FileText, Download } from 'lucide-react'
import { materialApi } from '@/features/materials/services/materialApi'
import type { Material } from '@/features/materials/types/material.types'
import { formatDate } from '@/shared/utils/formatters'
import { Spinner, Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui'
import { useState, useMemo } from 'react'
import { useActiveEnrollmentSubjectIds } from '@/features/enrollments/hooks/useEnrollments'
import { useAuthStore } from '@/features/auth/store/authStore'

export function RecentMaterialsCard() {
  const [downloadingId, setDownloadingId] = useState<number | null>(null)
  const user = useAuthStore((state) => state.user)
  const userId = user?.id ?? 0

  // Get active enrollment subject IDs to filter materials
  const { activeSubjectIds, isLoading: isLoadingEnrollments } = useActiveEnrollmentSubjectIds(userId)

  const { data: allMaterials, isLoading: isLoadingMaterials, error } = useQuery({
    queryKey: ['materials', 'recent'],
    queryFn: () => materialApi.getRecent(3),
  })

  // Filter materials to only show those from subjects with active enrollment
  const materials = useMemo(() => {
    if (!allMaterials || activeSubjectIds.size === 0) return []
    return allMaterials.filter((material) => activeSubjectIds.has(material.subjectId))
  }, [allMaterials, activeSubjectIds])

  const isLoading = isLoadingMaterials || isLoadingEnrollments

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
      <Card padding="md">
        <CardTitle>Materiales Recientes</CardTitle>
        <CardContent>
          <div className="flex justify-center py-4">
            <Spinner size="sm" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return null // Silently hide on error
  }

  if (!materials || materials.length === 0) {
    const hasEnrollments = activeSubjectIds.size > 0
    return (
      <Card padding="md">
        <CardTitle>Materiales Recientes</CardTitle>
        <CardContent>
          <p className="text-sm text-gray-500">
            {hasEnrollments
              ? 'No hay materiales nuevos en los ultimos 3 dias'
              : 'Inscríbete en una asignatura para ver los materiales'}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card padding="md">
      <CardHeader>
        <CardTitle>Materiales Recientes</CardTitle>
        <span className="text-xs text-gray-500">Ultimos 3 dias</span>
      </CardHeader>

      <CardContent>
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
      </CardContent>
    </Card>
  )
}
