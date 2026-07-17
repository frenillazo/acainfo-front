import { useParams, Link } from 'react-router-dom'
import { useSession } from '../hooks/useSessions'
import { Card, ConfigBadge } from '@/shared/components/ui'
import { formatDateFull as formatDate, formatTime } from '@/shared/utils/formatters'
import { SESSION_STATUS_CONFIG, SESSION_MODE_CONFIG } from '@/shared/config/badgeConfig'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs'
import { ReservationSection } from '@/features/reservations/components/ReservationSection'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useAuth } from '@/features/auth'
import { useEnrollments } from '@/features/enrollments/hooks/useEnrollments'
import { ArrowLeft, Calendar, Clock, MapPin, User, BookOpen } from 'lucide-react'
import { getVisualSessionStatus } from '@/shared/utils/sessionStatus'
// Fuente única: el mapa local traía aulas que no existen en el dominio
// (AULA_101, LAB_A, ONLINE_MEET...), resto de antes de la migración.
import { CLASSROOM_LABELS } from '@/shared/config/domainConstants'



export function SessionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const sessionId = id ? parseInt(id, 10) : 0
  const user = useAuthStore((state) => state.user)
  const { hasRole } = useAuth()
  const isStudent = hasRole('STUDENT')
  const { data: enrollments } = useEnrollments(user?.id ?? 0)

  const { data: session, isLoading, error } = useSession(sessionId)

  if (isLoading) {
    return <LoadingState />
  }

  if (error || !session) {
    return (
      <div className="space-y-4">
        <Link
          to="/dashboard/sessions"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a sesiones
        </Link>
        <ErrorState error={error} title="Error al cargar la sesión" />
      </div>
    )
  }

  const visualStatus = getVisualSessionStatus(session)
  const isUpcoming = visualStatus === 'scheduled'
  const isInProgress = visualStatus === 'in_progress'

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumbs
        homeHref="/dashboard"
        items={[
          { label: 'Sesiones', href: '/dashboard/sessions' },
          { label: session.subjectName },
        ]}
      />

      {/* Header */}
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {session.subjectName}
              </h1>
              <ConfigBadge config={SESSION_STATUS_CONFIG} value={session.status} />
              <ConfigBadge config={SESSION_MODE_CONFIG} value={session.mode} />
              {isInProgress && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
                  En curso
                </span>
              )}
            </div>
            <p className="mt-1 text-gray-500">
              {session.subjectCode}
            </p>
          </div>
        </div>

        {/* Upcoming indicator */}
        {isUpcoming && (
          <div className="mt-4 rounded-md bg-blue-50 border border-blue-200 p-3">
            <p className="text-sm text-blue-700">
              Esta sesión está programada próximamente
            </p>
          </div>
        )}

        {/* In-progress indicator */}
        {isInProgress && (
          <div className="mt-4 rounded-md bg-yellow-50 border border-yellow-200 p-3">
            <p className="text-sm text-yellow-700">
              Esta sesión está en curso ahora mismo
            </p>
          </div>
        )}

        {/* Cancelled/Postponed indicator */}
        {session.status === 'CANCELLED' && (
          <div className="mt-4 rounded-md bg-red-50 border border-red-200 p-3">
            <p className="text-sm text-red-700">
              Esta sesión ha sido cancelada
            </p>
          </div>
        )}

        {session.status === 'POSTPONED' && session.postponedToDate && (
          <div className="mt-4 rounded-md bg-yellow-50 border border-yellow-200 p-3">
            <p className="text-sm text-yellow-700">
              Esta sesión ha sido pospuesta al {formatDate(session.postponedToDate)}
            </p>
          </div>
        )}
      </Card>

      {/* Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Session Info */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Detalles de la sesión
          </h2>
          <dl className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <dt className="text-sm font-medium text-gray-500">Fecha</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(session.date)}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <dt className="text-sm font-medium text-gray-500">Horario</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatTime(session.startTime)} - {formatTime(session.endTime)} ({session.durationMinutes} minutos)
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <dt className="text-sm font-medium text-gray-500">Aula</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {CLASSROOM_LABELS[session.classroom] || session.classroom}
                </dd>
              </div>
            </div>
          </dl>
        </Card>

        {/* Subject & Teacher Info */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Asignatura y profesor
          </h2>
          <dl className="space-y-4">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <dt className="text-sm font-medium text-gray-500">Asignatura</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {session.subjectName}
                </dd>
                <dd className="text-xs text-gray-500">{session.subjectCode}</dd>
              </div>
            </div>
            {session.teacherName && (
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <dt className="text-sm font-medium text-gray-500">Profesor</dt>
                  <dd className="mt-1 text-sm text-gray-900">{session.teacherName}</dd>
                </div>
              </div>
            )}
            {session.courseName && (
              <div className="flex items-start gap-3">
                <div className="h-5 w-5" /> {/* Spacer for alignment */}
                <div>
                  <dt className="text-sm font-medium text-gray-500">Curso</dt>
                  <dd className="mt-1 text-sm text-gray-900">{session.courseName}</dd>
                </div>
              </div>
            )}
          </dl>
        </Card>
      </div>

      {/* Reservation Section (students only) */}
      {isStudent && user && (
        <ReservationSection
          session={session}
          studentId={user.id}
          enrollments={enrollments ?? []}
        />
      )}

      {/* Back link */}
      <div className="pt-4">
        <Link
          to="/dashboard/sessions"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a mis sesiones
        </Link>
      </div>
    </div>
  )
}
