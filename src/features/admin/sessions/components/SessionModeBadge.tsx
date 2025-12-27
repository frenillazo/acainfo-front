import type { SessionMode } from '../../types/admin.types'
import { cn } from '@/shared/utils/cn'

interface SessionModeBadgeProps {
  mode: SessionMode
}

const modeConfig: Record<SessionMode, { label: string; className: string; icon: string }> = {
  IN_PERSON: {
    label: 'Presencial',
    className: 'bg-emerald-100 text-emerald-800',
    icon: '🏫',
  },
  ONLINE: {
    label: 'Online',
    className: 'bg-cyan-100 text-cyan-800',
    icon: '💻',
  },
  DUAL: {
    label: 'Dual',
    className: 'bg-violet-100 text-violet-800',
    icon: '🔄',
  },
}

export function SessionModeBadge({ mode }: SessionModeBadgeProps) {
  const config = modeConfig[mode]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.className
      )}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  )
}
