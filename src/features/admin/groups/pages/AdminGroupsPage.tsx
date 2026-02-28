import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUrlFilters } from '@/shared/hooks/useUrlFilters'
import {
  useAdminGroups,
  useCancelGroup,
  useDeleteGroup,
} from '../hooks/useAdminGroups'
import { GroupTable } from '../components/GroupTable'
import { AdminGroupCards } from '../components/AdminGroupCard'
import { ConfirmDialog } from '@/shared/components/common/ConfirmDialog'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { Pagination } from '@/shared/components/ui/Pagination'
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { LayoutGrid, List } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import type { GroupFilters, GroupStatus, GroupType } from '../../types/admin.types'

export function AdminGroupsPage() {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards')
  const [filters, setFilters] = useUrlFilters<GroupFilters>({
    page: 0,
    size: 10,
  })
  const [searchInput, setSearchInput] = useState(filters.searchTerm ?? '')
  const debouncedSearch = useDebounce(searchInput, 300)

  useEffect(() => {
    setFilters((prev) => ({ ...prev, searchTerm: debouncedSearch || undefined, page: 0 }))
  }, [debouncedSearch])

  const { data, isLoading, error } = useAdminGroups(filters)
  const cancelMutation = useCancelGroup()
  const deleteMutation = useDeleteGroup()
  const { dialogProps, confirm } = useConfirmDialog()

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

  const handleCancel = async (id: number) => {
    const confirmed = await confirm({
      title: 'Cancelar grupo',
      message: '¿Estás seguro de que quieres cancelar este grupo?',
      confirmLabel: 'Sí, cancelar',
      variant: 'warning',
    })
    if (confirmed) {
      cancelMutation.mutate(id)
    }
  }

  const handleDelete = async (id: number) => {
    const confirmed = await confirm({
      title: 'Eliminar grupo',
      message: '¿Estás seguro de que quieres eliminar este grupo? Esta acción no se puede deshacer.',
      confirmLabel: 'Sí, eliminar',
      variant: 'danger',
    })
    if (confirmed) {
      deleteMutation.mutate(id)
    }
  }

  if (error) {
    return <ErrorState error={error} title="Error al cargar grupos" />
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
        <div className="flex items-center gap-3">
          <div className="flex rounded-md border border-gray-300 bg-white">
            <button
              onClick={() => setViewMode('cards')}
              className={cn(
                'inline-flex items-center rounded-l-md px-2.5 py-2 text-sm',
                viewMode === 'cards'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              )}
              title="Vista cards"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                'inline-flex items-center rounded-r-md px-2.5 py-2 text-sm',
                viewMode === 'table'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              )}
              title="Vista tabla"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <Link
            to="/admin/groups/new"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Crear grupo
          </Link>
        </div>
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
              <option value="REGULAR_Q1">Cuatrimestre 1</option>
              <option value="REGULAR_Q2">Cuatrimestre 2</option>
              <option value="INTENSIVE_Q1">Intensivo Enero</option>
              <option value="INTENSIVE_Q2">Intensivo Junio</option>
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
              placeholder="Nombre del grupo..."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

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

      {/* Content */}
      {isLoading ? (
        <LoadingState />
      ) : data ? (
        <>
          {viewMode === 'table' ? (
            <GroupTable
              key={`page-${data.page}`}
              groups={data.content}
              onCancel={handleCancel}
              onDelete={handleDelete}
              isCancelling={cancelMutation.isPending}
              isDeleting={deleteMutation.isPending}
            />
          ) : (
            <AdminGroupCards
              groups={data.content}
              onCancel={handleCancel}
              onDelete={handleDelete}
              isCancelling={cancelMutation.isPending}
              isDeleting={deleteMutation.isPending}
            />
          )}

          <Pagination
            currentPage={data.page ?? 0}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
            isFirst={data.first}
            isLast={data.last}
          />
        </>
      ) : null}

      <ConfirmDialog {...dialogProps} isLoading={cancelMutation.isPending || deleteMutation.isPending} />
    </div>
  )
}
