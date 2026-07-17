import { useParams, Link } from 'react-router-dom'
import { useAdminCourse } from '../../courses/hooks/useAdminCourses'
import {
  useSchedulesByCourse,
  useCreateSchedule,
  useUpdateSchedule,
  useDeleteSchedule,
} from '../hooks/useAdminSchedules'
import { WeeklyScheduleGrid } from '../components/WeeklyScheduleGrid'
import { ConfirmDialog } from '@/shared/components/common/ConfirmDialog'
import { Card, ConfigBadge } from '@/shared/components/ui'
import { COURSE_STATUS_CONFIG } from '@/shared/config/badgeConfig'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs'
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog'
import type { CreateScheduleRequest, UpdateScheduleRequest } from '../../types/admin.types'
import { getApiErrorMessage } from '@/shared/utils/apiError'

export function AdminCourseSchedulesPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const courseIdNum = courseId ? parseInt(courseId, 10) : 0

  const { data: course, isLoading: isLoadingCourse, error: courseError } = useAdminCourse(courseIdNum)
  const { data: schedules, isLoading: isLoadingSchedules } = useSchedulesByCourse(courseIdNum)

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

  if (isLoadingCourse) {
    return <LoadingState />
  }

  if (courseError || !course) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/courses"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          ← Volver a cursos
        </Link>
        <ErrorState error={courseError} title="Error al cargar el curso" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumbs
        homeHref="/admin"
        items={[
          { label: 'Cursos', href: '/admin/courses' },
          { label: course.subjectCode, href: `/admin/courses/${course.id}` },
          { label: 'Horarios' },
        ]}
      />

      {/* Header */}
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Horarios de {course.subjectName}
              </h1>
              <ConfigBadge config={COURSE_STATUS_CONFIG} value={course.status} />
            </div>
            <p className="mt-1 text-gray-500">
              {course.subjectCode} · Profesor: {course.teacherName ?? 'Sin asignar'}
            </p>
          </div>
          <Link
            to={`/admin/courses/${course.id}`}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Ver curso
          </Link>
        </div>
      </Card>

      {/* Schedule Grid */}
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Horario semanal</h2>

        {isLoadingSchedules ? (
          <LoadingState />
        ) : (
          <WeeklyScheduleGrid
            schedules={schedules ?? []}
            courseId={courseIdNum}
            onCreateSchedule={handleCreateSchedule}
            onUpdateSchedule={handleUpdateSchedule}
            onDeleteSchedule={handleDeleteSchedule}
            isCreating={createMutation.isPending}
            isUpdating={updateMutation.isPending}
            readOnly={course.status === 'CANCELLED'}
          />
        )}

        {course.status === 'CANCELLED' && (
          <div className="mt-4 rounded-md bg-yellow-50 p-3 text-sm text-yellow-700">
            Este curso está cancelado. No se pueden modificar los horarios.
          </div>
        )}
      </Card>

      {/* Error messages */}
      {createMutation.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          Error al crear horario: {getApiErrorMessage(createMutation.error, 'inténtalo de nuevo')}
        </div>
      )}
      {updateMutation.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          Error al actualizar horario: {getApiErrorMessage(updateMutation.error, 'inténtalo de nuevo')}
        </div>
      )}
      {deleteMutation.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          Error al eliminar horario: {getApiErrorMessage(deleteMutation.error, 'inténtalo de nuevo')}
        </div>
      )}

      <ConfirmDialog {...dialogProps} isLoading={deleteMutation.isPending} />
    </div>
  )
}
