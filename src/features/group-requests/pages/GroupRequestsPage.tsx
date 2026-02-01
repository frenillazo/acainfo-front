import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  useGroupRequests,
  useRemoveInterest,
} from '../hooks/useGroupRequests'
import { GroupRequestStatusBadge } from '../components/GroupRequestStatusBadge'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import type { GroupRequestFilters } from '../types/groupRequest.types'
import { useAuthStore } from '@/features/auth/store/authStore'
import { formatDate } from '@/shared/utils/formatters'
import { Heart, HeartOff, Calendar } from 'lucide-react'

export function GroupRequestsPage() {
  const { user } = useAuthStore()
  const [filters, setFilters] = useState<GroupRequestFilters>({
    page: 0,
    size: 10,
    status: 'PENDING',
    requesterId: user?.id,
  })

  const { data, isLoading, error } = useGroupRequests(filters)
  const removeInterestMutation = useRemoveInterest()

  const handlePageChange = (page: number) => {
    if (!Number.isNaN(page) && page >= 0) {
      setFilters((prev) => ({ ...prev, page }))
    }
  }

  const handleRemoveInterest = (subjectId: number) => {
    if (user) {
      removeInterestMutation.mutate({
        subjectId,
        studentId: user.id,
      })
    }
  }

  const isProcessing = removeInterestMutation.isPending

  if (error) {
    return <ErrorState error={error} title="Error al cargar intereses" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Asignaturas que me interesan
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Marca las asignaturas que te interesan para que los administradores puedan ver la demanda
          </p>
        </div>
        <Link
          to="/dashboard/group-requests/new"
          className="rounded-md bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
        >
          <Heart className="inline-block h-4 w-4 mr-1" />
          Marcar interes
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Mostrar:</span>
            <select
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              value={filters.status ?? ''}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  status: e.target.value as 'PENDING' | '' || undefined,
                  page: 0,
                }))
              }
            >
              <option value="PENDING">Activos</option>
              <option value="">Todos</option>
            </select>
          </div>
          <div className="ml-auto text-sm text-gray-500">
            {data ? (
              <>
                {data.content.length} de {data.totalElements} intereses
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
            {data.content.map((request) => (
              <div
                key={request.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-medium text-gray-900">
                        {request.subjectName || `Asignatura #${request.subjectId}`}
                      </span>
                      <GroupRequestStatusBadge
                        status={request.status}
                        supportersNeeded={0}
                      />
                      <span className="inline-flex items-center rounded-full bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-700">
                        <Heart className="mr-1 h-3 w-3 fill-current" />
                        Me interesa
                      </span>
                    </div>
                    {request.subjectDegree && (
                      <p className="mt-1 text-sm text-gray-500">
                        {request.subjectDegree}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Marcado: {formatDate(request.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {request.isPending && (
                      <button
                        onClick={() => handleRemoveInterest(request.subjectId)}
                        disabled={isProcessing}
                        className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <HeartOff className="h-4 w-4" />
                        Quitar interes
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
          <Heart className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2 text-gray-500">No tienes asignaturas marcadas como interes</p>
          <Link
            to="/dashboard/group-requests/new"
            className="mt-4 inline-block text-sm text-pink-600 hover:text-pink-800"
          >
            Marcar una asignatura como interes
          </Link>
        </div>
      )}
    </div>
  )
}
