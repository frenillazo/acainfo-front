import type { SessionMode } from '../types/session.types'
import { cn } from '@/shared/utils/cn'

interface SessionModeBadgeProps {
  mode: SessionMode
}

const modeConfig: Record<SessionMode, { label: string; className: string }> = {
  IN_PERSON: {
    label: 'Presencial',
    className: 'bg-purple-100 text-purple-800',
  },
  ONLINE: {
    label: 'Online',
    className: 'bg-cyan-100 text-cyan-800',
  },
  DUAL: {
    label: 'Híbrido',
    className: 'bg-indigo-100 text-indigo-800',
  },
}

export function SessionModeBadge({ mode }: SessionModeBadgeProps) {
  const config = modeConfig[mode]

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
