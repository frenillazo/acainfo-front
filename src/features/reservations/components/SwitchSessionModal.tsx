import { useState } from 'react'
import { Modal, ModalFooter } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/utils/cn'
import { useSessionsBySubject } from '@/features/sessions/hooks/useSessions'
import { useSwitchSession } from '../hooks/useReservationMutations'
import { useSessionReservations } from '../hooks/useReservations'
import type { Session } from '@/features/sessions/types/session.types'
import { Calendar, Clock, MapPin } from 'lucide-react'

interface SwitchSessionModalProps {
  isOpen: boolean
  onClose: () => void
  currentSession: Session
  reservationId: number
  studentId: number
}

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

export function SwitchSessionModal({
  isOpen,
  onClose,
  currentSession,
  reservationId,
  studentId,
}: SwitchSessionModalProps) {
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null)
  const switchMutation = useSwitchSession()

  const { data: subjectSessions } = useSessionsBySubject(currentSession.subjectId)

  // Filter to same-day scheduled sessions excluding current (alternatives = other groups, same day)
  const alternativeSessions = (subjectSessions ?? []).filter(
    (s) =>
      s.id !== currentSession.id &&
      s.status === 'SCHEDULED' &&
      s.date === currentSession.date
  )

  const handleConfirm = () => {
    if (!selectedSessionId) return
    switchMutation.mutate(
      { id: reservationId, studentId, data: { newSessionId: selectedSessionId } },
      { onSuccess: () => onClose() }
    )
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })

  const formatTime = (time: string) => time.substring(0, 5)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cambiar Sesion" size="lg">
      <div className="space-y-4">
        {/* Current session */}
        <div>
          <p className="mb-2 text-sm font-medium text-gray-500">Sesion actual</p>
          <div className="rounded-lg bg-gray-50 p-3 text-sm">
            <p className="font-medium text-gray-900">{formatDate(currentSession.date)}</p>
            <p className="text-gray-600">
              {formatTime(currentSession.startTime)} - {formatTime(currentSession.endTime)}
              {' · '}
              {CLASSROOM_LABELS[currentSession.classroom] || currentSession.classroom}
            </p>
          </div>
        </div>

        {/* Alternative sessions */}
        <div>
          <p className="mb-2 text-sm font-medium text-gray-500">Sesiones disponibles</p>
          {alternativeSessions.length > 0 ? (
            <div className="max-h-60 space-y-2 overflow-y-auto">
              {alternativeSessions.map((session) => (
                <SessionOption
                  key={session.id}
                  session={session}
                  isSelected={selectedSessionId === session.id}
                  onSelect={() => setSelectedSessionId(session.id)}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500">
              No hay sesiones alternativas disponibles
            </p>
          )}
        </div>
      </div>

      <ModalFooter className="-mx-6 -mb-6 mt-6">
        <Button variant="secondary" onClick={onClose} disabled={switchMutation.isPending}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={!selectedSessionId}
          isLoading={switchMutation.isPending}
          loadingText="Cambiando..."
        >
          Confirmar cambio
        </Button>
      </ModalFooter>
    </Modal>
  )
}

function SessionOption({
  session,
  isSelected,
  onSelect,
}: {
  session: Session
  isSelected: boolean
  onSelect: () => void
}) {
  const { data: reservations } = useSessionReservations(session.id)
  const inPersonCount = (reservations ?? []).filter((r) => r.isConfirmed && r.isInPerson).length

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })

  const formatTime = (time: string) => time.substring(0, 5)

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full rounded-lg border-2 p-3 text-left text-sm transition-colors',
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-900">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            {formatDate(session.date)}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-3.5 w-3.5 text-gray-400" />
            {formatTime(session.startTime)} - {formatTime(session.endTime)}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-3.5 w-3.5 text-gray-400" />
            {CLASSROOM_LABELS[session.classroom] || session.classroom}
          </div>
        </div>
        <span className="text-xs text-gray-500">{inPersonCount}/24 presencial</span>
      </div>
    </button>
  )
}
