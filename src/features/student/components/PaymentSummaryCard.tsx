import { Link } from 'react-router-dom'
import type { PaymentSummary } from '../types/student.types'
import { cn } from '@/shared/utils/cn'
import { formatCurrency, formatDate } from '@/shared/utils/formatters'

interface PaymentSummaryCardProps {
  paymentStatus: PaymentSummary
}

export function PaymentSummaryCard({ paymentStatus }: PaymentSummaryCardProps) {
  const hasIssues = paymentStatus.hasOverduePayments || !paymentStatus.canAccessResources

  return (
    <div
      className={cn(
        'rounded-lg border p-4 shadow-sm',
        hasIssues
          ? 'border-red-200 bg-red-50'
          : 'border-gray-200 bg-white'
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Estado de Pagos</h3>
        {hasIssues ? (
          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
            Atención requerida
          </span>
        ) : (
          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
            Al día
          </span>
        )}
      </div>

      <div className="mt-4 space-y-2">
        {paymentStatus.hasOverduePayments && (
          <div className="flex items-center gap-2 text-sm text-red-700">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            Tienes pagos vencidos
          </div>
        )}

        {!paymentStatus.canAccessResources && (
          <div className="flex items-center gap-2 text-sm text-red-700">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            Acceso a materiales bloqueado
          </div>
        )}

        <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Pagos pendientes</p>
            <p className="text-lg font-semibold text-gray-900">
              {paymentStatus.pendingPaymentsCount}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Total pendiente</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(paymentStatus.totalPendingAmount)}
            </p>
          </div>
        </div>

        {paymentStatus.nextDueDate && (
          <p className="text-sm text-gray-600">
            Próximo vencimiento: {formatDate(paymentStatus.nextDueDate)}
          </p>
        )}
      </div>

      <Link
        to="/dashboard/payments"
        className={cn(
          'mt-4 block w-full rounded-md px-4 py-2 text-center text-sm font-medium',
          hasIssues
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        )}
      >
        {hasIssues ? 'Regularizar pagos' : 'Ver pagos'}
      </Link>
    </div>
  )
}
