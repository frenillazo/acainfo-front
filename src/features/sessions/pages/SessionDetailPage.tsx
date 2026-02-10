import { useParams, Link } from 'react-router-dom'
import { useSession } from '../hooks/useSessions'
import { SessionStatusBadge } from '../components/SessionStatusBadge'
import { SessionModeBadge } from '../components/SessionModeBadge'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs'
import { ReservationSection } from '@/features/reservations/components/ReservationSection'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useAuth } from '@/features/auth'
import { useEnrollments } from '@/features/enrollments/hooks/useEnrollments'
import { ArrowLeft, Calendar, Clock, MapPin, User, BookOpen } from 'lucide-react'
import { getVisualSessionStatus } from '@/shared/utils/sessionStatus'

const CLASSROOM_LABELS: Record<string, string> = {
  AULA_PORTAL1: 'Aula Portal 1',
  AULA_PORTAL2: 'Aula Portal 2',
  AULA_VIRTUAL: 'Aula Virtual',
  AULA_101: 'Aula 101',
  AULA_102: 'Aula 102',
  AULA_201: 'Aula 201',
  AULA_202: 'Aula 202',
  LAB_A: 'Laboratorio A',
  LAB_B: 'Laboratorio B',
  ONLINE_MEET: 'Online (Meet)',
}

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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (time: string) => time.substring(0, 5)

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
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {session.subjectName}
              </h1>
              <SessionStatusBadge status={session.status} />
              <SessionModeBadge mode={session.mode} />
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
      </div>

      {/* Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Session Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
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
        </div>

        {/* Subject & Teacher Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
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
            {session.groupType && (
              <div className="flex items-start gap-3">
                <div className="h-5 w-5" /> {/* Spacer for alignment */}
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tipo de grupo</dt>
                  <dd className="mt-1 text-sm text-gray-900">{session.groupType}</dd>
                </div>
              </div>
            )}
          </dl>
        </div>
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
