import type { SessionType } from '../../types/admin.types'
import { Badge } from '@/shared/components/ui/Badge'
import { SESSION_TYPE_CONFIG } from '@/shared/config/badgeConfig'

interface SessionTypeBadgeProps {
  type: SessionType
}

export function SessionTypeBadge({ type }: SessionTypeBadgeProps) {
  const config = SESSION_TYPE_CONFIG[type]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
