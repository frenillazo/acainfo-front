import { useState, useMemo } from 'react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useEnrollments } from '@/features/enrollments/hooks/useEnrollments'
import { useStudentSessions } from '../hooks/useStudentSessions'
import { SessionCard } from '../components/SessionCard'
import { StudentWeeklyScheduleGrid } from '../components/StudentWeeklyScheduleGrid'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { ChevronLeft, ChevronRight, Calendar, List, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import type { StudentSession } from '../types/session.types'

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
  const [showAlternatives, setShowAlternatives] = useState(false)

  // Get all group IDs from active enrollments
  const activeEnrollments = useMemo(() => {
    if (!enrollments) return []
    return enrollments.filter((e) => e.isActive || e.isOnWaitingList)
  }, [enrollments])

  // Use the new hook that handles alternatives
  const { sessions: allSessions, isLoading, error } = useStudentSessions(enrollments, {
    includeAlternatives: showAlternatives,
  })

  // Filter to only show sessions based on toggle (own sessions always, alternatives only if toggled)
  const mySessions = useMemo(() => {
    if (!showAlternatives) {
      return allSessions.filter((s) => s.isOwnSession)
    }
    return allSessions
  }, [allSessions, showAlternatives])

  // Filter sessions for the current week (calendar view)
  const weekSessions = useMemo((): StudentSession[] => {
    const weekEnd = getWeekEnd(currentWeekStart)
    return mySessions.filter((s) => {
      const sessionDate = new Date(s.date)
      return sessionDate >= currentWeekStart && sessionDate <= weekEnd
    })
  }, [mySessions, currentWeekStart])

  // Separate sessions for list view
  const upcomingSessions = useMemo((): StudentSession[] => {
    const now = new Date()
    return mySessions.filter(
      (s) => s.status === 'SCHEDULED' && new Date(s.date) >= now
    )
  }, [mySessions])

  const pastSessions = useMemo((): StudentSession[] => {
    const now = new Date()
    return mySessions.filter(
      (s) =>
        s.status === 'COMPLETED' ||
        (s.status === 'SCHEDULED' && new Date(s.date) < now)
    )
  }, [mySessions])

  const cancelledSessions = useMemo((): StudentSession[] => {
    return mySessions.filter((s) => s.status === 'CANCELLED' || s.status === 'POSTPONED')
  }, [mySessions])

  // Count own vs alternative sessions for display
  const ownSessionsCount = useMemo(() => {
    return mySessions.filter((s) => s.isOwnSession).length
  }, [mySessions])

  const alternativeSessionsCount = useMemo(() => {
    return mySessions.filter((s) => s.isAlternative).length
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

      {/* Alternatives info banner */}
      {showAlternatives && alternativeSessionsCount > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-purple-200 bg-purple-50 p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
            <Eye className="h-4 w-4 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-purple-800">
              Mostrando sesiones alternativas
            </p>
            <p className="text-xs text-purple-600">
              Las sesiones con borde punteado y colores apagados son de otros grupos de tus mismas asignaturas.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-purple-800">{ownSessionsCount} propias</p>
            <p className="text-xs text-purple-600">{alternativeSessionsCount} alternativas</p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-500">Próximas sesiones</div>
          <div className="mt-1 text-2xl font-semibold text-blue-600">
            {upcomingSessions.filter(s => s.isOwnSession).length}
            {showAlternatives && alternativeSessionsCount > 0 && (
              <span className="ml-2 text-sm font-normal text-purple-500">
                +{upcomingSessions.filter(s => s.isAlternative).length} alt.
              </span>
            )}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-500">Completadas</div>
          <div className="mt-1 text-2xl font-semibold text-green-600">
            {pastSessions.filter(s => s.isOwnSession).length}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-500">Canceladas/Pospuestas</div>
          <div className="mt-1 text-2xl font-semibold text-yellow-600">
            {cancelledSessions.filter(s => s.isOwnSession).length}
          </div>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        /* Calendar View */
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {/* Week navigation */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Horario Semanal</h2>
              {/* Alternatives toggle - next to the title */}
              {activeEnrollments.length > 0 && (
                <button
                  onClick={() => setShowAlternatives(!showAlternatives)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                    showAlternatives
                      ? 'border-purple-300 bg-purple-50 text-purple-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  )}
                  title={showAlternatives ? 'Ocultar sesiones alternativas' : 'Mostrar sesiones de otros grupos de mis asignaturas'}
                >
                  {showAlternatives ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  {showAlternatives ? 'Ocultar alternativas' : 'Ver alternativas'}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousWeek}
                className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                title="Semana anterior"
              >
                <ChevronLeft className="h-5 w-5" />
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
