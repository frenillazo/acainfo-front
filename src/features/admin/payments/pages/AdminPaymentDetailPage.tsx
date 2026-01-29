import { useParams, Link } from 'react-router-dom'
import { useAdminPayment, useMarkPaymentAsPaid, useCancelPayment } from '../hooks/useAdminPayments'
import { PaymentStatusBadge } from '../components/PaymentStatusBadge'
import { PaymentTypeBadge } from '../components/PaymentTypeBadge'
import { ConfirmDialog } from '@/shared/components/common/ConfirmDialog'
import { PromptDialog } from '@/shared/components/common/PromptDialog'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs'
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog'
import { usePromptDialog } from '@/shared/hooks/usePromptDialog'
import { formatCurrency } from '@/shared/utils/formatCurrency'

export function AdminPaymentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const paymentId = id ? parseInt(id, 10) : 0

  const { data: payment, isLoading, error } = useAdminPayment(paymentId)
  const markAsPaidMutation = useMarkPaymentAsPaid()
  const cancelMutation = useCancelPayment()
  const { dialogProps: confirmDialogProps, confirm } = useConfirmDialog()
  const { dialogProps: promptDialogProps, prompt } = usePromptDialog()

  const handleMarkAsPaid = async () => {
    const confirmed = await confirm({
      title: 'Marcar como pagado',
      message: '¿Marcar este pago como pagado?',
      confirmLabel: 'Sí, marcar como pagado',
      variant: 'info',
    })
    if (confirmed) {
      markAsPaidMutation.mutate({ id: paymentId })
    }
  }

  const handleCancel = async () => {
    const reason = await prompt({
      title: 'Cancelar pago',
      message: '¿Estás seguro de que quieres cancelar este pago?',
      inputLabel: 'Motivo de cancelación (opcional)',
      inputPlaceholder: 'Ingresa el motivo...',
      confirmLabel: 'Cancelar pago',
    })
    if (reason !== null) {
      cancelMutation.mutate({
        id: paymentId,
        data: reason ? { reason } : undefined,
      })
    }
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (error || !payment) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/payments"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          ← Volver a pagos
        </Link>
        <ErrorState error={error} title="Error al cargar el pago" />
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
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumbs
        homeHref="/admin"
        items={[
          { label: 'Pagos', href: '/admin/payments' },
          { label: `Pago #${payment.id}` },
        ]}
      />

      {/* Header */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Pago #{payment.id}
            </h1>
            <p className="mt-1 text-gray-500">
              {payment.studentName} - {payment.subjectName}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <PaymentStatusBadge status={payment.status} isOverdue={payment.isOverdue} />
            {payment.status === 'PENDING' && (
              <>
                <button
                  onClick={handleMarkAsPaid}
                  disabled={markAsPaidMutation.isPending}
                  className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {markAsPaidMutation.isPending ? 'Procesando...' : 'Marcar como pagado'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={cancelMutation.isPending}
                  className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {cancelMutation.isPending ? 'Cancelando...' : 'Cancelar pago'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Payment Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Información del Pago
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Monto</dt>
              <dd className="mt-1 text-2xl font-bold text-gray-900">
                {formatCurrency(payment.amount)}
              </dd>
            </div>
            {payment.totalHours && payment.pricePerHour && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Detalle de cálculo</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {payment.totalHours} horas × {formatCurrency(payment.pricePerHour)}/hora
                </dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-500">Tipo de pago</dt>
              <dd className="mt-1">
                <PaymentTypeBadge type={payment.type} />
              </dd>
            </div>
            {payment.billingMonth && payment.billingYear && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Periodo de facturación</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {getMonthName(payment.billingMonth)} {payment.billingYear}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-500">Fecha de generación</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(payment.generatedAt).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Fecha de vencimiento</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(payment.dueDate).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
                {payment.isOverdue && (
                  <span className="ml-2 text-red-600 font-medium">
                    (Vencido hace {payment.daysOverdue} días)
                  </span>
                )}
              </dd>
            </div>
            {payment.paidAt && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Fecha de pago</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(payment.paidAt).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </dd>
              </div>
            )}
            {payment.description && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Descripción</dt>
                <dd className="mt-1 text-sm text-gray-900">{payment.description}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Student & Enrollment Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Información del Estudiante
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Estudiante</dt>
              <dd className="mt-1 text-sm text-gray-900">{payment.studentName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">ID Estudiante</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <Link
                  to={`/admin/users/${payment.studentId}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  #{payment.studentId}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Asignatura</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {payment.subjectName} ({payment.subjectCode})
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">ID Inscripción</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <Link
                  to={`/admin/enrollments/${payment.enrollmentId}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  #{payment.enrollmentId}
                </Link>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Metadata */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Metadatos</h2>
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Creado</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Date(payment.createdAt).toLocaleString('es-ES')}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Última actualización</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Date(payment.updatedAt).toLocaleString('es-ES')}
            </dd>
          </div>
        </dl>
      </div>

      <ConfirmDialog {...confirmDialogProps} isLoading={markAsPaidMutation.isPending} />
      <PromptDialog {...promptDialogProps} isLoading={cancelMutation.isPending} />
    </div>
  )
}
