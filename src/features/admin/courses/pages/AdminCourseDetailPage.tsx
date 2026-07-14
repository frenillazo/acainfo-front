import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  useAdminCourse,
  useCancelCourse,
  useDeleteCourse,
} from '../hooks/useAdminCourses'
import { ConfirmDialog } from '@/shared/components/common/ConfirmDialog'
import { ConfigBadge } from '@/shared/components/ui'
import { COURSE_STATUS_CONFIG } from '@/shared/config/badgeConfig'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs'
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog'
import { formatDateTimeLong } from '@/shared/utils/formatters'

export function AdminCourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const courseId = id ? parseInt(id, 10) : 0

  const { data: course, isLoading, error } = useAdminCourse(courseId)
  const cancelMutation = useCancelCourse()
  const deleteMutation = useDeleteCourse()
  const { dialogProps, confirm } = useConfirmDialog()

  const handleCancel = async () => {
    const confirmed = await confirm({
      title: 'Cancelar curso',
      message: '¿Estás seguro de que quieres cancelar este curso?',
      confirmLabel: 'Sí, cancelar',
      variant: 'warning',
    })
    if (confirmed) {
      cancelMutation.mutate(courseId)
    }
  }

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Eliminar curso',
      message: '¿Estás seguro de que quieres eliminar este curso? Esta acción no se puede deshacer.',
      confirmLabel: 'Sí, eliminar',
      variant: 'danger',
    })
    if (confirmed) {
      deleteMutation.mutate(courseId, {
        onSuccess: () => {
          navigate('/admin/courses')
        },
      })
    }
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (error || !course) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/courses"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          ← Volver a cursos
        </Link>
        <ErrorState error={error} title="Error al cargar el curso" />
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
          { label: course.name },
        ]}
      />

      {/* Header */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {course.name}
              </h1>
              <ConfigBadge config={COURSE_STATUS_CONFIG} value={course.status} />
            </div>
            <p className="mt-1 text-gray-500">{course.subjectName} · {course.subjectCode}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to={`/admin/enrollments?courseId=${course.id}`}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Inscripciones
            </Link>
            <Link
              to={`/admin/courses/${course.id}/schedules`}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Horarios
            </Link>
            <Link
              to={`/admin/courses/${course.id}/edit`}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Editar
            </Link>
            {course.status !== 'CANCELLED' && (
              <button
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
                className="rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-yellow-700 disabled:opacity-50"
              >
                {cancelMutation.isPending ? 'Cancelando...' : 'Cancelar curso'}
              </button>
            )}
            {course.currentEnrollmentCount === 0 && (
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
        {/* Course Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Información del Curso
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{course.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Estado</dt>
              <dd className="mt-1">
                <ConfigBadge config={COURSE_STATUS_CONFIG} value={course.status} />
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Fecha inicio</dt>
              <dd className="mt-1 text-sm text-gray-900">{course.startDate}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Fecha fin</dt>
              <dd className="mt-1 text-sm text-gray-900">{course.endDate}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Precio/mes
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {course.pricePerMonth !== null
                  ? `${course.pricePerMonth.toFixed(2)} €/mes`
                  : 'No definido'}
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
                {course.subjectName} ({course.subjectCode})
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">ID Asignatura</dt>
              <dd className="mt-1 text-sm text-gray-900">{course.subjectId}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Profesor</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {course.teacherName ?? 'Sin asignar'}
              </dd>
            </div>
            {course.teacherId !== null && (
              <div className="pt-2">
                <Link
                  to={`/admin/teachers/${course.teacherId}`}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Ver perfil del profesor →
                </Link>
              </div>
            )}
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
                {course.currentEnrollmentCount}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Capacidad
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {course.capacity ?? 'Sin límite (virtual)'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Plazas disponibles
              </dt>
              <dd
                className={`mt-1 text-sm font-medium ${
                  course.availableSeats === 0 ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {course.availableSeats ?? 'Sin límite'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                ¿Puede inscribirse?
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {course.canEnroll ? 'Sí' : 'No'}
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
                {formatDateTimeLong(course.createdAt)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Última actualización
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDateTimeLong(course.updatedAt)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <ConfirmDialog {...dialogProps} isLoading={cancelMutation.isPending || deleteMutation.isPending} />
    </div>
  )
}
