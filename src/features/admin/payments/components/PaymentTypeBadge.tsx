import type { PaymentType } from '@/features/payments/types/payment.types'
import { cn } from '@/shared/utils/cn'

interface PaymentTypeBadgeProps {
  type: PaymentType
}

const typeConfig: Record<PaymentType, { label: string; className: string }> = {
  INITIAL: {
    label: 'Inicial',
    className: 'bg-blue-100 text-blue-800',
  },
  MONTHLY: {
    label: 'Mensual',
    className: 'bg-purple-100 text-purple-800',
  },
  INTENSIVE_FULL: {
    label: 'Intensivo',
    className: 'bg-orange-100 text-orange-800',
  },
}

export function PaymentTypeBadge({ type }: PaymentTypeBadgeProps) {
  const config = typeConfig[type]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.className
      )}
    >
      {config.label}
    </span>
  )
}
