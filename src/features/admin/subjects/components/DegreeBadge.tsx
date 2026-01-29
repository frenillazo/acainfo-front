import type { Degree } from '../../types/admin.types'
import { Badge } from '@/shared/components/ui/Badge'
import { DEGREE_CONFIG } from '@/shared/config/badgeConfig'

interface DegreeBadgeProps {
  degree: Degree
}

export function DegreeBadge({ degree }: DegreeBadgeProps) {
  const config = DEGREE_CONFIG[degree]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
