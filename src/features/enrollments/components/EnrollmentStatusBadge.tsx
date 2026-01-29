import type { EnrollmentStatus } from '../types/enrollment.types'
import { Badge } from '@/shared/components/ui/Badge'
import { ENROLLMENT_STATUS_CONFIG } from '@/shared/config/badgeConfig'

interface EnrollmentStatusBadgeProps {
  status: EnrollmentStatus
  waitingPosition?: number | null
}

export function EnrollmentStatusBadge({ status, waitingPosition }: EnrollmentStatusBadgeProps) {
  const config = ENROLLMENT_STATUS_CONFIG[status]

  return (
    <Badge variant={config.variant}>
      {config.label}
      {status === 'WAITING_LIST' && waitingPosition && (
        <span className="ml-1">(#{waitingPosition})</span>
      )}
    </Badge>
  )
}
