import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  useAdminEnrollments,
  useWithdrawEnrollment,
  type AdminEnrollmentFilters,
} from '../hooks/useAdminEnrollments'
import { EnrollmentTable } from '../components/EnrollmentTable'
import { ConfirmDialog } from '@/shared/components/common/ConfirmDialog'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { Pagination } from '@/shared/components/ui/Pagination'
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog'
import { useDebounce } from '@/shared/hooks/useDebounce'
import type { EnrollmentStatus } from '@/features/enrollments/types/enrollment.types'

export function AdminEnrollmentsPage() {
  const [filters, setFilters] = useState<AdminEnrollmentFilters>({
    page: 0,
    size: 10,
  })
  const [studentEmailInput, setStudentEmailInput] = useState('')
  const debouncedStudentEmail = useDebounce(studentEmailInput, 300)

  const { data, isLoading, error } = useAdminEnrollments(filters)
  const withdrawMutation = useWithdrawEnrollment()
  const { dialogProps, confirm } = useConfirmDialog()

  useEffect(() => {
    setFilters((prev) => ({ ...prev, studentEmail: debouncedStudentEmail || undefined, page: 0 }))
  }, [debouncedStudentEmail])

  const handleSearchByStudentEmail = (value: string) => {
    setStudentEmailInput(value)
  }

  const handleStatusChange = (status: EnrollmentStatus | '') => {
    setFilters((prev) => ({
      ...prev,
      status: status || undefined,
      page: 0,
    }))
  }

  const handlePageChange = (page: number) => {
    if (!Number.isNaN(page) && page >= 0) {
      setFilters((prev) => ({ ...prev, page }))
    }
  }

  const handleWithdraw = async (id: number) => {
    const confirmed = await confirm({
      title: 'Retirar inscripción',
      message: '¿Estás seguro de que quieres retirar esta inscripción?',
      confirmLabel: 'Sí, retirar',
      variant: 'danger',
    })
    if (confirmed) {
      withdrawMutation.mutate(id)
    }
  }

  if (error) {
    return <ErrorState error={error} title="Error al cargar inscripciones" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Inscripciones
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra las inscripciones del sistema
          </p>
        </div>
        <Link
          to="/admin/enrollments/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Nueva inscripción
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              onChange={(e) =>
                handleStatusChange(e.target.value as EnrollmentStatus | '')
              }
            >
              <option value="">Todos</option>
              <option value="ACTIVE">Activa</option>
              <option value="WAITING_LIST">Lista de espera</option>
              <option value="WITHDRAWN">Retirado</option>
              <option value="COMPLETED">Completada</option>
            </select>
          </div>

          {/* Results info */}
          <div className="flex items-end">
            <p className="text-sm text-gray-500">
              {data ? (
                <>
                  Mostrando {data.content.length} de {data.totalElements}{' '}
                  inscripciones
                </>
              ) : (
                'Cargando...'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <LoadingState />
      ) : data ? (
        <>
          <EnrollmentTable
            key={`page-${data.page}`}
            enrollments={data.content}
            onWithdraw={handleWithdraw}
            isWithdrawing={withdrawMutation.isPending}
          />

          <Pagination
            currentPage={data.page ?? 0}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
            isFirst={data.first}
            isLast={data.last}
          />
        </>
      ) : null}

      <ConfirmDialog {...dialogProps} isLoading={withdrawMutation.isPending} />
    </div>
  )
}
