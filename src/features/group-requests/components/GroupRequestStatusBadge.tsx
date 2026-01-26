import type { GroupRequestStatus } from '../types/groupRequest.types'
import { cn } from '@/shared/utils/cn'

interface GroupRequestStatusBadgeProps {
  status: GroupRequestStatus
  supportersNeeded?: number
}

const statusConfig: Record<GroupRequestStatus, { label: string; className: string }> = {
  PENDING: {
    label: 'Pendiente',
    className: 'bg-yellow-100 text-yellow-700',
  },
  APPROVED: {
    label: 'Aprobada',
    className: 'bg-green-100 text-green-700',
  },
  REJECTED: {
    label: 'Rechazada',
    className: 'bg-red-100 text-red-700',
  },
  EXPIRED: {
    label: 'Expirada',
    className: 'bg-gray-100 text-gray-700',
  },
}

export function GroupRequestStatusBadge({ status, supportersNeeded }: GroupRequestStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.className
      )}
    >
      {config.label}
      {status === 'PENDING' && supportersNeeded !== undefined && supportersNeeded > 0 && (
        <span className="ml-1">(faltan {supportersNeeded})</span>
      )}
    </span>
  )
}
