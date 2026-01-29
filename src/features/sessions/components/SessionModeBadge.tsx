import type { SessionMode } from '../types/session.types'
import { Badge } from '@/shared/components/ui/Badge'
import { SESSION_MODE_CONFIG } from '@/shared/config/badgeConfig'

interface SessionModeBadgeProps {
  mode: SessionMode
}

export function SessionModeBadge({ mode }: SessionModeBadgeProps) {
  const config = SESSION_MODE_CONFIG[mode]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
