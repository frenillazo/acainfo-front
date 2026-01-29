import { Link } from 'react-router-dom'
import type { Payment } from '@/features/payments/types/payment.types'
import { PaymentStatusBadge } from './PaymentStatusBadge'
import { PaymentTypeBadge } from './PaymentTypeBadge'
import { formatCurrency } from '@/shared/utils/formatCurrency'

interface PaymentTableProps {
  payments: Payment[]
  onMarkAsPaid?: (id: number) => void
  onCancel?: (id: number) => void
  isMarkingAsPaid?: boolean
  isCancelling?: boolean
}

export function PaymentTable({
  payments,
  onMarkAsPaid,
  onCancel,
  isMarkingAsPaid,
  isCancelling,
}: PaymentTableProps) {
  if (payments.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
        No se encontraron pagos
      </div>
    )
  }

  const getMonthName = (month: number | null) => {
    if (!month) return '-'
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]
    return months[month - 1]
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Estudiante
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Asignatura
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Periodo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Vencimiento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {payment.studentName}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {payment.subjectName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {payment.subjectCode}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <PaymentTypeBadge type={payment.type} />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {payment.billingMonth && payment.billingYear ? (
                    <div>
                      <div>{getMonthName(payment.billingMonth)}</div>
                      <div className="text-xs text-gray-500">{payment.billingYear}</div>
                    </div>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(payment.amount)}
                  </div>
                  {payment.totalHours && payment.pricePerHour && (
                    <div className="text-xs text-gray-500">
                      {payment.totalHours}h × {formatCurrency(payment.pricePerHour)}
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {new Date(payment.dueDate).toLocaleDateString('es-ES')}
                  </div>
                  {payment.isOverdue && (
                    <div className="text-xs text-red-600">
                      {payment.daysOverdue} días vencido
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <PaymentStatusBadge
                    status={payment.status}
                    isOverdue={payment.isOverdue}
                  />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      to={`/admin/payments/${payment.id}`}
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      Ver
                    </Link>
                    {onMarkAsPaid && payment.status === 'PENDING' && (
                      <button
                        onClick={() => onMarkAsPaid(payment.id)}
                        disabled={isMarkingAsPaid}
                        className="font-medium text-green-600 hover:text-green-800 disabled:opacity-50"
                      >
                        Marcar pagado
                      </button>
                    )}
                    {onCancel && payment.status === 'PENDING' && (
                      <button
                        onClick={() => onCancel(payment.id)}
                        disabled={isCancelling}
                        className="font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
