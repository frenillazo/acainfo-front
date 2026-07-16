import { Link } from 'react-router-dom'
import type { Session, StudentSession } from '../types/session.types'
import { Card, ConfigBadge } from '@/shared/components/ui'
import { SESSION_STATUS_CONFIG, SESSION_MODE_CONFIG } from '@/shared/config/badgeConfig'
import { cn } from '@/shared/utils/cn'
import { getVisualSessionStatus } from '@/shared/utils/sessionStatus'
import { formatDateFull as formatDate, formatTime } from '@/shared/utils/formatters'
import { CLASSROOM_LABELS } from '@/shared/config/domainConstants'

interface SessionCardProps {
  session: Session | StudentSession
}

function isStudentSession(session: Session | StudentSession): session is StudentSession {
  return 'isAlternative' in session
}

export function SessionCard({ session }: SessionCardProps) {
  const isAlternative = isStudentSession(session) && session.isAlternative
  const getClassroomLabel = (classroom: string) => CLASSROOM_LABELS[classroom] ?? classroom

  const visualStatus = getVisualSessionStatus(session)
  const isUpcoming = visualStatus === 'scheduled'
  const isInProgress = visualStatus === 'in_progress'

  return (
    // La card ya tenía hover de elemento clicable pero no llevaba a ningún
    // sitio, y la reserva vive en el detalle: desde la vista Lista (la única
    // usable en móvil) no había forma de llegar.
    <Link to={`/dashboard/sessions/${session.id}`} className="block">
    <Card
      variant="interactive"
      padding="sm"
      className={cn(
        isUpcoming && !isAlternative && 'border-blue-200 bg-blue-50',
        isInProgress && !isAlternative && 'border-yellow-200 bg-yellow-50',
        isAlternative && [
          'border-dashed border-purple-200 bg-purple-50/50 opacity-75',
          'hover:opacity-100 hover:bg-purple-50',
        ]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <h3 className={cn(
              'text-lg font-semibold',
              isAlternative ? 'text-purple-900' : 'text-gray-900'
            )}>
              {session.subjectName}
            </h3>
            {isAlternative && (
              <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                Alternativa
              </span>
            )}
            {isInProgress && (
              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-500" />
                En curso
              </span>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="font-medium">{formatDate(session.date)}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                {formatTime(session.startTime)} - {formatTime(session.endTime)} (
                {session.durationMinutes} min)
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span>{getClassroomLabel(session.classroom)}</span>
            </div>

            {session.teacherName && (
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>{session.teacherName}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <ConfigBadge config={SESSION_STATUS_CONFIG} value={session.status} />
          <ConfigBadge config={SESSION_MODE_CONFIG} value={session.mode} />
        </div>
      </div>

      {session.isPostponed && session.postponedToDate && (
        <div className="mt-3 rounded-md bg-yellow-50 p-2 text-sm text-yellow-800">
          Pospuesta al {formatDate(session.postponedToDate)}
        </div>
      )}
    </Card>
    </Link>
  )
}
