import type { Classroom } from '../../types/admin.types'
import { Badge } from '@/shared/components/ui/Badge'
import { CLASSROOM_CONFIG } from '@/shared/config/badgeConfig'

interface ClassroomBadgeProps {
  classroom: Classroom
}

export function ClassroomBadge({ classroom }: ClassroomBadgeProps) {
  const config = CLASSROOM_CONFIG[classroom]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
