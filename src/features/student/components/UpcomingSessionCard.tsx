import { Link } from 'react-router-dom'
import type { UpcomingSessionSummary } from '../types/student.types'
import { formatDate } from '@/shared/utils/formatters'
import { Card } from '@/shared/components/ui'

interface UpcomingSessionCardProps {
  session: UpcomingSessionSummary
}

const classroomLabels: Record<string, string> = {
  AULA_PORTAL1: 'Aula Portal 1',
  AULA_PORTAL2: 'Aula Portal 2',
  AULA_VIRTUAL: 'Aula Virtual',
}

export function UpcomingSessionCard({ session }: UpcomingSessionCardProps) {
  return (
    <Link to={`/sessions/${session.sessionId}`}>
      <Card variant="interactive" padding="sm">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-gray-900">{session.subjectName}</h3>
          </div>
          {session.hasReservation && (
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
              Reservado
            </span>
          )}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div>
            <span className="font-medium">Fecha:</span> {formatDate(session.date)}
          </div>
          <div>
            <span className="font-medium">Hora:</span> {session.startTime} - {session.endTime}
          </div>
          <div className="col-span-2">
            <span className="font-medium">Aula:</span>{' '}
            {classroomLabels[session.classroom] || session.classroom}
          </div>
        </div>
      </Card>
    </Link>
  )
}
