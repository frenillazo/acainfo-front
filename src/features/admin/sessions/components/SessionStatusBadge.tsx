import type { SessionStatus } from '../../types/admin.types'
import { Badge } from '@/shared/components/ui/Badge'
import { SESSION_STATUS_CONFIG } from '@/shared/config/badgeConfig'

interface SessionStatusBadgeProps {
  status: SessionStatus
}

export function SessionStatusBadge({ status }: SessionStatusBadgeProps) {
  const config = SESSION_STATUS_CONFIG[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
