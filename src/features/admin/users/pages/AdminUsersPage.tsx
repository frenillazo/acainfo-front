import { useState } from 'react'
import { useAdminUsers } from '../hooks/useAdminUsers'
import { UserTable } from '../components/UserTable'
import type { UserFilters, UserStatus, RoleType } from '../../types/admin.types'

export function AdminUsersPage() {
  const [filters, setFilters] = useState<UserFilters>({
    page: 0,
    size: 10,
  })

  const { data, isLoading, error } = useAdminUsers(filters)

  const handleSearchChange = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm, page: 0 }))
  }

  const handleStatusChange = (status: UserStatus | '') => {
    setFilters((prev) => ({
      ...prev,
      status: status || undefined,
      page: 0,
    }))
  }

  const handleRoleChange = (roleType: RoleType | '') => {
    setFilters((prev) => ({
      ...prev,
      roleType: roleType || undefined,
      page: 0,
    }))
  }

  const handlePageChange = (page: number) => {
    // Ensure page is a valid number
    if (!Number.isNaN(page) && page >= 0) {
      setFilters((prev) => ({ ...prev, page }))
    }
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Error al cargar usuarios. Por favor, intenta de nuevo.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Usuarios
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra los usuarios del sistema
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700"
            >
              Buscar
            </label>
            <input
              type="text"
              id="search"
              placeholder="Nombre o email..."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filters.searchTerm ?? ''}
              onChange={(e) => handleSearchChange(e.target.value)}
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
                handleStatusChange(e.target.value as UserStatus | '')
              }
            >
              <option value="">Todos</option>
              <option value="ACTIVE">Activo</option>
              <option value="INACTIVE">Inactivo</option>
              <option value="BLOCKED">Bloqueado</option>
              <option value="PENDING_ACTIVATION">Pendiente</option>
            </select>
          </div>

          {/* Role filter */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Rol
            </label>
            <select
              id="role"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filters.roleType ?? ''}
              onChange={(e) =>
                handleRoleChange(e.target.value as RoleType | '')
              }
            >
              <option value="">Todos</option>
              <option value="ADMIN">Admin</option>
              <option value="TEACHER">Profesor</option>
              <option value="STUDENT">Estudiante</option>
            </select>
          </div>

          {/* Results info */}
          <div className="flex items-end">
            <p className="text-sm text-gray-500">
              {data ? (
                <>
                  Mostrando {data.content.length} de {data.totalElements}{' '}
                  usuarios
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
          <UserTable key={`page-${data.page}`} users={data.content} />

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
