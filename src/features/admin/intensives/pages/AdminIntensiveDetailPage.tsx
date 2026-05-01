import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  useAdminIntensive,
  useCancelIntensive,
  useCreateIntensiveSessionsBulk,
  useDeleteIntensive,
  useIntensiveSessions,
} from '../hooks/useAdminIntensives'
import { IntensiveSessionList } from '../components/IntensiveSessionList'
import { IntensiveSessionBulkForm } from '../components/IntensiveSessionBulkForm'
import { ConfirmDialog } from '@/shared/components/common/ConfirmDialog'
import { ConfigBadge } from '@/shared/components/ui'
import { GROUP_STATUS_CONFIG } from '@/shared/config/badgeConfig'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs'
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog'
import { Plus } from 'lucide-react'
import type { IntensiveSessionEntry } from '../types/intensive.types'

export function AdminIntensiveDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const intensiveId = id ? parseInt(id, 10) : 0

  const { data: intensive, isLoading, error } = useAdminIntensive(intensiveId)
  const {
    data: sessions,
    isLoading: isLoadingSessions,
    error: sessionsError,
  } = useIntensiveSessions(intensiveId)

  const cancelMutation = useCancelIntensive()
  const deleteMutation = useDeleteIntensive()
  const bulkMutation = useCreateIntensiveSessionsBulk()
  const { dialogProps, confirm } = useConfirmDialog()

  const [showBulkForm, setShowBulkForm] = useState(false)

  const handleCancel = async () => {
    const confirmed = await confirm({
      title: 'Cancelar intensivo',
      message: '¿Seguro que quieres cancelar este intensivo?',
      confirmLabel: 'Sí, cancelar',
      variant: 'warning',
    })
    if (confirmed) cancelMutation.mutate(intensiveId)
  }

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Eliminar intensivo',
      message: '¿Seguro que quieres eliminar este intensivo? Esta acción no se puede deshacer.',
      confirmLabel: 'Sí, eliminar',
      variant: 'danger',
    })
    if (confirmed) {
      deleteMutation.mutate(intensiveId, {
        onSuccess: () => navigate('/admin/intensives'),
      })
    }
  }

  const handleBulkSubmit = (entries: IntensiveSessionEntry[]) => {
    bulkMutation.mutate(
      { id: intensiveId, entries },
      { onSuccess: () => setShowBulkForm(false) }
    )
  }

  if (isLoading) return <LoadingState />

  if (error || !intensive) {
    return (
      <div className="space-y-4">
        <Link to="/admin/intensives" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
          ← Volver a intensivos
        </Link>
        <ErrorState error={error} title="Error al cargar el intensivo" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        homeHref="/admin"
        items={[{ label: 'Intensivos', href: '/admin/intensives' }, { label: intensive.name }]}
      />

      {/* Header */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{intensive.name}</h1>
              <ConfigBadge config={GROUP_STATUS_CONFIG} value={intensive.status} />
            </div>
            <p className="mt-1 text-gray-500">
              {intensive.subjectName} · {intensive.subjectCode}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to={`/admin/enrollments?intensiveId=${intensive.id}`}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Inscripciones
            </Link>
            <Link
              to={`/admin/intensives/${intensive.id}/edit`}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Editar
            </Link>
            {intensive.status !== 'CANCELLED' && (
              <button
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
                className="rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-yellow-700 disabled:opacity-50"
              >
                {cancelMutation.isPending ? 'Cancelando...' : 'Cancelar intensivo'}
              </button>
            )}
            {intensive.currentEnrollmentCount === 0 && (
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

      {/* Info grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Información</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Asignatura</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {intensive.subjectName} ({intensive.subjectCode})
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Profesor</dt>
              <dd className="mt-1 text-sm text-gray-900">{intensive.teacherName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Precio por hora</dt>
              <dd className="mt-1 text-sm text-gray-900">{intensive.pricePerHour.toFixed(2)} €/hora</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Estado</dt>
              <dd className="mt-1">
                <ConfigBadge config={GROUP_STATUS_CONFIG} value={intensive.status} />
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Capacidad y fechas</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Inscripciones actuales</dt>
              <dd className="mt-1 text-sm text-gray-900">{intensive.currentEnrollmentCount}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Capacidad máxima</dt>
              <dd className="mt-1 text-sm text-gray-900">{intensive.maxCapacity}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Plazas disponibles</dt>
              <dd
                className={`mt-1 text-sm font-medium ${
                  intensive.availableSeats === 0 ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {intensive.availableSeats}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Rango de fechas</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {intensive.startDate} → {intensive.endDate}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Sessions */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Sesiones</h2>
          {!showBulkForm && intensive.status !== 'CANCELLED' && (
            <button
              onClick={() => setShowBulkForm(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Añadir sesiones
            </button>
          )}
        </div>

        {showBulkForm && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-gray-900">Añadir sesiones en bloque</h3>
            <IntensiveSessionBulkForm
              intensiveStartDate={intensive.startDate}
              intensiveEndDate={intensive.endDate}
              isSubmitting={bulkMutation.isPending}
              error={bulkMutation.error as Error | null}
              onSubmit={handleBulkSubmit}
              onCancel={() => setShowBulkForm(false)}
            />
          </div>
        )}

        {isLoadingSessions ? (
          <LoadingState />
        ) : sessionsError ? (
          <ErrorState error={sessionsError} title="Error al cargar las sesiones" />
        ) : sessions ? (
          <IntensiveSessionList sessions={sessions} />
        ) : null}
      </section>

      <ConfirmDialog
        {...dialogProps}
        isLoading={cancelMutation.isPending || deleteMutation.isPending}
      />
    </div>
  )
}
