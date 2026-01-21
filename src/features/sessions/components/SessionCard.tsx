import type { Session } from '../types/session.types'
import { SessionStatusBadge } from './SessionStatusBadge'
import { SessionModeBadge } from './SessionModeBadge'

interface SessionCardProps {
  session: Session
}

export function SessionCard({ session }: SessionCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5) // HH:mm
  }

  const getClassroomLabel = (classroom: string) => {
    const labels: Record<string, string> = {
      AULA_101: 'Aula 101',
      AULA_102: 'Aula 102',
      AULA_201: 'Aula 201',
      AULA_202: 'Aula 202',
      LAB_A: 'Laboratorio A',
      LAB_B: 'Laboratorio B',
      ONLINE_MEET: 'Online (Meet)',
    }
    return labels[classroom] || classroom
  }

  const isUpcoming = session.status === 'SCHEDULED' && new Date(session.date) >= new Date()

  return (
    <div
      className={`rounded-lg border ${
        isUpcoming ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'
      } p-4 shadow-sm transition-all hover:shadow-md`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{session.subjectName}</h3>
            <span className="text-sm text-gray-500">({session.subjectCode})</span>
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
          <SessionStatusBadge status={session.status} />
          <SessionModeBadge mode={session.mode} />
        </div>
      </div>

      {session.isPostponed && session.postponedToDate && (
        <div className="mt-3 rounded-md bg-yellow-50 p-2 text-sm text-yellow-800">
          Pospuesta al {formatDate(session.postponedToDate)}
        </div>
      )}
    </div>
  )
}
