import { cn } from '@/shared/utils/cn'
import type { UserStatus } from '../../types/admin.types'

interface UserStatusBadgeProps {
  status: UserStatus
}

const statusConfig: Record<UserStatus, { label: string; className: string }> = {
  ACTIVE: {
    label: 'Activo',
    className: 'bg-green-100 text-green-800',
  },
  INACTIVE: {
    label: 'Inactivo',
    className: 'bg-gray-100 text-gray-800',
  },
  BLOCKED: {
    label: 'Bloqueado',
    className: 'bg-red-100 text-red-800',
  },
  PENDING_ACTIVATION: {
    label: 'Pendiente',
    className: 'bg-yellow-100 text-yellow-800',
  },
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.PENDING_ACTIVATION

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
