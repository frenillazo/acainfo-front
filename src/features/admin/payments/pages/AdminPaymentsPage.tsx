import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAdminPayments, useMarkPaymentAsPaid, useCancelPayment } from '../hooks/useAdminPayments'
import { PaymentTable } from '../components/PaymentTable'
import { ConfirmDialog } from '@/shared/components/common/ConfirmDialog'
import { PromptDialog } from '@/shared/components/common/PromptDialog'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { Pagination } from '@/shared/components/ui/Pagination'
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog'
import { usePromptDialog } from '@/shared/hooks/usePromptDialog'
import { useDebounce } from '@/shared/hooks/useDebounce'
import type { PaymentFilters, PaymentStatus, PaymentType } from '@/features/payments/types/payment.types'

export function AdminPaymentsPage() {
  const [filters, setFilters] = useState<PaymentFilters>({
    page: 0,
    size: 20,
    sortBy: 'dueDate',
    sortDirection: 'ASC',
  })
  const [studentEmailInput, setStudentEmailInput] = useState('')
  const debouncedStudentEmail = useDebounce(studentEmailInput, 300)

  const { data, isLoading, error } = useAdminPayments(filters)
  const markAsPaidMutation = useMarkPaymentAsPaid()
  const cancelMutation = useCancelPayment()
  const { dialogProps: confirmDialogProps, confirm } = useConfirmDialog()
  const { dialogProps: promptDialogProps, prompt } = usePromptDialog()

  useEffect(() => {
    setFilters((prev) => ({ ...prev, studentEmail: debouncedStudentEmail || undefined, page: 0 }))
  }, [debouncedStudentEmail])

  const handleSearchByStudentEmail = (value: string) => {
    setStudentEmailInput(value)
  }

  const handleStatusChange = (status: PaymentStatus | '') => {
    setFilters((prev) => ({
      ...prev,
      status: status || undefined,
      page: 0,
    }))
  }

  const handleTypeChange = (type: PaymentType | '') => {
    setFilters((prev) => ({
      ...prev,
      type: type || undefined,
      page: 0,
    }))
  }

  const handleOverdueChange = (value: string) => {
    let isOverdue: boolean | undefined
    if (value === 'true') isOverdue = true
    else if (value === 'false') isOverdue = false
    else isOverdue = undefined

    setFilters((prev) => ({
      ...prev,
      isOverdue,
      page: 0,
    }))
  }

  const handlePageChange = (page: number) => {
    if (!Number.isNaN(page) && page >= 0) {
      setFilters((prev) => ({ ...prev, page }))
    }
  }

  const handleMarkAsPaid = async (id: number) => {
    const confirmed = await confirm({
      title: 'Marcar como pagado',
      message: '¿Marcar este pago como pagado?',
      confirmLabel: 'Sí, marcar como pagado',
      variant: 'info',
    })
    if (confirmed) {
      markAsPaidMutation.mutate({ id })
    }
  }

  const handleCancel = async (id: number) => {
    const reason = await prompt({
      title: 'Cancelar pago',
      message: '¿Estás seguro de que quieres cancelar este pago?',
      inputLabel: 'Motivo de cancelación (opcional)',
      inputPlaceholder: 'Ingresa el motivo...',
      confirmLabel: 'Cancelar pago',
    })
    if (reason !== null) {
      cancelMutation.mutate({
        id,
        data: reason ? { reason } : undefined,
      })
    }
  }

  if (error) {
    return <ErrorState error={error} title="Error al cargar pagos" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Pagos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra los pagos del sistema
          </p>
        </div>
        <Link
          to="/admin/payments/generate"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Generar Pagos
        </Link>
      </div>

      {/* Stats Cards */}
      {data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500">Total pagos</div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">
              {data.totalElements}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Student Email filter */}
          <div>
            <label
              htmlFor="studentEmail"
              className="block text-sm font-medium text-gray-700"
            >
              Email del Estudiante
            </label>
            <input
              type="text"
              id="studentEmail"
              placeholder="Buscar por email..."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={studentEmailInput}
              onChange={(e) => handleSearchByStudentEmail(e.target.value)}
            />
          </div>

          {/* Status filter */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Estado
            </label>
            <select
              id="status"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filters.status ?? ''}
              onChange={(e) => handleStatusChange(e.target.value as PaymentStatus | '')}
            >
              <option value="">Todos</option>
              <option value="PENDING">Pendiente</option>
              <option value="PAID">Pagado</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>

          {/* Type filter */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Tipo
            </label>
            <select
              id="type"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filters.type ?? ''}
              onChange={(e) => handleTypeChange(e.target.value as PaymentType | '')}
            >
              <option value="">Todos</option>
              <option value="INITIAL">Inicial</option>
              <option value="MONTHLY">Mensual</option>
              <option value="INTENSIVE_FULL">Intensivo</option>
            </select>
          </div>

          {/* Overdue filter */}
          <div>
            <label
              htmlFor="overdue"
              className="block text-sm font-medium text-gray-700"
            >
              Vencido
            </label>
            <select
              id="overdue"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={
                filters.isOverdue === undefined
                  ? ''
                  : filters.isOverdue
                    ? 'true'
                    : 'false'
              }
              onChange={(e) => handleOverdueChange(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="true">Solo vencidos</option>
              <option value="false">No vencidos</option>
            </select>
          </div>
        </div>

        {/* Results info */}
        <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
          <p className="text-sm text-gray-500">
            {data ? (
              <>
                Mostrando {data.content.length} de {data.totalElements} pagos
              </>
            ) : (
              'Cargando...'
            )}
          </p>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <LoadingState />
      ) : data ? (
        <>
          <PaymentTable
            key={`page-${data.page}`}
            payments={data.content}
            onMarkAsPaid={handleMarkAsPaid}
            onCancel={handleCancel}
            isMarkingAsPaid={markAsPaidMutation.isPending}
            isCancelling={cancelMutation.isPending}
          />

          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
            isFirst={data.first}
            isLast={data.last}
          />
        </>
      ) : null}

      <ConfirmDialog {...confirmDialogProps} isLoading={markAsPaidMutation.isPending} />
      <PromptDialog {...promptDialogProps} isLoading={cancelMutation.isPending} />
    </div>
  )
}
