import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  useAdminEnrollments,
  useWithdrawEnrollment,
  type AdminEnrollmentFilters,
} from '../hooks/useAdminEnrollments'
import { EnrollmentTable } from '../components/EnrollmentTable'
import { ConfirmDialog } from '@/shared/components/common/ConfirmDialog'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog'
import type { EnrollmentStatus } from '@/features/enrollments/types/enrollment.types'

export function AdminEnrollmentsPage() {
  const [filters, setFilters] = useState<AdminEnrollmentFilters>({
    page: 0,
    size: 10,
  })

  const { data, isLoading, error } = useAdminEnrollments(filters)
  const withdrawMutation = useWithdrawEnrollment()
  const { dialogProps, confirm } = useConfirmDialog()

  const handleSearchByStudent = (studentId: string) => {
    const id = studentId ? parseInt(studentId, 10) : undefined
    setFilters((prev) => ({ ...prev, studentId: id, page: 0 }))
  }

  const handleSearchByGroup = (groupId: string) => {
    const id = groupId ? parseInt(groupId, 10) : undefined
    setFilters((prev) => ({ ...prev, groupId: id, page: 0 }))
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
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Error al cargar inscripciones. Por favor, intenta de nuevo.
      </div>
    )
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

          {/* Group ID filter */}
          <div>
            <label
              htmlFor="groupId"
              className="block text-sm font-medium text-gray-700"
            >
              ID Grupo
            </label>
            <input
              type="number"
              id="groupId"
              placeholder="ID del grupo..."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filters.groupId ?? ''}
              onChange={(e) => handleSearchByGroup(e.target.value)}
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

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <div className="text-sm text-gray-500">
                Página {(data.page ?? 0) + 1} de {data.totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange((data.page ?? 0) - 1)}
                  disabled={data.first}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePageChange((data.page ?? 0) + 1)}
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

      <ConfirmDialog {...dialogProps} isLoading={withdrawMutation.isPending} />
    </div>
  )
}
