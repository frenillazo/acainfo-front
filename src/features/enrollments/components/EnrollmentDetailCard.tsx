import type { EnrollmentDetail } from '../types/enrollment.types'
import { EnrollmentStatusBadge } from './EnrollmentStatusBadge'
import { formatDate } from '@/shared/utils/formatters'
import { cn } from '@/shared/utils/cn'
import { Card } from '@/shared/components/ui'

interface EnrollmentDetailCardProps {
  enrollment: EnrollmentDetail
  onWithdraw?: () => void
  isWithdrawing?: boolean
}

/** El mismo botón cancela una solicitud, sale de la lista de espera o da de baja. */
function withdrawLabel(enrollment: EnrollmentDetail): string {
  if (enrollment.isPendingApproval) return 'Cancelar solicitud'
  if (enrollment.isOnWaitingList) return 'Salir de la lista de espera'
  return 'Darme de baja del curso'
}

export function EnrollmentDetailCard({
  enrollment,
  onWithdraw,
  isWithdrawing,
}: EnrollmentDetailCardProps) {
  return (
    <Card padding="none">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {enrollment.subjectName}
            </h1>
          </div>
          <EnrollmentStatusBadge
            status={enrollment.status}
            waitingPosition={enrollment.waitingListPosition}
          />
        </div>
      </div>

      <div className="p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Curso</dt>
            <dd className="mt-1 text-gray-900">{enrollment.courseName}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Profesor</dt>
            <dd className="mt-1 text-gray-900">{enrollment.teacherName ?? 'Sin asignar'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Fecha de inscripción</dt>
            <dd className="mt-1 text-gray-900">{formatDate(enrollment.enrolledAt)}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Estudiante</dt>
            <dd className="mt-1 text-gray-900">{enrollment.studentName}</dd>
          </div>
        </dl>

        {/* El admin escribe el motivo al rechazar y el back lo guarda, pero hasta
            ahora no lo pintaba nadie: el alumno veía "Rechazada" y punto. Sin
            emails, ésta es la única vía de saber por qué. */}
        {enrollment.rejectionReason && (
          <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4">
            <h2 className="text-sm font-medium text-red-800">
              {enrollment.isExpired ? 'Motivo de la caducidad' : 'Motivo del rechazo'}
            </h2>
            <p className="mt-1 text-sm text-red-700">{enrollment.rejectionReason}</p>
          </div>
        )}

        {enrollment.isPendingApproval && (
          <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-800">
              La academia está revisando tu solicitud. Verás aquí la respuesta; mientras tanto
              puedes cancelarla cuando quieras.
            </p>
          </div>
        )}

        {enrollment.isOnWaitingList && (
          <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-800">
              {enrollment.waitingListPosition
                ? `Estás en la lista de espera, en la posición ${enrollment.waitingListPosition}.`
                : 'Estás en la lista de espera.'}{' '}
              Pasarás a inscrito automáticamente si queda una plaza libre.
            </p>
          </div>
        )}

        {enrollment.canBeWithdrawn && onWithdraw && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <button
              onClick={onWithdraw}
              disabled={isWithdrawing}
              className={cn(
                'rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white',
                'hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50'
              )}
            >
              {isWithdrawing ? 'Un momento...' : withdrawLabel(enrollment)}
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}
