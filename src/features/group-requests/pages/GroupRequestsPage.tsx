import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  useGroupRequests,
  useAddSupporter,
  useRemoveSupporter,
} from '../hooks/useGroupRequests'
import { GroupRequestStatusBadge } from '../components/GroupRequestStatusBadge'
import { LoadingState } from '@/shared/components/common/LoadingState'
import type { GroupRequestFilters } from '../types/groupRequest.types'
import { useAuthStore } from '@/features/auth/store/authStore'
import { formatDate } from '@/shared/utils/formatters'
import { Users, Plus, Minus } from 'lucide-react'
import { GROUP_TYPE_LABELS } from '@/shared/types/api.types'

export function GroupRequestsPage() {
  const { user } = useAuthStore()
  const [filters, setFilters] = useState<GroupRequestFilters>({
    page: 0,
    size: 10,
    status: 'PENDING',
  })

  const { data, isLoading, error } = useGroupRequests(filters)
  const addSupporterMutation = useAddSupporter()
  const removeSupporterMutation = useRemoveSupporter()

  const handlePageChange = (page: number) => {
    if (!Number.isNaN(page) && page >= 0) {
      setFilters((prev) => ({ ...prev, page }))
    }
  }

  const handleSupport = (requestId: number) => {
    if (user) {
      addSupporterMutation.mutate({
        id: requestId,
        data: { studentId: user.id },
      })
    }
  }

  const handleRemoveSupport = (requestId: number) => {
    if (user) {
      removeSupporterMutation.mutate({
        id: requestId,
        studentId: user.id,
      })
    }
  }

  const isSupporter = (supporterIds: number[]) => {
    return user ? supporterIds.includes(user.id) : false
  }

  const isProcessing = addSupporterMutation.isPending || removeSupporterMutation.isPending

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Error al cargar solicitudes. Por favor, intenta de nuevo.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Solicitudes de Grupo
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Apoya solicitudes de nuevos grupos o crea la tuya
          </p>
        </div>
        <Link
          to="/group-requests/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Nueva solicitud
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Mostrar:</span>
            <select
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filters.status ?? ''}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  status: e.target.value as 'PENDING' | '' || undefined,
                  page: 0,
                }))
              }
            >
              <option value="PENDING">Pendientes</option>
              <option value="">Todas</option>
            </select>
          </div>
          <div className="ml-auto text-sm text-gray-500">
            {data ? (
              <>
                {data.content.length} de {data.totalElements} solicitudes
              </>
            ) : (
              'Cargando...'
            )}
          </div>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <LoadingState />
      ) : data && data.content.length > 0 ? (
        <>
          <div className="space-y-4">
            {data.content.map((request) => {
              const userIsSupporter = isSupporter(request.supporterIds)
              const isOwnRequest = user?.id === request.requesterId

              return (
                <div
                  key={request.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          to={`/group-requests/${request.id}`}
                          className="text-base font-medium text-gray-900 hover:text-blue-600"
                        >
                          {GROUP_TYPE_LABELS[request.requestedGroupType] || request.requestedGroupType}
                        </Link>
                        <GroupRequestStatusBadge
                          status={request.status}
                          supportersNeeded={request.supportersNeeded}
                        />
                        {isOwnRequest && (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                            Tu solicitud
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Materia #{request.subjectId}
                      </p>
                      {request.justification && (
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                          {request.justification}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          <span className={request.hasMinimumSupporters ? 'text-green-600 font-medium' : ''}>
                            {request.supporterCount} / 8 apoyos
                          </span>
                        </span>
                        <span>Creada: {formatDate(request.createdAt)}</span>
                        {request.expiresAt && (
                          <span>Expira: {formatDate(request.expiresAt)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {request.isPending && !isOwnRequest && (
                        userIsSupporter ? (
                          <button
                            onClick={() => handleRemoveSupport(request.id)}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <Minus className="h-4 w-4" />
                            Quitar apoyo
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSupport(request.id)}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                          >
                            <Plus className="h-4 w-4" />
                            Apoyar
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <div className="text-sm text-gray-500">
                Pagina {(data.page ?? 0) + 1} de {data.totalPages}
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
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">No hay solicitudes de grupo</p>
          <Link
            to="/group-requests/new"
            className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800"
          >
            Crear una nueva solicitud
          </Link>
        </div>
      )}
    </div>
  )
}
