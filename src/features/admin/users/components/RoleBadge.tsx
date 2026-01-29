import { Badge } from '@/shared/components/ui/Badge'
import { ROLE_CONFIG } from '@/shared/config/badgeConfig'

interface RoleBadgeProps {
  role: string
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const config = ROLE_CONFIG[role as keyof typeof ROLE_CONFIG]

  if (!config) {
    return <Badge variant="default">{role}</Badge>
  }

  return <Badge variant={config.variant}>{config.label}</Badge>
}
