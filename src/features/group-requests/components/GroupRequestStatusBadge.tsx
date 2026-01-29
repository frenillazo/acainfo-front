import type { GroupRequestStatus } from '../types/groupRequest.types'
import { Badge } from '@/shared/components/ui/Badge'
import { GROUP_REQUEST_STATUS_CONFIG } from '@/shared/config/badgeConfig'

interface GroupRequestStatusBadgeProps {
  status: GroupRequestStatus
  supportersNeeded?: number
}

export function GroupRequestStatusBadge({ status, supportersNeeded }: GroupRequestStatusBadgeProps) {
  const config = GROUP_REQUEST_STATUS_CONFIG[status]

  return (
    <Badge variant={config.variant}>
      {config.label}
      {status === 'PENDING' && supportersNeeded !== undefined && supportersNeeded > 0 && (
        <span className="ml-1">(faltan {supportersNeeded})</span>
      )}
    </Badge>
  )
}
