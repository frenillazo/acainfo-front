import { useParams, Link } from 'react-router-dom'
import { useAdminGroup } from '../../groups/hooks/useAdminGroups'
import {
  useSchedulesByGroup,
  useCreateSchedule,
  useUpdateSchedule,
  useDeleteSchedule,
} from '../hooks/useAdminSchedules'
import { WeeklyScheduleGrid } from '../components/WeeklyScheduleGrid'
import { GroupStatusBadge } from '../../groups/components/GroupStatusBadge'
import { GroupTypeBadge } from '../../groups/components/GroupTypeBadge'
import { ConfirmDialog } from '@/shared/components/common/ConfirmDialog'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog'
import type { CreateScheduleRequest, UpdateScheduleRequest } from '../../types/admin.types'

export function AdminGroupSchedulesPage() {
  const { groupId } = useParams<{ groupId: string }>()
  const groupIdNum = groupId ? parseInt(groupId, 10) : 0

  const { data: group, isLoading: isLoadingGroup, error: groupError } = useAdminGroup(groupIdNum)
  const { data: schedules, isLoading: isLoadingSchedules } = useSchedulesByGroup(groupIdNum)

  const createMutation = useCreateSchedule()
  const updateMutation = useUpdateSchedule()
  const deleteMutation = useDeleteSchedule()
  const { dialogProps, confirm } = useConfirmDialog()

  const handleCreateSchedule = (data: CreateScheduleRequest) => {
    createMutation.mutate(data)
  }

  const handleUpdateSchedule = (id: number, data: UpdateScheduleRequest) => {
    updateMutation.mutate({ id, data })
  }

  const handleDeleteSchedule = async (id: number) => {
    const confirmed = await confirm({
      title: 'Eliminar horario',
      message: '¿Estás seguro de que quieres eliminar este horario?',
      confirmLabel: 'Sí, eliminar',
      variant: 'danger',
    })
    if (confirmed) {
      deleteMutation.mutate(id)
    }
  }

  if (isLoadingGroup) {
    return <LoadingState />
  }

  if (groupError || !group) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/groups"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          ← Volver a grupos
        </Link>
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          Error al cargar el grupo. Por favor, intenta de nuevo.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link to="/admin/groups" className="text-blue-600 hover:text-blue-800">
          Grupos
        </Link>
        <span className="text-gray-400">/</span>
        <Link to={`/admin/groups/${group.id}`} className="text-blue-600 hover:text-blue-800">
          {group.subjectCode}
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-600">Horarios</span>
      </div>

      {/* Header */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Horarios de {group.subjectName}
              </h1>
              <GroupTypeBadge type={group.type} />
              <GroupStatusBadge status={group.status} />
            </div>
            <p className="mt-1 text-gray-500">
              {group.subjectCode} · Profesor: {group.teacherName}
            </p>
          </div>
          <Link
            to={`/admin/groups/${group.id}`}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Ver grupo
          </Link>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Horario semanal</h2>

        {isLoadingSchedules ? (
          <LoadingState />
        ) : (
          <WeeklyScheduleGrid
            schedules={schedules ?? []}
            groupId={groupIdNum}
            onCreateSchedule={handleCreateSchedule}
            onUpdateSchedule={handleUpdateSchedule}
            onDeleteSchedule={handleDeleteSchedule}
            isCreating={createMutation.isPending}
            isUpdating={updateMutation.isPending}
            readOnly={group.status === 'CANCELLED'}
          />
        )}

        {group.status === 'CANCELLED' && (
          <div className="mt-4 rounded-md bg-yellow-50 p-3 text-sm text-yellow-700">
            Este grupo está cancelado. No se pueden modificar los horarios.
          </div>
        )}
      </div>

      {/* Error messages */}
      {createMutation.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          Error al crear horario: {(createMutation.error as Error).message}
        </div>
      )}
      {updateMutation.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          Error al actualizar horario: {(updateMutation.error as Error).message}
        </div>
      )}
      {deleteMutation.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          Error al eliminar horario: {(deleteMutation.error as Error).message}
        </div>
      )}

      <ConfirmDialog {...dialogProps} isLoading={deleteMutation.isPending} />
    </div>
  )
}
