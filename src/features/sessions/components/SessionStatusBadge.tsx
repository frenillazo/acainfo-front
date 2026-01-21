import type { SessionStatus } from '../types/session.types'
import { cn } from '@/shared/utils/cn'

interface SessionStatusBadgeProps {
  status: SessionStatus
}

const statusConfig: Record<SessionStatus, { label: string; className: string }> = {
  SCHEDULED: {
    label: 'Programada',
    className: 'bg-blue-100 text-blue-800',
  },
  IN_PROGRESS: {
    label: 'En curso',
    className: 'bg-green-100 text-green-800',
  },
  COMPLETED: {
    label: 'Completada',
    className: 'bg-gray-100 text-gray-800',
  },
  CANCELLED: {
    label: 'Cancelada',
    className: 'bg-red-100 text-red-800',
  },
  POSTPONED: {
    label: 'Pospuesta',
    className: 'bg-yellow-100 text-yellow-800',
  },
}

export function SessionStatusBadge({ status }: SessionStatusBadgeProps) {
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
