import type { PaymentStatus } from '../types/payment.types'
import { cn } from '@/shared/utils/cn'

interface PaymentStatusBadgeProps {
  status: PaymentStatus
  isOverdue?: boolean
  daysOverdue?: number | null
}

const statusConfig: Record<PaymentStatus, { label: string; className: string }> = {
  PENDING: {
    label: 'Pendiente',
    className: 'bg-yellow-100 text-yellow-700',
  },
  PAID: {
    label: 'Pagado',
    className: 'bg-green-100 text-green-700',
  },
  OVERDUE: {
    label: 'Vencido',
    className: 'bg-red-100 text-red-700',
  },
  CANCELLED: {
    label: 'Cancelado',
    className: 'bg-gray-100 text-gray-700',
  },
}

export function PaymentStatusBadge({ status, isOverdue, daysOverdue }: PaymentStatusBadgeProps) {
  const config = statusConfig[status]

  const displayStatus = isOverdue && status === 'PENDING' ? 'OVERDUE' : status
  const displayConfig = statusConfig[displayStatus]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        displayConfig.className
      )}
    >
      {displayConfig.label}
      {isOverdue && daysOverdue && daysOverdue > 0 && (
        <span className="text-xs">({daysOverdue}d)</span>
      )}
    </span>
  )
}
