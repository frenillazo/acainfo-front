import { useState, useMemo } from 'react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useEnrollments } from '@/features/enrollments/hooks/useEnrollments'
import { useSessions } from '../hooks/useSessions'
import { SessionCard } from '../components/SessionCard'
import { StudentWeeklyScheduleGrid } from '../components/StudentWeeklyScheduleGrid'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { ChevronLeft, ChevronRight, Calendar, List } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import type { SessionFilters } from '../types/session.types'

type ViewMode = 'calendar' | 'list'

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function getWeekEnd(weekStart: Date): Date {
  const d = new Date(weekStart)
  d.setDate(d.getDate() + 6)
  return d
}

function formatWeekRange(weekStart: Date): string {
  const weekEnd = getWeekEnd(weekStart)
  const startStr = weekStart.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  const endStr = weekEnd.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
  return `${startStr} - ${endStr}`
}

export function SessionsPage() {
  const { user } = useAuthStore()
  const studentId = user?.id

  const { data: enrollments } = useEnrollments(studentId ?? 0)
  const [viewMode, setViewMode] = useState<ViewMode>('calendar')
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getWeekStart(new Date()))
  const [filters] = useState<SessionFilters>({
    page: 0,
    size: 100,
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
  const mySessions = useMemo(() => {
    if (!data?.content || !activeEnrollments.length) return []

    const enrolledGroupIds = new Set(activeEnrollments.map((e) => e.groupId))
    return data.content.filter((session) => enrolledGroupIds.has(session.groupId))
  }, [data?.content, activeEnrollments])

  // Filter sessions for the current week (calendar view)
  const weekSessions = useMemo(() => {
    const weekEnd = getWeekEnd(currentWeekStart)
    return mySessions.filter((s) => {
      const sessionDate = new Date(s.date)
      return sessionDate >= currentWeekStart && sessionDate <= weekEnd
    })
  }, [mySessions, currentWeekStart])

  // Separate sessions for list view
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

  const goToPreviousWeek = () => {
    setCurrentWeekStart((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(newDate.getDate() - 7)
      return newDate
    })
  }

  const goToNextWeek = () => {
    setCurrentWeekStart((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(newDate.getDate() + 7)
      return newDate
    })
  }

  const goToCurrentWeek = () => {
    setCurrentWeekStart(getWeekStart(new Date()))
  }

  const isCurrentWeek = useMemo(() => {
    const today = getWeekStart(new Date())
    return currentWeekStart.getTime() === today.getTime()
  }, [currentWeekStart])

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Sesiones</h1>
          <p className="mt-1 text-sm text-gray-500">
            Consulta tus próximas clases y sesiones completadas
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-1">
          <button
            onClick={() => setViewMode('calendar')}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              viewMode === 'calendar'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <Calendar className="h-4 w-4" />
            Calendario
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              viewMode === 'list'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <List className="h-4 w-4" />
            Lista
          </button>
        </div>
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

      {viewMode === 'calendar' ? (
        /* Calendar View */
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {/* Week navigation */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Horario Semanal</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousWeek}
                className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                title="Semana anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goToCurrentWeek}
                disabled={isCurrentWeek}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium',
                  isCurrentWeek
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                Hoy
              </button>
              <button
                onClick={goToNextWeek}
                className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                title="Semana siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Current week display */}
          <div className="mb-4 text-center">
            <span className="text-sm font-medium text-gray-700">
              {formatWeekRange(currentWeekStart)}
            </span>
          </div>

          {/* Schedule grid */}
          {weekSessions.length > 0 ? (
            <StudentWeeklyScheduleGrid
              sessions={weekSessions}
              weekStart={currentWeekStart}
            />
          ) : (
            <div className="flex h-64 items-center justify-center text-gray-500">
              No hay sesiones programadas para esta semana.
            </div>
          )}
        </div>
      ) : (
        /* List View */
        <>
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
        </>
      )}
    </div>
  )
}
