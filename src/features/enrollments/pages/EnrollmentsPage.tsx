import { useEnrollments } from '../hooks/useEnrollments'
import { EnrollmentStatusBadge } from '../components/EnrollmentStatusBadge'
import { useAuthStore } from '@/features/auth'
import { Link } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { User, Users, Clock } from 'lucide-react'
import type { Enrollment } from '../types/enrollment.types'

function EnrollmentCard({ enrollment, className }: { enrollment: Enrollment; className?: string }) {
  return (
    <Link
      to={`/dashboard/enrollments/${enrollment.id}`}
      className={cn(
        'rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{enrollment.groupName}</h3>
        </div>
        <EnrollmentStatusBadge
          status={enrollment.status}
          waitingPosition={enrollment.waitingListPosition}
        />
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-gray-700">{enrollment.teacherName}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="text-gray-700">
            {enrollment.currentEnrollmentCount} / {enrollment.groupCapacity} inscritos
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">{enrollment.scheduleSummary}</span>
        </div>
      </div>
    </Link>
  )
}

export function EnrollmentsPage() {
  const { user } = useAuthStore()
  const { data: enrollments, isLoading, error } = useEnrollments(user?.id ?? 0)

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} title="Error al cargar las inscripciones" />
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
          to="/dashboard/subjects"
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
              <EnrollmentCard
                key={enrollment.id}
                enrollment={enrollment}
                className="border-gray-200"
              />
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
              <EnrollmentCard
                key={enrollment.id}
                enrollment={enrollment}
                className="border-yellow-200 bg-yellow-50"
              />
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
              <EnrollmentCard
                key={enrollment.id}
                enrollment={enrollment}
                className="border-gray-200 opacity-75"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
