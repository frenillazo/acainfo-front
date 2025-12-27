import type { SessionType } from '../../types/admin.types'
import { cn } from '@/shared/utils/cn'

interface SessionTypeBadgeProps {
  type: SessionType
}

const typeConfig: Record<SessionType, { label: string; className: string }> = {
  REGULAR: {
    label: 'Regular',
    className: 'bg-indigo-100 text-indigo-800',
  },
  EXTRA: {
    label: 'Extra',
    className: 'bg-purple-100 text-purple-800',
  },
  SCHEDULING: {
    label: 'Agenda',
    className: 'bg-gray-100 text-gray-800',
  },
}

export function SessionTypeBadge({ type }: SessionTypeBadgeProps) {
  const config = typeConfig[type]

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
