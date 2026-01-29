import type { UserStatus } from '../../types/admin.types'
import { Badge } from '@/shared/components/ui/Badge'
import { USER_STATUS_CONFIG } from '@/shared/config/badgeConfig'

interface UserStatusBadgeProps {
  status: UserStatus
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const config = USER_STATUS_CONFIG[status] ?? USER_STATUS_CONFIG.PENDING_ACTIVATION
  return <Badge variant={config.variant}>{config.label}</Badge>
}
