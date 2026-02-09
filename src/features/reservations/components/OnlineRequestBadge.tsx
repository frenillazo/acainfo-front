import { Badge, type BadgeVariant } from '@/shared/components/ui/Badge'
import { OnlineRequestStatus } from '../types/reservation.types'

const statusConfig: Record<OnlineRequestStatus, { label: string; variant: BadgeVariant }> = {
  [OnlineRequestStatus.PENDING]: { label: 'Solicitud pendiente', variant: 'warning' },
  [OnlineRequestStatus.APPROVED]: { label: 'Online aprobado', variant: 'success' },
  [OnlineRequestStatus.REJECTED]: { label: 'Solicitud rechazada', variant: 'error' },
}

interface OnlineRequestBadgeProps {
  status: OnlineRequestStatus | null
}

export function OnlineRequestBadge({ status }: OnlineRequestBadgeProps) {
  if (!status) return null
  const config = statusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
