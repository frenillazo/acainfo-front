import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  useAdminSubjects,
  useArchiveSubject,
  useDeleteSubject,
} from '../hooks/useAdminSubjects'
import { SubjectTable } from '../components/SubjectTable'
import { ConfirmDialog } from '@/shared/components/common/ConfirmDialog'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog'
import type { SubjectFilters, SubjectStatus, Degree } from '../../types/admin.types'

export function AdminSubjectsPage() {
  const [filters, setFilters] = useState<SubjectFilters>({
    page: 0,
    size: 10,
  })
  const [searchTerm, setSearchTerm] = useState('')

  const { data, isLoading, error } = useAdminSubjects(filters)
  const archiveMutation = useArchiveSubject()
  const deleteMutation = useDeleteSubject()
  const { dialogProps, confirm } = useConfirmDialog()

  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      searchTerm: searchTerm || undefined,
      page: 0,
    }))
  }

  const handleStatusChange = (status: SubjectStatus | '') => {
    setFilters((prev) => ({
      ...prev,
      status: status || undefined,
      page: 0,
    }))
  }

  const handleDegreeChange = (degree: Degree | '') => {
    setFilters((prev) => ({
      ...prev,
      degree: degree || undefined,
      page: 0,
    }))
  }

  const handlePageChange = (page: number) => {
    if (!Number.isNaN(page) && page >= 0) {
      setFilters((prev) => ({ ...prev, page }))
    }
  }

  const handleArchive = async (id: number) => {
    const confirmed = await confirm({
      title: 'Archivar asignatura',
      message: '¿Estás seguro de que quieres archivar esta asignatura?',
      confirmLabel: 'Sí, archivar',
      variant: 'warning',
    })
    if (confirmed) {
      archiveMutation.mutate(id)
    }
  }

  const handleDelete = async (id: number) => {
    const confirmed = await confirm({
      title: 'Eliminar asignatura',
      message: '¿Estás seguro de que quieres eliminar esta asignatura? Esta acción no se puede deshacer.',
      confirmLabel: 'Sí, eliminar',
      variant: 'danger',
    })
    if (confirmed) {
      deleteMutation.mutate(id)
    }
  }

  if (error) {
    return <ErrorState error={error} title="Error al cargar asignaturas" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Asignaturas
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra las asignaturas del sistema
          </p>
        </div>
        <Link
          to="/admin/subjects/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Crear asignatura
        </Link>
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
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                id="search"
                placeholder="Código o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleSearch}
                className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Buscar
              </button>
            </div>
          </div>

          {/* Degree filter */}
          <div>
            <label
              htmlFor="degree"
              className="block text-sm font-medium text-gray-700"
            >
              Grado
            </label>
            <select
              id="degree"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filters.degree ?? ''}
              onChange={(e) => handleDegreeChange(e.target.value as Degree | '')}
            >
              <option value="">Todos</option>
              <option value="INGENIERIA_INFORMATICA">Ing. Informática</option>
              <option value="INGENIERIA_INDUSTRIAL">Ing. Industrial</option>
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
                handleStatusChange(e.target.value as SubjectStatus | '')
              }
            >
              <option value="">Todos</option>
              <option value="ACTIVE">Activa</option>
              <option value="INACTIVE">Inactiva</option>
              <option value="ARCHIVED">Archivada</option>
            </select>
          </div>

          {/* Results info */}
          <div className="flex items-end">
            <p className="text-sm text-gray-500">
              {data ? (
                <>
                  Mostrando {data.content.length} de {data.totalElements} asignaturas
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
          <SubjectTable
            key={`page-${data.page}`}
            subjects={data.content}
            onArchive={handleArchive}
            onDelete={handleDelete}
            isArchiving={archiveMutation.isPending}
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

      <ConfirmDialog {...dialogProps} isLoading={archiveMutation.isPending || deleteMutation.isPending} />
    </div>
  )
}
