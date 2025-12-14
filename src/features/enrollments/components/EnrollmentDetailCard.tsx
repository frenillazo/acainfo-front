import type { EnrollmentDetail } from '../types/enrollment.types'
import { EnrollmentStatusBadge } from './EnrollmentStatusBadge'
import { formatDate } from '@/shared/utils/formatters'
import { cn } from '@/shared/utils/cn'

interface EnrollmentDetailCardProps {
  enrollment: EnrollmentDetail
  onWithdraw?: () => void
  isWithdrawing?: boolean
}

const groupTypeLabels: Record<string, string> = {
  REGULAR_Q1: 'Regular Q1',
  REGULAR_Q2: 'Regular Q2',
  INTENSIVE_Q1: 'Intensivo Q1',
  INTENSIVE_Q2: 'Intensivo Q2',
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
              {enrollment.subject.name}
            </h1>
            <p className="mt-1 text-gray-500">{enrollment.subject.code}</p>
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
              {groupTypeLabels[enrollment.group.type] || enrollment.group.type}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Profesor</dt>
            <dd className="mt-1 text-gray-900">{enrollment.group.teacherName}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Fecha de inscripción</dt>
            <dd className="mt-1 text-gray-900">{formatDate(enrollment.enrolledAt)}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Capacidad del grupo</dt>
            <dd className="mt-1 text-gray-900">
              {enrollment.group.currentEnrollmentCount}
              {enrollment.group.capacity && ` / ${enrollment.group.capacity}`}
            </dd>
          </div>
          {enrollment.subject.description && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Descripción</dt>
              <dd className="mt-1 text-gray-900">{enrollment.subject.description}</dd>
            </div>
          )}
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
