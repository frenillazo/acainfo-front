import { useState, useMemo } from 'react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useEnrollments } from '@/features/enrollments/hooks/useEnrollments'
import { useSessions } from '../hooks/useSessions'
import { SessionCard } from '../components/SessionCard'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import type { SessionFilters } from '../types/session.types'

export function SessionsPage() {
  const { user } = useAuthStore()
  const studentId = user?.id

  const { data: enrollments } = useEnrollments(studentId ?? 0)
  const [filters] = useState<SessionFilters>({
    page: 0,
    size: 50,
    sortBy: 'date',
    sortDirection: 'ASC',
  })

  const { data, isLoading, error } = useSessions(filters)

  // Get all group IDs from active enrollments
  const activeEnrollments = useMemo(() => {
    if (!enrollments) return []
    return enrollments.filter((e) => e.isActive || e.isOnWaitingList)
  }, [enrollments])

  // Filter sessions by student's enrolled groups
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const mySessions = useMemo(() => {
    if (!data?.content || !activeEnrollments.length) return []

    const enrolledGroupIds = new Set(activeEnrollments.map((e) => e.groupId))
    return data.content.filter((session) => enrolledGroupIds.has(session.groupId))
  }, [data?.content, activeEnrollments])

  // Separate sessions
  const upcomingSessions = useMemo(() => {
    const now = new Date()
    return mySessions.filter(
      (s) => s.status === 'SCHEDULED' && new Date(s.date) >= now
    )
  }, [mySessions])

  const pastSessions = useMemo(() => {
    const now = new Date()
    return mySessions.filter(
      (s) =>
        s.status === 'COMPLETED' ||
        (s.status === 'SCHEDULED' && new Date(s.date) < now)
    )
  }, [mySessions])

  const cancelledSessions = useMemo(() => {
    return mySessions.filter((s) => s.status === 'CANCELLED' || s.status === 'POSTPONED')
  }, [mySessions])

  if (error) {
    return <ErrorState error={error} title="Error al cargar las sesiones" />
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (!activeEnrollments.length) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Sesiones</h1>
          <p className="mt-1 text-sm text-gray-500">
            Consulta tus próximas clases y sesiones completadas
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
          <p>No tienes inscripciones activas.</p>
          <p className="mt-2 text-sm">Inscríbete en un grupo para ver tus sesiones aquí.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis Sesiones</h1>
        <p className="mt-1 text-sm text-gray-500">
          Consulta tus próximas clases y sesiones completadas
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-500">Próximas sesiones</div>
          <div className="mt-1 text-2xl font-semibold text-blue-600">
            {upcomingSessions.length}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-500">Completadas</div>
          <div className="mt-1 text-2xl font-semibold text-green-600">
            {pastSessions.length}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-500">Canceladas/Pospuestas</div>
          <div className="mt-1 text-2xl font-semibold text-yellow-600">
            {cancelledSessions.length}
          </div>
        </div>
      </div>

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Próximas Sesiones ({upcomingSessions.length})
          </h2>
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        </div>
      )}

      {/* Past Sessions */}
      {pastSessions.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Sesiones Pasadas ({pastSessions.length})
          </h2>
          <div className="space-y-4">
            {pastSessions.slice(0, 10).map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
          {pastSessions.length > 10 && (
            <p className="mt-4 text-center text-sm text-gray-500">
              Mostrando las últimas 10 sesiones de {pastSessions.length}
            </p>
          )}
        </div>
      )}

      {/* Cancelled/Postponed Sessions */}
      {cancelledSessions.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Sesiones Canceladas/Pospuestas ({cancelledSessions.length})
          </h2>
          <div className="space-y-4">
            {cancelledSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        </div>
      )}

      {mySessions.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
          No hay sesiones programadas para tus grupos actuales.
        </div>
      )}
    </div>
  )
}
