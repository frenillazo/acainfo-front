import { Link } from 'react-router-dom'
import type { Session } from '../../types/admin.types'
import { SessionStatusBadge } from './SessionStatusBadge'
import { SessionTypeBadge } from './SessionTypeBadge'
import { SessionModeBadge } from './SessionModeBadge'
import { LoadingState } from '@/shared/components/common/LoadingState'

interface SessionTableProps {
  sessions: Session[]
  isLoading?: boolean
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function SessionTable({ sessions, isLoading }: SessionTableProps) {
  if (isLoading) {
    return <LoadingState />
  }

  if (sessions.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        No hay sesiones registradas.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Fecha
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Horario
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Asignatura
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Profesor
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Tipo
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Modo
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Estado
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {sessions.map((session) => (
            <tr key={session.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-3">
                <div className="text-sm font-medium text-gray-900">
                  {formatDate(session.date)}
                </div>
                {session.isPostponed && session.postponedToDate && (
                  <div className="text-xs text-orange-600">
                    → {formatDate(session.postponedToDate)}
                  </div>
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <div className="text-sm text-gray-900">
                  {session.startTime} - {session.endTime}
                </div>
                <div className="text-xs text-gray-500">
                  {session.durationMinutes} min
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm font-medium text-gray-900">
                  {session.subjectCode}
                </div>
                <div className="text-xs text-gray-500 truncate max-w-[150px]">
                  {session.subjectName}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm text-gray-900">
                  {session.teacherName ?? '-'}
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <SessionTypeBadge type={session.type} />
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <SessionModeBadge mode={session.mode} />
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <SessionStatusBadge status={session.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right">
                <Link
                  to={`/admin/sessions/${session.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Ver
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
