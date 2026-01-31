import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAdminUsers } from '../hooks/useAdminUsers'
import { UserTable } from '../components/UserTable'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { Pagination } from '@/shared/components/ui/Pagination'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { adminApi, type DeactivationResult } from '@/features/auth/services/adminApi'
import { UserMinus, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import type { UserFilters, UserStatus, RoleType } from '../../types/admin.types'

export function AdminUsersPage() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<UserFilters>({
    page: 0,
    size: 10,
  })
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 300)

  // Selection state for batch operations
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([])
  const [showBatchMode, setShowBatchMode] = useState(false)
  const [batchResult, setBatchResult] = useState<DeactivationResult | null>(null)

  const { data, isLoading, error } = useAdminUsers(filters)

  // Batch deactivation mutation
  const deactivateMutation = useMutation({
    mutationFn: adminApi.deactivateBatch,
    onSuccess: (result) => {
      setBatchResult(result)
      setSelectedUserIds([])
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })

  useEffect(() => {
    setFilters((prev) => ({ ...prev, searchTerm: debouncedSearch || undefined, page: 0 }))
  }, [debouncedSearch])

  // Clear selection when changing pages or filters
  useEffect(() => {
    setSelectedUserIds([])
  }, [filters])

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

  const handleRoleChange = (roleType: RoleType | '') => {
    setFilters((prev) => ({
      ...prev,
      roleType: roleType || undefined,
      page: 0,
    }))
  }

  const handlePageChange = (page: number) => {
    if (!Number.isNaN(page) && page >= 0) {
      setFilters((prev) => ({ ...prev, page }))
    }
  }

  const handleBatchDeactivate = () => {
    if (selectedUserIds.length === 0) return
    if (
      !confirm(
        `¿Estás seguro de que quieres desactivar ${selectedUserIds.length} usuario(s)?\n\nSolo se desactivarán los usuarios que NO tengan inscripciones activas.`
      )
    ) {
      return
    }
    deactivateMutation.mutate(selectedUserIds)
  }

  const toggleBatchMode = () => {
    setShowBatchMode(!showBatchMode)
    setSelectedUserIds([])
    setBatchResult(null)
  }

  if (error) {
    return <ErrorState error={error} title="Error al cargar usuarios" />
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
        <button
          type="button"
          onClick={toggleBatchMode}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            showBatchMode
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <UserMinus className="h-4 w-4" />
          {showBatchMode ? 'Cancelar selección' : 'Desactivar por lotes'}
        </button>
      </div>

      {/* Batch mode info */}
      {showBatchMode && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-amber-800">Modo de desactivación por lotes</h3>
              <p className="text-sm text-amber-700 mt-1">
                Selecciona los usuarios que quieres desactivar. Solo se desactivarán los usuarios ACTIVOS
                que NO tengan inscripciones activas. Los usuarios con rol ADMIN no pueden ser seleccionados.
              </p>
              {selectedUserIds.length > 0 && (
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-sm font-medium text-amber-800">
                    {selectedUserIds.length} usuario(s) seleccionado(s)
                  </span>
                  <button
                    type="button"
                    onClick={handleBatchDeactivate}
                    disabled={deactivateMutation.isPending}
                    className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {deactivateMutation.isPending ? 'Procesando...' : 'Desactivar seleccionados'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Batch result */}
      {batchResult && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="font-medium text-gray-900 mb-3">Resultado de la desactivación</h3>
          <div className="grid grid-cols-3 gap-4 mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">
                <span className="font-medium">{batchResult.deactivated}</span> desactivados
              </span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-gray-400" />
              <span className="text-sm">
                <span className="font-medium">{batchResult.skipped}</span> omitidos
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Total procesados: {batchResult.totalProcessed}
              </span>
            </div>
          </div>
          {batchResult.errors.length > 0 && (
            <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700">
              <p className="font-medium">Errores:</p>
              <ul className="list-disc list-inside mt-1">
                {batchResult.errors.slice(0, 5).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
                {batchResult.errors.length > 5 && (
                  <li>... y {batchResult.errors.length - 5} más</li>
                )}
              </ul>
            </div>
          )}
          <button
            type="button"
            className="mt-2 rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
            onClick={() => setBatchResult(null)}
          >
            Cerrar
          </button>
        </div>
      )}

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
        <LoadingState />
      ) : data ? (
        <>
          <UserTable
            key={`page-${data.page}`}
            users={data.content}
            showSelection={showBatchMode}
            selectedUserIds={selectedUserIds}
            onSelectionChange={setSelectedUserIds}
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
    </div>
  )
}
