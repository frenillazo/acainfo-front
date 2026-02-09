import { useState, useMemo } from 'react'
import type { Session } from '@/features/sessions/types/session.types'
import type { Enrollment } from '@/features/enrollments/types/enrollment.types'
import { useSessionReservations } from '../hooks/useReservations'
import { useCancelReservation, useRequestOnline } from '../hooks/useReservationMutations'
import { ReservationModeBadge } from './ReservationModeBadge'
import { OnlineRequestBadge } from './OnlineRequestBadge'
import { CreateReservationModal } from './CreateReservationModal'
import { SwitchSessionModal } from './SwitchSessionModal'
import { ConfirmDialog } from '@/shared/components/common/ConfirmDialog'
import { Badge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'
import { CalendarCheck, Users, ArrowRightLeft, Wifi, X as XIcon } from 'lucide-react'

interface ReservationSectionProps {
  session: Session
  studentId: number
  enrollments: Enrollment[]
}

export function ReservationSection({ session, studentId, enrollments }: ReservationSectionProps) {
  const { data: reservations, isLoading } = useSessionReservations(session.id)
  const cancelMutation = useCancelReservation()
  const requestOnlineMutation = useRequestOnline()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showSwitchModal, setShowSwitchModal] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [showOnlineConfirm, setShowOnlineConfirm] = useState(false)

  // Find student's confirmed reservation for this session
  const myReservation = useMemo(
    () => (reservations ?? []).find((r) => r.studentId === studentId && r.isConfirmed),
    [reservations, studentId]
  )

  // Count in-person seats
  const inPersonCount = useMemo(
    () => (reservations ?? []).filter((r) => r.isConfirmed && r.isInPerson).length,
    [reservations]
  )

  // Find matching enrollment for this session's subject
  const matchingEnrollment = useMemo(
    () => enrollments.find((e) => e.subjectId === session.subjectId && e.isActive),
    [enrollments, session.subjectId]
  )

  const isUpcoming = session.status === 'SCHEDULED' && new Date(session.date) >= new Date()
  const isPast = session.status === 'COMPLETED' || (session.status === 'SCHEDULED' && new Date(session.date) < new Date())
  const isCancelledOrPostponed = session.status === 'CANCELLED' || session.status === 'POSTPONED'

  // Check if online request is allowed (regular groups only, not intensive)
  const isRegularGroup = session.groupType && !session.groupType.startsWith('INTENSIVE')

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-32 rounded bg-gray-200" />
          <div className="h-10 w-full rounded bg-gray-200" />
        </div>
      </div>
    )
  }

  // Past session: show attendance result
  if (isPast && myReservation) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Asistencia</h2>
        <div className="flex items-center gap-3">
          <ReservationModeBadge mode={myReservation.mode} />
          {myReservation.hasAttendanceRecorded ? (
            <Badge variant={myReservation.wasPresent ? 'success' : 'error'}>
              {myReservation.wasPresent ? 'Presente' : 'Ausente'}
            </Badge>
          ) : (
            <Badge variant="default">Pendiente de registro</Badge>
          )}
        </div>
      </div>
    )
  }

  // Cancelled/postponed: no actions
  if (isCancelledOrPostponed) {
    return null
  }

  // Past session without reservation: nothing to show
  if (isPast && !myReservation) {
    return null
  }

  // Upcoming session
  if (!isUpcoming) return null

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <CalendarCheck className="h-5 w-5 text-gray-400" />
        <h2 className="text-lg font-semibold text-gray-900">Reserva</h2>
      </div>

      {myReservation ? (
        // Has reservation - show status and actions
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <ReservationModeBadge mode={myReservation.mode} />
            <Badge variant="success">Confirmada</Badge>
            <OnlineRequestBadge status={myReservation.onlineRequestStatus} />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            <span>{inPersonCount}/24 plazas presenciales ocupadas</span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-3">
            {myReservation.canBeCancelled && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowCancelConfirm(true)}
              >
                <XIcon className="mr-1 h-3.5 w-3.5" />
                Cancelar reserva
              </Button>
            )}

            {myReservation.canRequestOnline && isRegularGroup && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowOnlineConfirm(true)}
              >
                <Wifi className="mr-1 h-3.5 w-3.5" />
                Solicitar online
              </Button>
            )}

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowSwitchModal(true)}
            >
              <ArrowRightLeft className="mr-1 h-3.5 w-3.5" />
              Cambiar sesion
            </Button>
          </div>
        </div>
      ) : matchingEnrollment ? (
        // No reservation but enrolled - can create
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            <span>{inPersonCount}/24 plazas presenciales ocupadas</span>
          </div>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            <CalendarCheck className="mr-1.5 h-4 w-4" />
            Reservar Plaza
          </Button>
        </div>
      ) : (
        // Not enrolled
        <p className="text-sm text-gray-500">
          Necesitas estar inscrito en esta asignatura para reservar plaza.
        </p>
      )}

      {/* Modals */}
      {matchingEnrollment && (
        <CreateReservationModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          session={session}
          studentId={studentId}
          enrollmentId={matchingEnrollment.id}
          inPersonCount={inPersonCount}
        />
      )}

      {myReservation && (
        <>
          <SwitchSessionModal
            isOpen={showSwitchModal}
            onClose={() => setShowSwitchModal(false)}
            currentSession={session}
            reservationId={myReservation.id}
            studentId={studentId}
          />

          <ConfirmDialog
            isOpen={showCancelConfirm}
            title="Cancelar reserva"
            message="¿Estas seguro de que quieres cancelar tu reserva para esta sesion? Esta accion no se puede deshacer."
            confirmLabel="Cancelar reserva"
            variant="danger"
            isLoading={cancelMutation.isPending}
            onConfirm={() => {
              cancelMutation.mutate(
                { id: myReservation.id, studentId },
                { onSuccess: () => setShowCancelConfirm(false) }
              )
            }}
            onCancel={() => setShowCancelConfirm(false)}
          />

          <ConfirmDialog
            isOpen={showOnlineConfirm}
            title="Solicitar asistencia online"
            message="Tu solicitud sera enviada al profesor para su aprobacion. Solo disponible con 6 o mas horas de antelacion y para grupos regulares."
            confirmLabel="Enviar solicitud"
            variant="info"
            isLoading={requestOnlineMutation.isPending}
            onConfirm={() => {
              requestOnlineMutation.mutate(
                { id: myReservation.id, studentId },
                { onSuccess: () => setShowOnlineConfirm(false) }
              )
            }}
            onCancel={() => setShowOnlineConfirm(false)}
          />
        </>
      )}
    </div>
  )
}
