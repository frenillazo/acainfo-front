import { Badge, type BadgeVariant } from '@/shared/components/ui/Badge'
import { ReservationMode } from '../types/reservation.types'

const modeConfig: Record<ReservationMode, { label: string; variant: BadgeVariant }> = {
  [ReservationMode.IN_PERSON]: { label: 'Presencial', variant: 'success' },
  [ReservationMode.ONLINE]: { label: 'Online', variant: 'info' },
}

interface ReservationModeBadgeProps {
  mode: ReservationMode
}

export function ReservationModeBadge({ mode }: ReservationModeBadgeProps) {
  const config = modeConfig[mode]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
