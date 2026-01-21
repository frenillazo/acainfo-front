import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminPayments, useMarkPaymentAsPaid, useCancelPayment } from '../hooks/useAdminPayments'
import { PaymentTable } from '../components/PaymentTable'
import type { PaymentFilters, PaymentStatus, PaymentType } from '@/features/payments/types/payment.types'

export function AdminPaymentsPage() {
  const [filters, setFilters] = useState<PaymentFilters>({
    page: 0,
    size: 20,
    sortBy: 'dueDate',
    sortDirection: 'ASC',
  })

  const { data, isLoading, error } = useAdminPayments(filters)
  const markAsPaidMutation = useMarkPaymentAsPaid()
  const cancelMutation = useCancelPayment()

  const handleSearchByStudent = (studentId: string) => {
    const id = studentId ? parseInt(studentId, 10) : undefined
    setFilters((prev) => ({ ...prev, studentId: id, page: 0 }))
  }

  const handleSearchByEnrollment = (enrollmentId: string) => {
    const id = enrollmentId ? parseInt(enrollmentId, 10) : undefined
    setFilters((prev) => ({ ...prev, enrollmentId: id, page: 0 }))
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

  const handleMarkAsPaid = (id: number) => {
    if (window.confirm('¿Marcar este pago como pagado?')) {
      markAsPaidMutation.mutate({ id })
    }
  }

  const handleCancel = (id: number) => {
    const reason = window.prompt('Motivo de cancelación (opcional):')
    if (reason !== null) {
      cancelMutation.mutate({
        id,
        data: reason ? { reason } : undefined,
      })
    }
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Error al cargar pagos. Por favor, intenta de nuevo.
      </div>
    )
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Student ID filter */}
          <div>
            <label
              htmlFor="studentId"
              className="block text-sm font-medium text-gray-700"
            >
              ID Estudiante
            </label>
            <input
              type="number"
              id="studentId"
              placeholder="ID del estudiante..."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filters.studentId ?? ''}
              onChange={(e) => handleSearchByStudent(e.target.value)}
            />
          </div>

          {/* Enrollment ID filter */}
          <div>
            <label
              htmlFor="enrollmentId"
              className="block text-sm font-medium text-gray-700"
            >
              ID Inscripción
            </label>
            <input
              type="number"
              id="enrollmentId"
              placeholder="ID de inscripción..."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filters.enrollmentId ?? ''}
              onChange={(e) => handleSearchByEnrollment(e.target.value)}
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
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        </div>
      ) : data ? (
        <>
          <PaymentTable
            key={`page-${data.pageNumber}`}
            payments={data.content}
            onMarkAsPaid={handleMarkAsPaid}
            onCancel={handleCancel}
            isMarkingAsPaid={markAsPaidMutation.isPending}
            isCancelling={cancelMutation.isPending}
          />

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <div className="text-sm text-gray-500">
                Página {data.pageNumber + 1} de {data.totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(data.pageNumber - 1)}
                  disabled={data.first}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePageChange(data.pageNumber + 1)}
                  disabled={data.last}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  )
}
