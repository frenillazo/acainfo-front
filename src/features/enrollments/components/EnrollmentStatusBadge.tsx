import type { EnrollmentStatus } from '../types/enrollment.types'
import { cn } from '@/shared/utils/cn'

interface EnrollmentStatusBadgeProps {
  status: EnrollmentStatus
  waitingPosition?: number | null
}

const statusConfig: Record<EnrollmentStatus, { label: string; className: string }> = {
  ACTIVE: {
    label: 'Activa',
    className: 'bg-green-100 text-green-700',
  },
  WAITING_LIST: {
    label: 'Lista de espera',
    className: 'bg-yellow-100 text-yellow-700',
  },
  WITHDRAWN: {
    label: 'Retirado',
    className: 'bg-gray-100 text-gray-700',
  },
  COMPLETED: {
    label: 'Completada',
    className: 'bg-blue-100 text-blue-700',
  },
}

export function EnrollmentStatusBadge({ status, waitingPosition }: EnrollmentStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.className
      )}
    >
      {config.label}
      {status === 'WAITING_LIST' && waitingPosition && (
        <span className="ml-1">(#{waitingPosition})</span>
      )}
    </span>
  )
}
