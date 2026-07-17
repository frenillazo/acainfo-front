import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUrlFilters } from '@/shared/hooks/useUrlFilters'
import {
  useAdminCourses,
  useCancelCourse,
  useDeleteCourse,
} from '../hooks/useAdminCourses'
import { CourseTable } from '../components/CourseTable'
import { AdminCourseCards } from '../components/AdminCourseCard'
import { ConfirmDialog } from '@/shared/components/common/ConfirmDialog'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { Card, PageHeader, Pagination } from '@/shared/components/ui'
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { LayoutGrid, List } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import type { CourseFilters, CourseStatus } from '../../types/admin.types'

export function AdminCoursesPage() {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards')
  // Por defecto solo cursos abiertos; el desplegable permite ver cerrados/cancelados/todos
  const [filters, setFilters] = useUrlFilters<CourseFilters>({
    page: 0,
    size: 10,
    status: 'OPEN',
  })
  const [searchInput, setSearchInput] = useState(filters.searchTerm ?? '')
  const debouncedSearch = useDebounce(searchInput, 300)

  useEffect(() => {
    setFilters((prev) => ({ ...prev, searchTerm: debouncedSearch || undefined, page: 0 }))
  }, [debouncedSearch, setFilters])

  const { data, isLoading, error } = useAdminCourses(filters)
  const cancelMutation = useCancelCourse()
  const deleteMutation = useDeleteCourse()
  const { dialogProps, confirm } = useConfirmDialog()

  const handleStatusChange = (status: CourseStatus | '') => {
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

  const handleCancel = async (id: number) => {
    const confirmed = await confirm({
      title: 'Cancelar curso',
      message: '¿Estás seguro de que quieres cancelar este curso?',
      confirmLabel: 'Sí, cancelar',
      variant: 'warning',
    })
    if (confirmed) {
      cancelMutation.mutate(id)
    }
  }

  const handleDelete = async (id: number) => {
    const confirmed = await confirm({
      title: 'Eliminar curso',
      message: '¿Estás seguro de que quieres eliminar este curso? Esta acción no se puede deshacer.',
      confirmLabel: 'Sí, eliminar',
      variant: 'danger',
    })
    if (confirmed) {
      deleteMutation.mutate(id)
    }
  }

  if (error) {
    return <ErrorState error={error} title="Error al cargar cursos" />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Cursos"
        subtitle="Administra los cursos del sistema"
        actions={
          <>
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
              to="/admin/courses/new"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Crear curso
            </Link>
          </>
        }
      />

      {/* Filters */}
      <Card padding="sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                handleStatusChange(e.target.value as CourseStatus | '')
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
              placeholder="Nombre del curso..."
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
                  Mostrando {data.content.length} de {data.totalElements} cursos
                </>
              ) : (
                'Cargando...'
              )}
            </p>
          </div>
        </div>
      </Card>

      {/* Content */}
      {isLoading ? (
        <LoadingState />
      ) : data ? (
        <>
          {viewMode === 'table' ? (
            <CourseTable
              key={`page-${data.page}`}
              courses={data.content}
              onCancel={handleCancel}
              onDelete={handleDelete}
              isCancelling={cancelMutation.isPending}
              isDeleting={deleteMutation.isPending}
            />
          ) : (
            <AdminCourseCards
              courses={data.content}
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
