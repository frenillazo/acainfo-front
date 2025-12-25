import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  useAdminGroups,
  useCancelGroup,
  useDeleteGroup,
} from '../hooks/useAdminGroups'
import { GroupTable } from '../components/GroupTable'
import type { GroupFilters, GroupStatus, GroupType } from '../../types/admin.types'

export function AdminGroupsPage() {
  const [filters, setFilters] = useState<GroupFilters>({
    page: 0,
    size: 10,
  })

  const { data, isLoading, error } = useAdminGroups(filters)
  const cancelMutation = useCancelGroup()
  const deleteMutation = useDeleteGroup()

  const handleStatusChange = (status: GroupStatus | '') => {
    setFilters((prev) => ({
      ...prev,
      status: status || undefined,
      page: 0,
    }))
  }

  const handleTypeChange = (type: GroupType | '') => {
    setFilters((prev) => ({
      ...prev,
      type: type || undefined,
      page: 0,
    }))
  }

  const handlePageChange = (page: number) => {
    if (!Number.isNaN(page) && page >= 0) {
      setFilters((prev) => ({ ...prev, page }))
    }
  }

  const handleCancel = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres cancelar este grupo?')) {
      cancelMutation.mutate(id)
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este grupo? Esta acción no se puede deshacer.')) {
      deleteMutation.mutate(id)
    }
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Error al cargar grupos. Por favor, intenta de nuevo.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Grupos
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra los grupos de clases del sistema
          </p>
        </div>
        <Link
          to="/admin/groups/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Crear grupo
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              onChange={(e) => handleTypeChange(e.target.value as GroupType | '')}
            >
              <option value="">Todos</option>
              <option value="REGULAR_Q1">Regular Q1</option>
              <option value="INTENSIVE_Q1">Intensivo Q1</option>
              <option value="REGULAR_Q2">Regular Q2</option>
              <option value="INTENSIVE_Q2">Intensivo Q2</option>
            </select>
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
                handleStatusChange(e.target.value as GroupStatus | '')
              }
            >
              <option value="">Todos</option>
              <option value="OPEN">Abierto</option>
              <option value="CLOSED">Cerrado</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>

          {/* Spacer */}
          <div />

          {/* Results info */}
          <div className="flex items-end">
            <p className="text-sm text-gray-500">
              {data ? (
                <>
                  Mostrando {data.content.length} de {data.totalElements} grupos
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
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        </div>
      ) : data ? (
        <>
          <GroupTable
            key={`page-${data.page}`}
            groups={data.content}
            onCancel={handleCancel}
            onDelete={handleDelete}
            isCancelling={cancelMutation.isPending}
            isDeleting={deleteMutation.isPending}
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
    </div>
  )
}
