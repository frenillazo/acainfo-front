import { useQuery } from '@tanstack/react-query'
import { enrollmentApi } from '@/features/enrollments/services/enrollmentApi'
import { PendingEnrollmentCard } from '@/features/enrollments/components/PendingEnrollmentCard'
import { Loader2, Inbox } from 'lucide-react'

export function AdminPendingEnrollmentsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['pendingEnrollments', 'all'],
    queryFn: () =>
      enrollmentApi.getAll({ status: 'PENDING_APPROVAL', size: 100, sortBy: 'enrolledAt', sortDirection: 'ASC' }),
  })

  const pendingEnrollments = data?.content ?? []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Solicitudes de Inscripción Pendientes
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Aprueba o rechaza las solicitudes de inscripción de estudiantes. Las solicitudes expiran automáticamente después de 48 horas.
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-700">
          Error al cargar las solicitudes pendientes
        </div>
      )}

      {!isLoading && pendingEnrollments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Inbox className="h-12 w-12 mb-4" />
          <p className="text-lg font-medium">No hay solicitudes pendientes</p>
          <p className="text-sm">Las nuevas solicitudes de inscripción aparecerán aquí</p>
        </div>
      )}

      {!isLoading && pendingEnrollments.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pendingEnrollments.map((enrollment) => (
            <PendingEnrollmentCard key={enrollment.id} enrollment={enrollment} />
          ))}
        </div>
      )}
    </div>
  )
}
