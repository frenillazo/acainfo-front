import type { EnrollmentDetail } from '../types/enrollment.types'
import { EnrollmentStatusBadge } from './EnrollmentStatusBadge'
import { formatDate } from '@/shared/utils/formatters'
import { cn } from '@/shared/utils/cn'
import { GROUP_TYPE_LABELS } from '@/shared/types/api.types'

interface EnrollmentDetailCardProps {
  enrollment: EnrollmentDetail
  onWithdraw?: () => void
  isWithdrawing?: boolean
}

export function EnrollmentDetailCard({
  enrollment,
  onWithdraw,
  isWithdrawing,
}: EnrollmentDetailCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
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
            <dt className="text-sm font-medium text-gray-500">Tipo de grupo</dt>
            <dd className="mt-1 text-gray-900">
              {GROUP_TYPE_LABELS[enrollment.groupType as keyof typeof GROUP_TYPE_LABELS] || enrollment.groupType}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Profesor</dt>
            <dd className="mt-1 text-gray-900">{enrollment.teacherName}</dd>
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
              {isWithdrawing ? 'Retirando...' : 'Retirarse del grupo'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
