import type { SubjectStatus } from '../../types/admin.types'
import { Badge } from '@/shared/components/ui/Badge'
import { SUBJECT_STATUS_CONFIG } from '@/shared/config/badgeConfig'

interface SubjectStatusBadgeProps {
  status: SubjectStatus
}

export function SubjectStatusBadge({ status }: SubjectStatusBadgeProps) {
  const config = SUBJECT_STATUS_CONFIG[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
