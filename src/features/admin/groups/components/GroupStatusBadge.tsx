import type { GroupStatus } from '../../types/admin.types'
import { cn } from '@/shared/utils/cn'

interface GroupStatusBadgeProps {
  status: GroupStatus
}

const statusConfig: Record<GroupStatus, { label: string; className: string }> = {
  OPEN: {
    label: 'Abierto',
    className: 'bg-green-100 text-green-700',
  },
  CLOSED: {
    label: 'Cerrado',
    className: 'bg-yellow-100 text-yellow-700',
  },
  CANCELLED: {
    label: 'Cancelado',
    className: 'bg-red-100 text-red-700',
  },
}

export function GroupStatusBadge({ status }: GroupStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.className
      )}
    >
      {config.label}
    </span>
  )
}
