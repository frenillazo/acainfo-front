import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  useAdminGroup,
  useCancelGroup,
  useDeleteGroup,
} from '../hooks/useAdminGroups'
import { GroupStatusBadge } from '../components/GroupStatusBadge'
import { GroupTypeBadge } from '../components/GroupTypeBadge'
import { ConfirmDialog } from '@/shared/components/common/ConfirmDialog'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs'
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog'

export function AdminGroupDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const groupId = id ? parseInt(id, 10) : 0

  const { data: group, isLoading, error } = useAdminGroup(groupId)
  const cancelMutation = useCancelGroup()
  const deleteMutation = useDeleteGroup()
  const { dialogProps, confirm } = useConfirmDialog()

  const handleCancel = async () => {
    const confirmed = await confirm({
      title: 'Cancelar grupo',
      message: '¿Estás seguro de que quieres cancelar este grupo?',
      confirmLabel: 'Sí, cancelar',
      variant: 'warning',
    })
    if (confirmed) {
      cancelMutation.mutate(groupId)
    }
  }

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Eliminar grupo',
      message: '¿Estás seguro de que quieres eliminar este grupo? Esta acción no se puede deshacer.',
      confirmLabel: 'Sí, eliminar',
      variant: 'danger',
    })
    if (confirmed) {
      deleteMutation.mutate(groupId, {
        onSuccess: () => {
          navigate('/admin/groups')
        },
      })
    }
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (error || !group) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/groups"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          ← Volver a grupos
        </Link>
        <ErrorState error={error} title="Error al cargar el grupo" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumbs
        homeHref="/admin"
        items={[
          { label: 'Grupos', href: '/admin/groups' },
          { label: group.name },
        ]}
      />

      {/* Header */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {group.name}
              </h1>
              <GroupTypeBadge type={group.type} />
              <GroupStatusBadge status={group.status} />
            </div>
            <p className="mt-1 text-gray-500">{group.subjectName} · {group.subjectCode}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to={`/admin/groups/${group.id}/schedules`}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Horarios
            </Link>
            <Link
              to={`/admin/groups/${group.id}/edit`}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Editar
            </Link>
            {group.status !== 'CANCELLED' && (
              <button
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
                className="rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-yellow-700 disabled:opacity-50"
              >
                {cancelMutation.isPending ? 'Cancelando...' : 'Cancelar grupo'}
              </button>
            )}
            {group.currentEnrollmentCount === 0 && (
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
        {/* Group Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Información del Grupo
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{group.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Tipo</dt>
              <dd className="mt-1">
                <GroupTypeBadge type={group.type} />
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Estado</dt>
              <dd className="mt-1">
                <GroupStatusBadge status={group.status} />
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Precio por hora
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {group.pricePerHour.toFixed(2)} €/hora
              </dd>
            </div>
          </dl>
        </div>

        {/* Subject & Teacher Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Asignatura y Profesor
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Asignatura</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {group.subjectName} ({group.subjectCode})
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">ID Asignatura</dt>
              <dd className="mt-1 text-sm text-gray-900">{group.subjectId}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Profesor</dt>
              <dd className="mt-1 text-sm text-gray-900">{group.teacherName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">ID Profesor</dt>
              <dd className="mt-1 text-sm text-gray-900">{group.teacherId}</dd>
            </div>
            <div className="pt-2">
              <Link
                to={`/admin/teachers/${group.teacherId}`}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Ver perfil del profesor →
              </Link>
            </div>
          </dl>
        </div>

        {/* Capacity Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Capacidad</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Inscripciones actuales
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {group.currentEnrollmentCount}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Capacidad máxima
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{group.maxCapacity}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Plazas disponibles
              </dt>
              <dd
                className={`mt-1 text-sm font-medium ${
                  group.availableSeats === 0 ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {group.availableSeats}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                ¿Puede inscribirse?
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {group.canEnroll ? 'Sí' : 'No'}
              </dd>
            </div>
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
                {new Date(group.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Última actualización
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(group.updatedAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <ConfirmDialog {...dialogProps} isLoading={cancelMutation.isPending || deleteMutation.isPending} />
    </div>
  )
}
