import type { GroupType } from '../../types/admin.types'
import { cn } from '@/shared/utils/cn'

interface GroupTypeBadgeProps {
  type: GroupType
}

const typeConfig: Record<GroupType, { label: string; className: string }> = {
  REGULAR_Q1: {
    label: 'Regular Q1',
    className: 'bg-blue-100 text-blue-700',
  },
  INTENSIVE_Q1: {
    label: 'Intensivo Q1',
    className: 'bg-purple-100 text-purple-700',
  },
  REGULAR_Q2: {
    label: 'Regular Q2',
    className: 'bg-blue-100 text-blue-700',
  },
  INTENSIVE_Q2: {
    label: 'Intensivo Q2',
    className: 'bg-purple-100 text-purple-700',
  },
}

export function GroupTypeBadge({ type }: GroupTypeBadgeProps) {
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
