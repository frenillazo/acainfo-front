import type { PaymentStatus } from '../types/payment.types'
import { Badge } from '@/shared/components/ui/Badge'
import { PAYMENT_STATUS_CONFIG } from '@/shared/config/badgeConfig'

interface PaymentStatusBadgeProps {
  status: PaymentStatus
  isOverdue?: boolean
  daysOverdue?: number | null
}

export function PaymentStatusBadge({ status, isOverdue, daysOverdue }: PaymentStatusBadgeProps) {
  if (isOverdue && status === 'PENDING') {
    return (
      <Badge variant="error">
        Vencido
        {daysOverdue && daysOverdue > 0 && (
          <span className="ml-1 text-xs">({daysOverdue}d)</span>
        )}
      </Badge>
    )
  }

  const config = PAYMENT_STATUS_CONFIG[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
