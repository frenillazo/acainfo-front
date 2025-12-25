import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  useAdminEnrollment,
  useWithdrawEnrollment,
} from '../hooks/useAdminEnrollments'
import { EnrollmentStatusBadge } from '@/features/enrollments/components/EnrollmentStatusBadge'

export function AdminEnrollmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const enrollmentId = id ? parseInt(id, 10) : 0

  const { data: enrollment, isLoading, error } = useAdminEnrollment(enrollmentId)
  const withdrawMutation = useWithdrawEnrollment()

  const handleWithdraw = () => {
    if (
      window.confirm('¿Estás seguro de que quieres retirar esta inscripción?')
    ) {
      withdrawMutation.mutate(enrollmentId, {
        onSuccess: () => {
          navigate('/admin/enrollments')
        },
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    )
  }

  if (error || !enrollment) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/enrollments"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          ← Volver a inscripciones
        </Link>
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          Error al cargar la inscripción. Por favor, intenta de nuevo.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        to="/admin/enrollments"
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
      >
        ← Volver a inscripciones
      </Link>

      {/* Header */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Inscripción #{enrollment.id}
            </h1>
            <p className="mt-1 text-gray-500">
              {enrollment.studentName} en {enrollment.subjectName}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <EnrollmentStatusBadge
              status={enrollment.status}
              waitingPosition={enrollment.waitingListPosition}
            />
            <Link
              to={`/admin/enrollments/${enrollment.id}/change-group`}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Cambiar grupo
            </Link>
            {enrollment.canBeWithdrawn && (
              <button
                onClick={handleWithdraw}
                disabled={withdrawMutation.isPending}
                className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {withdrawMutation.isPending ? 'Retirando...' : 'Retirar'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Enrollment Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Información de la Inscripción
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{enrollment.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Estado</dt>
              <dd className="mt-1">
                <EnrollmentStatusBadge
                  status={enrollment.status}
                  waitingPosition={enrollment.waitingListPosition}
                />
              </dd>
            </div>
            {enrollment.isOnWaitingList && enrollment.waitingListPosition && (
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Posición en lista de espera
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  #{enrollment.waitingListPosition}
                </dd>
              </div>
            )}
            {enrollment.wasPromotedFromWaitingList && (
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Promovido desde lista de espera
                </dt>
                <dd className="mt-1 text-sm text-green-600">Sí</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Student Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Información del Estudiante
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">ID Estudiante</dt>
              <dd className="mt-1 text-sm text-gray-900">{enrollment.studentId}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Nombre</dt>
              <dd className="mt-1 text-sm text-gray-900">{enrollment.studentName}</dd>
            </div>
            <div className="pt-2">
              <Link
                to={`/admin/users/${enrollment.studentId}`}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Ver perfil del estudiante →
              </Link>
            </div>
          </dl>
        </div>

        {/* Subject & Group Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Asignatura y Grupo
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Asignatura</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {enrollment.subjectName} ({enrollment.subjectCode})
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">ID Grupo</dt>
              <dd className="mt-1 text-sm text-gray-900">{enrollment.groupId}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Tipo de grupo</dt>
              <dd className="mt-1 text-sm text-gray-900">{enrollment.groupType}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Profesor</dt>
              <dd className="mt-1 text-sm text-gray-900">{enrollment.teacherName}</dd>
            </div>
          </dl>
        </div>

        {/* Dates */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Fechas</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Fecha de inscripción
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(enrollment.enrolledAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </dd>
            </div>
            {enrollment.promotedAt && (
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Fecha de promoción
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(enrollment.promotedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </dd>
              </div>
            )}
            {enrollment.withdrawnAt && (
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Fecha de retiro
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(enrollment.withdrawnAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-500">Creación</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(enrollment.createdAt).toLocaleDateString('es-ES', {
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
                {new Date(enrollment.updatedAt).toLocaleDateString('es-ES', {
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
    </div>
  )
}
