import { useState } from 'react'
import { Modal, ModalFooter } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/utils/cn'
import { useCreateReservation } from '../hooks/useReservationMutations'
import { ReservationMode } from '../types/reservation.types'
import type { Session } from '@/features/sessions/types/session.types'
import { MapPin, Users } from 'lucide-react'

interface CreateReservationModalProps {
  isOpen: boolean
  onClose: () => void
  session: Session
  studentId: number
  enrollmentId: number
  inPersonCount: number
}

const MAX_IN_PERSON = 24

export function CreateReservationModal({
  isOpen,
  onClose,
  session,
  studentId,
  enrollmentId,
  inPersonCount,
}: CreateReservationModalProps) {
  const isSessionFull = inPersonCount >= MAX_IN_PERSON
  const [mode, setMode] = useState<ReservationMode>(
    isSessionFull ? ReservationMode.ONLINE : ReservationMode.IN_PERSON
  )
  const createMutation = useCreateReservation()

  const handleConfirm = () => {
    createMutation.mutate(
      { studentId, sessionId: session.id, enrollmentId, mode },
      { onSuccess: () => onClose() }
    )
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  const formatTime = (time: string) => time.substring(0, 5)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reservar Plaza" size="sm">
      <div className="space-y-4">
        {/* Session summary */}
        <div className="rounded-lg bg-gray-50 p-3 text-sm">
          <p className="font-medium text-gray-900">{session.subjectName}</p>
          <p className="text-gray-600">{formatDate(session.date)}</p>
          <p className="text-gray-600">
            {formatTime(session.startTime)} - {formatTime(session.endTime)}
          </p>
        </div>

        {/* Capacity indicator */}
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">
            Plazas presenciales: {inPersonCount}/{MAX_IN_PERSON}
          </span>
          {isSessionFull && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
              Completo
            </span>
          )}
        </div>

        {/* Mode selection */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Modalidad de asistencia</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => !isSessionFull && setMode(ReservationMode.IN_PERSON)}
              disabled={isSessionFull}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg border-2 p-3 text-sm transition-colors',
                mode === ReservationMode.IN_PERSON
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300',
                isSessionFull && 'cursor-not-allowed opacity-50'
              )}
            >
              <MapPin className="h-5 w-5" />
              Presencial
            </button>
            <button
              type="button"
              onClick={() => setMode(ReservationMode.ONLINE)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg border-2 p-3 text-sm transition-colors',
                mode === ReservationMode.ONLINE
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              )}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
              </svg>
              Online
            </button>
          </div>
        </div>
      </div>

      <ModalFooter className="-mx-6 -mb-6 mt-6">
        <Button variant="secondary" onClick={onClose} disabled={createMutation.isPending}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          isLoading={createMutation.isPending}
          loadingText="Reservando..."
        >
          Confirmar Reserva
        </Button>
      </ModalFooter>
    </Modal>
  )
}
