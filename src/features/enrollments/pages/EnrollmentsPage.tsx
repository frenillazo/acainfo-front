import { useEnrollments } from '../hooks/useEnrollments'
import { EnrollmentStatusBadge } from '../components/EnrollmentStatusBadge'
import { useAuthStore } from '@/features/auth'
import { Link } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'
import { formatDate } from '@/shared/utils/formatters'
import { LoadingState } from '@/shared/components/common/LoadingState'

export function EnrollmentsPage() {
  const { user } = useAuthStore()
  const { data: enrollments, isLoading, error } = useEnrollments(user?.id ?? 0)

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Error al cargar las inscripciones. Por favor, intenta de nuevo.
      </div>
    )
  }

  const activeEnrollments = enrollments?.filter((e) => e.status === 'ACTIVE') ?? []
  const waitingEnrollments = enrollments?.filter((e) => e.status === 'WAITING_LIST') ?? []
  const otherEnrollments = enrollments?.filter(
    (e) => e.status !== 'ACTIVE' && e.status !== 'WAITING_LIST'
  ) ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Mis Inscripciones</h1>
        <Link
          to="/subjects"
          className={cn(
            'rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white',
            'hover:bg-blue-700'
          )}
        >
          Ver asignaturas
        </Link>
      </div>

      {/* Active enrollments */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Inscripciones Activas ({activeEnrollments.length})
        </h2>
        {activeEnrollments.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeEnrollments.map((enrollment) => (
              <Link
                key={enrollment.id}
                to={`/enrollments/${enrollment.id}`}
                className={cn(
                  'rounded-lg border border-gray-200 bg-white p-4 shadow-sm',
                  'transition-shadow hover:shadow-md'
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Grupo #{enrollment.groupId}
                    </p>
                    <p className="text-sm text-gray-500">
                      Inscrito: {formatDate(enrollment.enrolledAt)}
                    </p>
                  </div>
                  <EnrollmentStatusBadge status={enrollment.status} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-500">
            No tienes inscripciones activas
          </div>
        )}
      </section>

      {/* Waiting list */}
      {waitingEnrollments.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Lista de Espera ({waitingEnrollments.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {waitingEnrollments.map((enrollment) => (
              <Link
                key={enrollment.id}
                to={`/enrollments/${enrollment.id}`}
                className={cn(
                  'rounded-lg border border-yellow-200 bg-yellow-50 p-4',
                  'transition-shadow hover:shadow-md'
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Grupo #{enrollment.groupId}
                    </p>
                    <p className="text-sm text-gray-500">
                      Inscrito: {formatDate(enrollment.enrolledAt)}
                    </p>
                  </div>
                  <EnrollmentStatusBadge
                    status={enrollment.status}
                    waitingPosition={enrollment.waitingListPosition}
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Other enrollments */}
      {otherEnrollments.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Historial ({otherEnrollments.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherEnrollments.map((enrollment) => (
              <Link
                key={enrollment.id}
                to={`/enrollments/${enrollment.id}`}
                className={cn(
                  'rounded-lg border border-gray-200 bg-white p-4 opacity-75',
                  'transition-shadow hover:shadow-md'
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Grupo #{enrollment.groupId}
                    </p>
                    <p className="text-sm text-gray-500">
                      Inscrito: {formatDate(enrollment.enrolledAt)}
                    </p>
                  </div>
                  <EnrollmentStatusBadge status={enrollment.status} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
