import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { UpcomingSessionSummary } from '../types/student.types'
import { formatDate, formatTime } from '@/shared/utils/formatters'
import { Card } from '@/shared/components/ui'
import { Button } from '@/shared/components/ui/Button'
import { useAuthStore } from '@/features/auth/store/authStore'
import { CalendarCheck } from 'lucide-react'
import { QuickReserveModal } from './QuickReserveModal'
import { getVisualSessionStatus } from '@/shared/utils/sessionStatus'

interface UpcomingSessionCardProps {
  session: UpcomingSessionSummary
}

const classroomLabels: Record<string, string> = {
  AULA_PORTAL1: 'Aula Portal 1',
  AULA_PORTAL2: 'Aula Portal 2',
  AULA_VIRTUAL: 'Aula Virtual',
}

export function UpcomingSessionCard({ session }: UpcomingSessionCardProps) {
  const [showReserveModal, setShowReserveModal] = useState(false)
  const user = useAuthStore((state) => state.user)

  const visualStatus = getVisualSessionStatus({
    status: session.sessionStatus,
    date: session.date,
    startTime: session.startTime,
    endTime: session.endTime,
  })
  const isInProgress = visualStatus === 'in_progress'

  const handleReserveClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowReserveModal(true)
  }

  return (
    <>
      <Link to={`/dashboard/sessions/${session.sessionId}`}>
        <Card variant="interactive" padding="sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900">{session.subjectName}</h3>
              {isInProgress && (
                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-500" />
                  En curso
                </span>
              )}
            </div>
            {session.hasReservation ? (
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                Reservado
              </span>
            ) : session.enrollmentId ? (
              <Button variant="primary" size="sm" onClick={handleReserveClick}>
                <CalendarCheck className="mr-1 h-3.5 w-3.5" />
                Reservar
              </Button>
            ) : null}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div>
              <span className="font-medium">Fecha:</span> {formatDate(session.date)}
            </div>
            <div>
              <span className="font-medium">Hora:</span> {formatTime(session.startTime)} - {formatTime(session.endTime)}
            </div>
            <div className="col-span-2">
              <span className="font-medium">Aula:</span>{' '}
              {classroomLabels[session.classroom] || session.classroom}
            </div>
          </div>
        </Card>
      </Link>

      {showReserveModal && user && session.enrollmentId && (
        <QuickReserveModal
          isOpen={showReserveModal}
          onClose={() => setShowReserveModal(false)}
          session={session}
          studentId={user.id}
        />
      )}
    </>
  )
}
