import type { PaymentType } from '@/features/payments/types/payment.types'
import { Badge } from '@/shared/components/ui/Badge'
import { PAYMENT_TYPE_CONFIG } from '@/shared/config/badgeConfig'

interface PaymentTypeBadgeProps {
  type: PaymentType
}

export function PaymentTypeBadge({ type }: PaymentTypeBadgeProps) {
  const config = PAYMENT_TYPE_CONFIG[type]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
