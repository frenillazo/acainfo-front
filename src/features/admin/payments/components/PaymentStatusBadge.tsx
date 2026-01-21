import type { PaymentStatus } from '@/features/payments/types/payment.types'
import { cn } from '@/shared/utils/cn'

interface PaymentStatusBadgeProps {
  status: PaymentStatus
  isOverdue?: boolean
}

const statusConfig: Record<PaymentStatus, { label: string; className: string }> = {
  PENDING: {
    label: 'Pendiente',
    className: 'bg-yellow-100 text-yellow-800',
  },
  PAID: {
    label: 'Pagado',
    className: 'bg-green-100 text-green-800',
  },
  CANCELLED: {
    label: 'Cancelado',
    className: 'bg-gray-100 text-gray-800',
  },
}

export function PaymentStatusBadge({ status, isOverdue }: PaymentStatusBadgeProps) {
  const config = statusConfig[status]

  const className = isOverdue && status === 'PENDING'
    ? 'bg-red-100 text-red-800'
    : config.className

  const label = isOverdue && status === 'PENDING' ? 'Vencido' : config.label

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        className
      )}
    >
      {label}
    </span>
  )
}
