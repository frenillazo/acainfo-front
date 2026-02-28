import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUrlFilters } from '@/shared/hooks/useUrlFilters'
import { useAdminTeachers, useDeleteTeacher } from '../hooks/useAdminTeachers'
import { TeacherTable } from '../components/TeacherTable'
import { ConfirmDialog } from '@/shared/components/common/ConfirmDialog'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { Pagination } from '@/shared/components/ui/Pagination'
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog'
import { useDebounce } from '@/shared/hooks/useDebounce'
import type { TeacherFilters, UserStatus } from '../../types/admin.types'

export function AdminTeachersPage() {
  const [filters, setFilters] = useUrlFilters<TeacherFilters>({
    page: 0,
    size: 10,
  })
  const [searchInput, setSearchInput] = useState(filters.searchTerm ?? '')
  const debouncedSearch = useDebounce(searchInput, 300)

  const { data, isLoading, error } = useAdminTeachers(filters)
  const deleteMutation = useDeleteTeacher()
  const { dialogProps, confirm } = useConfirmDialog()

  useEffect(() => {
    setFilters((prev) => ({ ...prev, searchTerm: debouncedSearch || undefined, page: 0 }))
  }, [debouncedSearch])

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
  }

  const handleStatusChange = (status: UserStatus | '') => {
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

  const handleDelete = async (id: number) => {
    const confirmed = await confirm({
      title: 'Eliminar profesor',
      message: '¿Estás seguro de que quieres eliminar este profesor?',
      confirmLabel: 'Sí, eliminar',
      variant: 'danger',
    })
    if (confirmed) {
      deleteMutation.mutate(id)
    }
  }

  if (error) {
    return <ErrorState error={error} title="Error al cargar profesores" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Profesores
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra los profesores del sistema
          </p>
        </div>
        <Link
          to="/admin/teachers/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Crear profesor
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              value={searchInput}
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

          {/* Results info */}
          <div className="flex items-end">
            <p className="text-sm text-gray-500">
              {data ? (
                <>
                  Mostrando {data.content.length} de {data.totalElements}{' '}
                  profesores
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
          <TeacherTable
            key={`page-${data.page}`}
            teachers={data.content}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
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

      <ConfirmDialog {...dialogProps} isLoading={deleteMutation.isPending} />
    </div>
  )
}
