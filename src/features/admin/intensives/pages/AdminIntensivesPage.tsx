import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUrlFilters } from '@/shared/hooks/useUrlFilters'
import {
  useAdminIntensives,
  useCancelIntensive,
  useDeleteIntensive,
} from '../hooks/useAdminIntensives'
import { IntensiveTable } from '../components/IntensiveTable'
import { ConfirmDialog } from '@/shared/components/common/ConfirmDialog'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { Pagination } from '@/shared/components/ui/Pagination'
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog'
import { useDebounce } from '@/shared/hooks/useDebounce'
import type { IntensiveFilters, IntensiveStatus } from '../types/intensive.types'

export function AdminIntensivesPage() {
  const [filters, setFilters] = useUrlFilters<IntensiveFilters>({ page: 0, size: 10 })
  const [searchInput, setSearchInput] = useState(filters.searchTerm ?? '')
  const debouncedSearch = useDebounce(searchInput, 300)

  useEffect(() => {
    setFilters((prev) => ({ ...prev, searchTerm: debouncedSearch || undefined, page: 0 }))
  }, [debouncedSearch])

  const { data, isLoading, error } = useAdminIntensives(filters)
  const cancelMutation = useCancelIntensive()
  const deleteMutation = useDeleteIntensive()
  const { dialogProps, confirm } = useConfirmDialog()

  const handleStatusChange = (status: IntensiveStatus | '') => {
    setFilters((prev) => ({ ...prev, status: status || undefined, page: 0 }))
  }

  const handlePageChange = (page: number) => {
    if (!Number.isNaN(page) && page >= 0) {
      setFilters((prev) => ({ ...prev, page }))
    }
  }

  const handleCancel = async (id: number) => {
    const confirmed = await confirm({
      title: 'Cancelar intensivo',
      message: '¿Seguro que quieres cancelar este intensivo?',
      confirmLabel: 'Sí, cancelar',
      variant: 'warning',
    })
    if (confirmed) cancelMutation.mutate(id)
  }

  const handleDelete = async (id: number) => {
    const confirmed = await confirm({
      title: 'Eliminar intensivo',
      message: '¿Seguro que quieres eliminar este intensivo? Esta acción no se puede deshacer.',
      confirmLabel: 'Sí, eliminar',
      variant: 'danger',
    })
    if (confirmed) deleteMutation.mutate(id)
  }

  if (error) return <ErrorState error={error} title="Error al cargar intensivos" />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Intensivos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Cursos cortos con sesiones puntuales (sin schedules recurrentes)
          </p>
        </div>
        <Link
          to="/admin/intensives/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Crear intensivo
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <select
              id="status"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filters.status ?? ''}
              onChange={(e) => handleStatusChange(e.target.value as IntensiveStatus | '')}
            >
              <option value="">Todos</option>
              <option value="OPEN">Abierto</option>
              <option value="CLOSED">Cerrado</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>

          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Buscar
            </label>
            <input
              type="text"
              id="search"
              placeholder="Nombre del intensivo..."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <div className="flex items-end">
            <p className="text-sm text-gray-500">
              {data ? (
                <>
                  Mostrando {data.content.length} de {data.totalElements} intensivos
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
          <IntensiveTable
            intensives={data.content}
            onCancel={handleCancel}
            onDelete={handleDelete}
            isCancelling={cancelMutation.isPending}
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

      <ConfirmDialog
        {...dialogProps}
        isLoading={cancelMutation.isPending || deleteMutation.isPending}
      />
    </div>
  )
}
