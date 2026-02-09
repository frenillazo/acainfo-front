import { Badge, type BadgeVariant } from '@/shared/components/ui/Badge'
import { ReservationStatus } from '../types/reservation.types'

const statusConfig: Record<ReservationStatus, { label: string; variant: BadgeVariant }> = {
  [ReservationStatus.CONFIRMED]: { label: 'Confirmada', variant: 'success' },
  [ReservationStatus.CANCELLED]: { label: 'Cancelada', variant: 'default' },
}

interface ReservationStatusBadgeProps {
  status: ReservationStatus
}

export function ReservationStatusBadge({ status }: ReservationStatusBadgeProps) {
  const config = statusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
