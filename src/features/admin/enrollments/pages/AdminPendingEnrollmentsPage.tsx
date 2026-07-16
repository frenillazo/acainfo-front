import { useQuery } from '@tanstack/react-query'
import { enrollmentApi } from '@/features/enrollments/services/enrollmentApi'
import { PendingEnrollmentCard } from '@/features/enrollments/components/PendingEnrollmentCard'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { Loader2, Inbox } from 'lucide-react'

export function AdminPendingEnrollmentsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['pendingEnrollments', 'all'],
    queryFn: () =>
      enrollmentApi.getAll({ status: 'PENDING_APPROVAL', size: 100, sortBy: 'enrolledAt', sortDirection: 'ASC' }),
  })

  const pendingEnrollments = data?.content ?? []

  // Cuántas solicitudes compiten por el mismo curso: con cupo, aprobar una
  // condiciona a las demás.
  const pendingByCourse = pendingEnrollments.reduce<Record<number, number>>((acc, e) => {
    acc[e.courseId] = (acc[e.courseId] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Solicitudes de Inscripción Pendientes
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Aprueba o rechaza las solicitudes de inscripción de estudiantes. Esperan aquí hasta que
          respondas: no caducan solas.
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {error && (
        <ErrorState error={error} title="Error al cargar las solicitudes pendientes" />
      )}

      {!isLoading && !error && pendingEnrollments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Inbox className="h-12 w-12 mb-4" aria-hidden="true" />
          <p className="text-lg font-medium">No hay solicitudes pendientes</p>
          <p className="text-sm">Las nuevas solicitudes de inscripción aparecerán aquí</p>
        </div>
      )}

      {!isLoading && pendingEnrollments.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pendingEnrollments.map((enrollment) => (
            <PendingEnrollmentCard
              key={enrollment.id}
              enrollment={enrollment}
              pendingForSameCourse={pendingByCourse[enrollment.courseId]}
            />
          ))}
        </div>
      )}
    </div>
  )
}
