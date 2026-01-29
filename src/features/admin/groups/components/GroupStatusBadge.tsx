import type { GroupStatus } from '../../types/admin.types'
import { Badge } from '@/shared/components/ui/Badge'
import { GROUP_STATUS_CONFIG } from '@/shared/config/badgeConfig'

interface GroupStatusBadgeProps {
  status: GroupStatus
}

export function GroupStatusBadge({ status }: GroupStatusBadgeProps) {
  const config = GROUP_STATUS_CONFIG[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
