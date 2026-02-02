import { useState } from 'react'
import type { Enrollment } from '../types/enrollment.types'
import { Card, Button } from '@/shared/components/ui'
import { useApproveEnrollment, useRejectEnrollment } from '../hooks/useEnrollments'
import { cn } from '@/shared/utils/cn'
import { Clock, User, BookOpen, AlertCircle } from 'lucide-react'

interface PendingEnrollmentCardProps {
  enrollment: Enrollment
}

export function PendingEnrollmentCard({ enrollment }: PendingEnrollmentCardProps) {
  const [showRejectReason, setShowRejectReason] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const approveMutation = useApproveEnrollment()
  const rejectMutation = useRejectEnrollment()

  const isLoading = approveMutation.isPending || rejectMutation.isPending

  const handleApprove = async () => {
    await approveMutation.mutateAsync(enrollment.id)
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
    setShowRejectReason(false)
    setRejectReason('')
  }

  const handleCancelReject = () => {
    setShowRejectReason(false)
    setRejectReason('')
  }

  // Calculate time remaining before expiration (48 hours from enrolledAt)
  const enrolledDate = new Date(enrollment.enrolledAt)
  const expirationDate = new Date(enrolledDate.getTime() + 48 * 60 * 60 * 1000)
  const now = new Date()
  const hoursRemaining = Math.max(0, Math.floor((expirationDate.getTime() - now.getTime()) / (60 * 60 * 1000)))
  const isUrgent = hoursRemaining < 12

  return (
    <Card padding="md" className="relative">
      {isUrgent && (
        <div className="absolute -top-2 -right-2 flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
          <AlertCircle className="h-3 w-3" />
          {hoursRemaining}h restantes
        </div>
      )}

      <div className="space-y-3">
        {/* Student info */}
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">{enrollment.studentName}</p>
            <p className="text-sm text-gray-500">{enrollment.studentEmail}</p>
          </div>
        </div>

        {/* Subject and group info */}
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">
              {enrollment.subjectCode} - {enrollment.subjectName}
            </p>
            <p className="text-sm text-gray-500">{enrollment.groupType}</p>
          </div>
        </div>

        {/* Request time */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>
            Solicitado el{' '}
            {new Date(enrollment.enrolledAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
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
            Error al aprobar: {approveMutation.error?.message}
          </p>
        )}
        {rejectMutation.isError && (
          <p className="text-sm text-red-600">
            Error al rechazar: {rejectMutation.error?.message}
          </p>
        )}
      </div>
    </Card>
  )
}
