import type { Payment } from '../types/payment.types'
import { PaymentStatusBadge } from './PaymentStatusBadge'
import { PaymentTypeBadge } from './PaymentTypeBadge'
import { formatCurrency, formatDate } from '@/shared/utils/formatters'
import { cn } from '@/shared/utils/cn'

interface PaymentCardProps {
  payment: Payment
  onPayClick?: (payment: Payment) => void
}

export function PaymentCard({ payment, onPayClick }: PaymentCardProps) {
  const canPay = payment.status === 'PENDING' || payment.isOverdue

  return (
    <div
      className={cn(
        'rounded-lg border bg-white p-4 shadow-sm',
        payment.isOverdue ? 'border-red-200' : 'border-gray-200'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{payment.subjectName}</h3>
        </div>
        <div className="flex flex-col items-end gap-1">
          <PaymentStatusBadge
            status={payment.status}
            isOverdue={payment.isOverdue}
            daysOverdue={payment.daysOverdue}
          />
          <PaymentTypeBadge type={payment.type} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Importe</p>
          <p className="text-lg font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
        </div>
        <div>
          <p className="text-gray-500">Vencimiento</p>
          <p className={cn('font-medium', payment.isOverdue ? 'text-red-600' : 'text-gray-900')}>
            {formatDate(payment.dueDate)}
          </p>
        </div>
        {payment.billingMonth && payment.billingYear && (
          <div className="col-span-2">
            <p className="text-gray-500">Periodo</p>
            <p className="text-gray-900">
              {String(payment.billingMonth).padStart(2, '0')}/{payment.billingYear}
            </p>
          </div>
        )}
        {payment.paidAt && (
          <div className="col-span-2">
            <p className="text-gray-500">Pagado el</p>
            <p className="text-green-600">{formatDate(payment.paidAt)}</p>
          </div>
        )}
      </div>

      {payment.description && (
        <p className="mt-3 text-sm text-gray-600">{payment.description}</p>
      )}

      {canPay && onPayClick && (
        <button
          onClick={() => onPayClick(payment)}
          className={cn(
            'mt-4 w-full rounded-md px-4 py-2 text-sm font-medium',
            payment.isOverdue
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          )}
        >
          {payment.isOverdue ? 'Pagar ahora (vencido)' : 'Pagar'}
        </button>
      )}
    </div>
  )
}
