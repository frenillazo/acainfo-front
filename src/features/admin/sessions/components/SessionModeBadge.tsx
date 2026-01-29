import type { SessionMode } from '../../types/admin.types'
import { Badge } from '@/shared/components/ui/Badge'
import { SESSION_MODE_CONFIG } from '@/shared/config/badgeConfig'

interface SessionModeBadgeProps {
  mode: SessionMode
}

export function SessionModeBadge({ mode }: SessionModeBadgeProps) {
  const config = SESSION_MODE_CONFIG[mode]
  return (
    <Badge variant={config.variant}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  )
}
