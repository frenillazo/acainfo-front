import type { PaymentStatus } from '@/features/payments/types/payment.types'
import { Badge } from '@/shared/components/ui/Badge'
import { PAYMENT_STATUS_CONFIG } from '@/shared/config/badgeConfig'

interface PaymentStatusBadgeProps {
  status: PaymentStatus
  isOverdue?: boolean
}

export function PaymentStatusBadge({ status, isOverdue }: PaymentStatusBadgeProps) {
  if (isOverdue && status === 'PENDING') {
    return <Badge variant="error">Vencido</Badge>
  }

  const config = PAYMENT_STATUS_CONFIG[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
