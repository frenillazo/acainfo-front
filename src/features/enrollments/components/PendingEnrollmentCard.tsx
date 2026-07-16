import { useState } from 'react'
import type { Enrollment } from '../types/enrollment.types'
import { Card, Button } from '@/shared/components/ui'
import { useApproveEnrollment, useRejectEnrollment } from '../hooks/useEnrollments'
import { cn } from '@/shared/utils/cn'
import { Clock, User, BookOpen, Users } from 'lucide-react'
import { formatDateTimeShort } from '@/shared/utils/formatters'
import { getApiErrorMessage } from '@/shared/utils/apiError'
import { toast } from '@/shared/hooks/useToast'

interface PendingEnrollmentCardProps {
  enrollment: Enrollment
  /** Solicitudes pendientes para el mismo curso, ésta incluida. */
  pendingForSameCourse?: number
}

export function PendingEnrollmentCard({
  enrollment,
  pendingForSameCourse,
}: PendingEnrollmentCardProps) {
  const [showRejectReason, setShowRejectReason] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const approveMutation = useApproveEnrollment()
  const rejectMutation = useRejectEnrollment()

  const isLoading = approveMutation.isPending || rejectMutation.isPending

  // Controlar la carga de cada curso es el motivo de existir de la app: sin la
  // ocupación delante, el admin aprobaba a ciegas.
  const isFull =
    enrollment.courseCapacity !== null &&
    enrollment.currentEnrollmentCount >= enrollment.courseCapacity

  const handleApprove = async () => {
    // El back decide ACTIVE o WAITING_LIST según haya plaza al aprobar; sin mirar
    // el resultado, la card desaparecía y el admin asumía "activado".
    const updated = await approveMutation.mutateAsync(enrollment.id)
    if (updated.status === 'WAITING_LIST') {
      toast.warning(
        `${enrollment.studentName}: aprobada, pero el curso estaba completo — queda en lista de espera` +
          (updated.waitingListPosition ? ` (posición ${updated.waitingListPosition})` : '')
      )
    } else {
      toast.success(`${enrollment.studentName}: inscripción activa en ${enrollment.courseName}`)
    }
  }

  const handleReject = async () => {
    if (!showRejectReason) {
      setShowRejectReason(true)
      return
    }
    await rejectMutation.mutateAsync({
      id: enrollment.id,
      data: rejectReason ? { reason: rejectReason } : undefined,
    })
    toast.success(`Solicitud de ${enrollment.studentName} rechazada`)
    setShowRejectReason(false)
    setRejectReason('')
  }

  const handleCancelReject = () => {
    setShowRejectReason(false)
    setRejectReason('')
  }

  return (
    <Card padding="md">
      <div className="space-y-3">
        {/* Student info */}
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">{enrollment.studentName}</p>
            <p className="text-sm text-gray-500">{enrollment.studentEmail}</p>
          </div>
        </div>

        {/* Subject and course info */}
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">
              {enrollment.subjectCode} - {enrollment.subjectName}
            </p>
            <p className="text-sm text-gray-500">{enrollment.courseName}</p>
          </div>
        </div>

        {/* Ocupación del curso: el dato de la decisión */}
        <div className="flex items-start gap-2">
          <Users className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
          <div className="text-sm">
            <p className={cn('font-medium', isFull ? 'text-amber-700' : 'text-gray-900')}>
              {enrollment.currentEnrollmentCount}
              {enrollment.courseCapacity !== null
                ? ` / ${enrollment.courseCapacity} inscritos`
                : ' inscritos (sin límite)'}
              {isFull && ' — completo'}
            </p>
            {isFull && (
              <p className="text-amber-700">Si apruebas, entrará en lista de espera.</p>
            )}
            {pendingForSameCourse !== undefined && pendingForSameCourse > 1 && (
              <p className="text-gray-500">
                {pendingForSameCourse} solicitudes pendientes para este curso
              </p>
            )}
          </div>
        </div>

        {/* Request time */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" aria-hidden="true" />
          <span>
            Solicitado el{' '}
            {formatDateTimeShort(enrollment.enrolledAt)}
          </span>
        </div>

        {/* Reject reason input */}
        {showRejectReason && (
          <div className="space-y-2">
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Motivo del rechazo (opcional)"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={2}
            />
          </div>
        )}

        {/* Action buttons */}
        <div className={cn('flex gap-2 pt-2', showRejectReason ? 'flex-col' : '')}>
          {showRejectReason ? (
            <>
              <div className="flex gap-2">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleReject}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {rejectMutation.isPending ? 'Rechazando...' : 'Confirmar rechazo'}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCancelReject}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={handleApprove}
                disabled={isLoading}
                className="flex-1"
              >
                {approveMutation.isPending ? 'Aprobando...' : 'Aprobar'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleReject}
                disabled={isLoading}
                className="flex-1"
              >
                Rechazar
              </Button>
            </>
          )}
        </div>

        {/* Error messages */}
        {approveMutation.isError && (
          <p className="text-sm text-red-600">
            Error al aprobar: {getApiErrorMessage(approveMutation.error, 'inténtalo de nuevo')}
          </p>
        )}
        {rejectMutation.isError && (
          <p className="text-sm text-red-600">
            Error al rechazar: {getApiErrorMessage(rejectMutation.error, 'inténtalo de nuevo')}
          </p>
        )}
      </div>
    </Card>
  )
}
