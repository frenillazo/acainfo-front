import type { GroupType } from '../../types/admin.types'
import { cn } from '@/shared/utils/cn'
import { GROUP_TYPE_LABELS } from '@/shared/types/api.types'

interface GroupTypeBadgeProps {
  type: GroupType
}

const typeStyles: Record<GroupType, string> = {
  REGULAR_Q1: 'bg-blue-100 text-blue-700',
  REGULAR_Q2: 'bg-blue-100 text-blue-700',
  INTENSIVE_Q1: 'bg-purple-100 text-purple-700',
  INTENSIVE_Q2: 'bg-purple-100 text-purple-700',
}

export function GroupTypeBadge({ type }: GroupTypeBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        typeStyles[type]
      )}
    >
      {GROUP_TYPE_LABELS[type]}
    </span>
  )
}
