import { FolderOpen } from 'lucide-react'
import { useMaterialsBySubject } from '@/features/materials/hooks/useMaterials'
import { useMaterialFoldersBySubject } from '@/features/materials/hooks/useMaterialFolders'
import { useDownloadMaterial } from '@/features/materials/hooks/useMaterialMutations'
import { useMaterialViewer } from '@/features/materials/hooks/useMaterialViewer'
import { MaterialsGroupedByFolder } from '@/features/materials/components/MaterialsGroupedByFolder'
import { MaterialViewerModal } from '@/features/materials/components/MaterialViewer'
import { Spinner } from '@/shared/components/ui/Spinner'

interface EnrollmentMaterialsSectionProps {
  subjectId: number
  subjectName: string
}

export function EnrollmentMaterialsSection({ subjectId, subjectName }: EnrollmentMaterialsSectionProps) {
  const { data: materials, isLoading, error } = useMaterialsBySubject(subjectId)
  const { data: folders = [] } = useMaterialFoldersBySubject(subjectId)
  const downloadMutation = useDownloadMaterial()

  const {
    isOpen: viewerOpen,
    material: viewerMaterial,
    content: viewerContent,
    viewerType,
    isLoading: viewerLoading,
    error: viewerError,
    openViewer,
    closeViewer,
  } = useMaterialViewer()

  const handleViewerDownload = () => {
    if (viewerMaterial) {
      downloadMutation.mutate({
        id: viewerMaterial.id,
        filename: viewerMaterial.originalFilename,
      })
    }
  }

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

      <div className="p-6">
        <MaterialsGroupedByFolder
          materials={materials}
          folders={folders}
          onView={openViewer}
          onDownload={(id, filename) => downloadMutation.mutate({ id, filename })}
          isDownloading={downloadMutation.isPending}
        />
      </div>

      <MaterialViewerModal
        isOpen={viewerOpen}
        material={viewerMaterial}
        content={viewerContent}
        viewerType={viewerType}
        isLoading={viewerLoading}
        error={viewerError}
        onClose={closeViewer}
        onDownload={handleViewerDownload}
      />
    </div>
  )
}
