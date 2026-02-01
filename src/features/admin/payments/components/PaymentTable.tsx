import { Link } from 'react-router-dom'
import type { Payment } from '@/features/payments/types/payment.types'
import { PaymentStatusBadge } from './PaymentStatusBadge'
import { PaymentTypeBadge } from './PaymentTypeBadge'
import { formatCurrency } from '@/shared/utils/formatCurrency'
import {
  DataTable,
  TextCell,
  ActionsCell,
  ActionButton,
  type Column,
} from '@/shared/components/ui'

interface PaymentTableProps {
  payments: Payment[]
  onMarkAsPaid?: (id: number) => void
  onCancel?: (id: number) => void
  isMarkingAsPaid?: boolean
  isCancelling?: boolean
}

const getMonthName = (month: number | null) => {
  if (!month) return '-'
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  return months[month - 1]
}

export function PaymentTable({
  payments,
  onMarkAsPaid,
  onCancel,
  isMarkingAsPaid,
  isCancelling,
}: PaymentTableProps) {
  const columns: Column<Payment>[] = [
    {
      key: 'student',
      header: 'Estudiante',
      render: (payment) => (
        <div className="font-medium text-gray-900">{payment.studentName}</div>
      ),
    },
    {
      key: 'subject',
      header: 'Asignatura',
      render: (payment) => (
        <TextCell primary={payment.subjectName} secondary={payment.subjectCode} />
      ),
    },
    {
      key: 'type',
      header: 'Tipo',
      render: (payment) => <PaymentTypeBadge type={payment.type} />,
    },
    {
      key: 'period',
      header: 'Periodo',
      render: (payment) =>
        payment.billingMonth && payment.billingYear ? (
          <div className="text-sm text-gray-900">
            <div>{getMonthName(payment.billingMonth)}</div>
            <div className="text-xs text-gray-500">{payment.billingYear}</div>
          </div>
        ) : (
          <span className="text-sm text-gray-500">-</span>
        ),
    },
    {
      key: 'amount',
      header: 'Monto',
      render: (payment) => (
        <div>
          <div className="font-semibold text-gray-900">
            {formatCurrency(payment.amount)}
          </div>
          {payment.totalHours && payment.pricePerHour && (
            <div className="text-xs text-gray-500">
              {payment.totalHours}h × {formatCurrency(payment.pricePerHour)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'dueDate',
      header: 'Vencimiento',
      render: (payment) => (
        <div>
          <div className="text-sm text-gray-900">
            {new Date(payment.dueDate).toLocaleDateString('es-ES')}
          </div>
          {payment.isOverdue && (
            <div className="text-xs text-red-600">
              {payment.daysOverdue} días vencido
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (payment) => (
        <PaymentStatusBadge status={payment.status} isOverdue={payment.isOverdue} />
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'right',
      render: (payment) => (
        <ActionsCell>
          <Link
            to={`/admin/payments/${payment.id}`}
            className="font-medium text-blue-600 hover:text-blue-800"
          >
            Ver
          </Link>
          {onMarkAsPaid && payment.status === 'PENDING' && (
            <ActionButton
              onClick={() => onMarkAsPaid(payment.id)}
              variant="success"
              disabled={isMarkingAsPaid}
            >
              Marcar pagado
            </ActionButton>
          )}
          {onCancel && payment.status === 'PENDING' && (
            <ActionButton
              onClick={() => onCancel(payment.id)}
              variant="danger"
              disabled={isCancelling}
            >
              Cancelar
            </ActionButton>
          )}
        </ActionsCell>
      ),
    },
  ]

  return (
    <DataTable
      data={payments}
      columns={columns}
      keyExtractor={(payment) => payment.id}
      emptyMessage="No se encontraron pagos"
    />
  )
}
