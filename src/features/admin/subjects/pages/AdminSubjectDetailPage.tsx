import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  useAdminSubject,
  useArchiveSubject,
  useDeleteSubject,
} from '../hooks/useAdminSubjects'
import { ConfigBadge } from '@/shared/components/ui'
import { SUBJECT_STATUS_CONFIG, DEGREE_CONFIG } from '@/shared/config/badgeConfig'
import { useMaterialsBySubject } from '@/features/materials/hooks/useMaterials'
import {
  useUploadMaterial,
  useDeleteMaterial,
  useDownloadMaterial,
  useUpdateMaterial,
  useBatchSetDownloadDisabled,
  useBatchSetVisibility,
} from '@/features/materials/hooks/useMaterialMutations'
import { useMaterialViewer } from '@/features/materials/hooks/useMaterialViewer'
import { useMaterialFoldersBySubject } from '@/features/materials/hooks/useMaterialFolders'
import { useAiJob, useTranscribeAiMaterial } from '@/features/materials/hooks/useMaterialAi'
import { MaterialCard } from '@/features/materials/components/MaterialCard'
import { MaterialUploadForm } from '@/features/materials/components/MaterialUploadForm'
import { MaterialsGroupedByFolder } from '@/features/materials/components/MaterialsGroupedByFolder'
import { MaterialFolderManager } from '@/features/materials/components/MaterialFolderManager'
import { MaterialViewerModal } from '@/features/materials/components/MaterialViewer'
import { MaterialBatchActionBar } from '@/features/materials/components/MaterialBatchActionBar'
import { MaterialEditModal } from '@/features/materials/components/MaterialEditModal'
import { ConfirmDialog } from '@/shared/components/common/ConfirmDialog'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs'
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog'
import { toast } from '@/shared/hooks/useToast'
import { getApiErrorMessage } from '@/shared/utils/apiError'
import { formatDateTimeLong } from '@/shared/utils/formatters'
import { Loader2, Clock } from 'lucide-react'
import type {
  Material,
  UpdateMaterialRequest,
  UploadMaterialRequest,
} from '@/features/materials/types/material.types'

export function AdminSubjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const subjectId = id ? parseInt(id, 10) : 0

  const { data: subject, isLoading, error } = useAdminSubject(subjectId)
  const archiveMutation = useArchiveSubject()
  const deleteMutation = useDeleteSubject()
  const { dialogProps, confirm } = useConfirmDialog()

  // Materials management
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'grouped'>('grouped')
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  // TanStack Query: la lista se carga sola y las mutaciones la invalidan
  const { data: materials = [], isLoading: isLoadingMaterials } = useMaterialsBySubject(subjectId)
  const { data: folders = [] } = useMaterialFoldersBySubject(subjectId)
  const uploadMutation = useUploadMaterial()
  const deleteMaterialMutation = useDeleteMaterial()
  const downloadMutation = useDownloadMaterial()
  const updateMutation = useUpdateMaterial()
  const batchDownloadMutation = useBatchSetDownloadDisabled()
  const batchVisibilityMutation = useBatchSetVisibility()

  // Transcripción con IA: un job cada vez (el back la ejecuta en un executor de
  // 1 hilo); el polling, el toast y la invalidación de la lista viven en useAiJob
  const [transcribing, setTranscribing] = useState<{ jobId: number; materialName: string } | null>(null)
  const transcribeMutation = useTranscribeAiMaterial()
  const { data: transcribeJob, timedOut: transcribeTimedOut } = useAiJob(transcribing?.jobId ?? null)
  const transcribeInProgress =
    transcribing !== null &&
    !transcribeTimedOut &&
    transcribeJob?.status !== 'COMPLETED' &&
    transcribeJob?.status !== 'FAILED'

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

  const handleArchive = async () => {
    const confirmed = await confirm({
      title: 'Archivar asignatura',
      message: '¿Estás seguro de que quieres archivar esta asignatura?',
      confirmLabel: 'Sí, archivar',
      variant: 'warning',
    })
    if (confirmed) {
      archiveMutation.mutate(subjectId)
    }
  }

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Eliminar asignatura',
      message: '¿Estás seguro de que quieres eliminar esta asignatura? Esta acción no se puede deshacer.',
      confirmLabel: 'Sí, eliminar',
      variant: 'danger',
    })
    if (confirmed) {
      deleteMutation.mutate(subjectId, {
        onSuccess: () => {
          navigate('/admin/subjects')
        },
      })
    }
  }

  const handleUploadMaterial = async (metadata: UploadMaterialRequest, file: File) => {
    try {
      await uploadMutation.mutateAsync({ metadata, file })
      setShowUploadForm(false)
    } catch {
      // el formulario queda abierto; el error se refleja en la mutación
    }
  }

  const handleDeleteMaterial = async (materialId: number) => {
    const confirmed = await confirm({
      title: 'Eliminar material',
      message: '¿Estás seguro de que quieres eliminar este material?',
      confirmLabel: 'Sí, eliminar',
      variant: 'danger',
    })
    if (confirmed) {
      deleteMaterialMutation.mutate(materialId)
    }
  }

  const handleView = (material: Material) => {
    openViewer(material)
  }

  const handleViewerDownload = () => {
    if (viewerMaterial) {
      downloadMutation.mutate({ id: viewerMaterial.id, filename: viewerMaterial.originalFilename })
    }
  }

  // ===== Admin: selection / batch / edit handlers =====

  const handleSelectChange = (id: number, isSelected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (isSelected) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const handleSelectAll = () => {
    setSelectedIds(new Set(materials.map((m) => m.id)))
  }

  const handleClearSelection = () => {
    setSelectedIds(new Set())
  }

  const handleBatchDownload = async (disabled: boolean) => {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return
    const action = disabled ? 'deshabilitar la descarga' : 'habilitar la descarga'
    const confirmed = await confirm({
      title: 'Acción por lotes',
      message: `¿${disabled ? 'Deshabilitar' : 'Habilitar'} la descarga de ${ids.length} material(es)?`,
      confirmLabel: `Sí, ${action}`,
      variant: disabled ? 'danger' : 'warning',
    })
    if (!confirmed) return
    try {
      await batchDownloadMutation.mutateAsync({ ids, disabled })
      handleClearSelection()
    } catch {
      // la selección se conserva para poder reintentar
    }
  }

  const handleBatchVisibility = async (visible: boolean) => {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return
    const action = visible ? 'mostrar' : 'ocultar'
    const confirmed = await confirm({
      title: 'Acción por lotes',
      message: `¿${visible ? 'Mostrar' : 'Ocultar'} ${ids.length} material(es) a los estudiantes?`,
      confirmLabel: `Sí, ${action}`,
      variant: visible ? 'warning' : 'danger',
    })
    if (!confirmed) return
    try {
      await batchVisibilityMutation.mutateAsync({ ids, visible })
      handleClearSelection()
    } catch {
      // la selección se conserva para poder reintentar
    }
  }

  const handleToggleDownloadDisabled = (id: number, disabled: boolean) => {
    updateMutation.mutate({ id, payload: { downloadDisabled: disabled } })
  }

  const handleToggleVisibility = (id: number, visible: boolean) => {
    updateMutation.mutate({ id, payload: { visible } })
  }

  const handleEdit = (material: Material) => {
    setEditingMaterial(material)
  }

  const handleTranscribe = async (material: Material) => {
    if (transcribeInProgress || transcribeMutation.isPending) {
      toast.error('Ya hay una transcripción en marcha; espera a que termine')
      return
    }
    const confirmed = await confirm({
      title: 'Transcribir con IA',
      message: `La IA transcribirá "${material.name}" a un PDF a limpio y lo publicará como material nuevo, visible para los estudiantes, en la misma carpeta. El original se conserva. ¿Continuar?`,
      confirmLabel: 'Sí, transcribir',
      variant: 'info',
    })
    if (!confirmed) return
    transcribeMutation.mutate(material.id, {
      onSuccess: (job) => setTranscribing({ jobId: job.id, materialName: material.name }),
      onError: (err) =>
        toast.error(getApiErrorMessage(err, 'No se pudo lanzar la transcripción')),
    })
  }

  const handleSaveEdit = async (id: number, payload: UpdateMaterialRequest) => {
    try {
      await updateMutation.mutateAsync({ id, payload })
      setEditingMaterial(null)
    } catch {
      // el modal queda abierto para reintentar
    }
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (error || !subject) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/subjects"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          ← Volver a asignaturas
        </Link>
        <ErrorState error={error} title="Error al cargar la asignatura" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumbs
        homeHref="/admin"
        items={[
          { label: 'Asignaturas', href: '/admin/subjects' },
          { label: subject.name },
        ]}
      />

      {/* Header */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {subject.name}
              </h1>
              <ConfigBadge config={SUBJECT_STATUS_CONFIG} value={subject.status} />
            </div>
            <p className="mt-1 font-mono text-gray-500">{subject.code}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to={`/admin/subjects/${subject.id}/edit`}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Editar
            </Link>
            {subject.status !== 'ARCHIVED' && (
              <button
                onClick={handleArchive}
                disabled={archiveMutation.isPending}
                className="rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-yellow-700 disabled:opacity-50"
              >
                {archiveMutation.isPending ? 'Archivando...' : 'Archivar'}
              </button>
            )}
            {subject.currentGroupCount === 0 && (
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Subject Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Información de la Asignatura
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{subject.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Código</dt>
              <dd className="mt-1 font-mono text-sm text-gray-900">
                {subject.code}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Nombre</dt>
              <dd className="mt-1 text-sm text-gray-900">{subject.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Nombre completo
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {subject.displayName}
              </dd>
            </div>
          </dl>
        </div>

        {/* Degree & Status */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Grado y Estado
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Grado</dt>
              <dd className="mt-1">
                <ConfigBadge config={DEGREE_CONFIG} value={subject.degree} />
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Estado</dt>
              <dd className="mt-1">
                <ConfigBadge config={SUBJECT_STATUS_CONFIG} value={subject.status} />
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                ¿Puede crear cursos?
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {subject.canCreateGroup ? (
                  <span className="text-green-600">Sí</span>
                ) : (
                  <span className="text-red-600">No</span>
                )}
              </dd>
            </div>
          </dl>
        </div>

        {/* Courses Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Cursos</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Número de cursos
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {subject.currentGroupCount}
              </dd>
            </div>
            {subject.currentGroupCount > 0 && (
              <div className="pt-2">
                <Link
                  to={`/admin/courses?subjectId=${subject.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Ver cursos de esta asignatura →
                </Link>
              </div>
            )}
          </dl>
        </div>

        {/* Dates */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Fechas</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Fecha de creación
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDateTimeLong(subject.createdAt)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Última actualización
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDateTimeLong(subject.updatedAt)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Materials Management Section */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Gestión de Materiales
          </h2>
          <div className="flex items-center gap-3">
            {isLoadingMaterials && (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
            )}

            {/* View Mode Toggle */}
            {materials.length > 0 && (
              <div className="flex items-center gap-1 rounded-md border border-gray-300 p-1">
                <button
                  onClick={() => setViewMode('grouped')}
                  className={`rounded px-3 py-1 text-sm font-medium transition ${
                    viewMode === 'grouped'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Por Carpetas
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`rounded px-3 py-1 text-sm font-medium transition ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Lista
                </button>
              </div>
            )}

            <Link
              to={`/admin/subjects/${subjectId}/materials/generate`}
              className="rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700"
            >
              Generar con IA
            </Link>

            {!showUploadForm && (
              <button
                onClick={() => setShowUploadForm(true)}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Subir Material
              </button>
            )}
          </div>
        </div>

        {/* Transcripción con IA en curso (el resultado aparece solo al invalidarse la lista) */}
        {transcribing && transcribeInProgress && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-violet-200 bg-violet-50 p-4 text-sm text-violet-800">
            <Loader2 className="h-5 w-5 flex-shrink-0 animate-spin" />
            <span>
              Transcribiendo «{transcribing.materialName}» con IA... suele tardar menos de un
              minuto; el material nuevo aparecerá solo en la lista.
            </span>
          </div>
        )}
        {transcribing && transcribeTimedOut && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <Clock className="h-5 w-5 flex-shrink-0" />
            <span>
              La transcripción está tardando más de lo normal y se ha dejado de consultar su
              estado tras 10 minutos. Puede seguir en marcha: revisa la lista en un rato o
              vuelve a lanzarla.
            </span>
          </div>
        )}

        {/* Upload Form */}
        {showUploadForm && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-gray-900">
              Subir Nuevo Material
            </h3>
            <MaterialUploadForm
              key={subjectId}
              subjectId={subjectId}
              onSubmit={handleUploadMaterial}
              onCancel={() => setShowUploadForm(false)}
              isLoading={uploadMutation.isPending}
            />
          </div>
        )}

        {/* Gestión de carpetas (crear/renombrar/reordenar/borrar) */}
        <div className="mb-6">
          <MaterialFolderManager subjectId={subjectId} />
        </div>

        {/* Materials List or Grouped View */}
        {materials.length > 0 ? (
          viewMode === 'grouped' ? (
            <MaterialsGroupedByFolder
              materials={materials}
              folders={folders}
              showEmptyFolders={true}
              onView={handleView}
              onDownload={(id, filename) => downloadMutation.mutate({ id, filename })}
              onDelete={handleDeleteMaterial}
              canDelete={true}
              isDownloading={downloadMutation.isPending}
              isAdminMode={true}
              selectedIds={selectedIds}
              onSelectChange={handleSelectChange}
              onToggleDownloadDisabled={handleToggleDownloadDisabled}
              onToggleVisibility={handleToggleVisibility}
              onEdit={handleEdit}
              onTranscribe={handleTranscribe}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {materials.map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onView={handleView}
                  onDownload={(id, filename) => downloadMutation.mutate({ id, filename })}
                  onDelete={handleDeleteMaterial}
                  canDelete={true}
                  isDownloading={downloadMutation.isPending}
                  showFolderBadge={true}
                  isAdminMode={true}
                  selected={selectedIds.has(material.id)}
                  onSelectChange={handleSelectChange}
                  onToggleDownloadDisabled={handleToggleDownloadDisabled}
                  onToggleVisibility={handleToggleVisibility}
                  onEdit={handleEdit}
                  onTranscribe={handleTranscribe}
                />
              ))}
            </div>
          )
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-gray-500">
              No hay materiales para esta asignatura.
            </p>
            {!showUploadForm && (
              <button
                onClick={() => setShowUploadForm(true)}
                className="mt-4 text-sm text-blue-600 hover:text-blue-800"
              >
                Subir el primer material →
              </button>
            )}
          </div>
        )}
      </section>

      <MaterialBatchActionBar
        selectedCount={selectedIds.size}
        totalCount={materials.length}
        isLoading={batchDownloadMutation.isPending || batchVisibilityMutation.isPending}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
        onDisableDownload={() => handleBatchDownload(true)}
        onEnableDownload={() => handleBatchDownload(false)}
        onHide={() => handleBatchVisibility(false)}
        onShow={() => handleBatchVisibility(true)}
      />

      <MaterialEditModal
        key={editingMaterial?.id ?? 'none'}
        isOpen={editingMaterial !== null}
        material={editingMaterial}
        isSaving={updateMutation.isPending}
        onClose={() => setEditingMaterial(null)}
        onSave={handleSaveEdit}
      />

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

      <ConfirmDialog {...dialogProps} isLoading={archiveMutation.isPending || deleteMutation.isPending} />
    </div>
  )
}
