import type { GroupType } from '../../types/admin.types'
import { Badge } from '@/shared/components/ui/Badge'
import { GROUP_TYPE_LABELS } from '@/shared/types/api.types'
import { GROUP_TYPE_CONFIG } from '@/shared/config/badgeConfig'

interface GroupTypeBadgeProps {
  type: GroupType
}

export function GroupTypeBadge({ type }: GroupTypeBadgeProps) {
  const config = GROUP_TYPE_CONFIG[type]
  return <Badge variant={config.variant}>{GROUP_TYPE_LABELS[type]}</Badge>
}
