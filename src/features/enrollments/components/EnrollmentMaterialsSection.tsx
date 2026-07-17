import { useMaterialsBySubject } from '@/features/materials/hooks/useMaterials'
import { useMaterialFoldersBySubject } from '@/features/materials/hooks/useMaterialFolders'
import { useDownloadMaterial } from '@/features/materials/hooks/useMaterialMutations'
import { useMaterialViewer } from '@/features/materials/hooks/useMaterialViewer'
import { MaterialsGroupedByFolder } from '@/features/materials/components/MaterialsGroupedByFolder'
import { MaterialViewerModal } from '@/features/materials/components/MaterialViewer'
import { Spinner } from '@/shared/components/ui/Spinner'
import { NoMaterialsYet } from '@/features/materials/components/NoMaterialsYet'
import { MaterialsLocked } from '@/features/materials/components/MaterialsLocked'

interface EnrollmentMaterialsSectionProps {
  subjectId: number
  subjectName: string
  /** Solo la inscripción ACTIVA da acceso: el back devuelve 403 a las demás. */
  canAccess: boolean
  /** Qué contarle al alumno cuando no puede acceder todavía. */
  lockedMessage: string
}

export function EnrollmentMaterialsSection({
  subjectId,
  subjectName,
  canAccess,
  lockedMessage,
}: EnrollmentMaterialsSectionProps) {
  // Sin acceso no se pide: el listado no se va a mostrar.
  const { data: materials, isLoading, error } = useMaterialsBySubject(subjectId, canAccess)
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

  // Se listaba el material para CUALQUIER estado de inscripción (pendiente, en
  // lista de espera, rechazada) con los botones Ver/Descargar activos, que el
  // back rechaza con 403. Mejor decirlo antes de que lo pulse.
  if (!canAccess) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Materiales de {subjectName}
          </h2>
        </div>
        <div className="p-6">
          <MaterialsLocked message={lockedMessage} />
        </div>
      </div>
    )
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
        <NoMaterialsYet />
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
