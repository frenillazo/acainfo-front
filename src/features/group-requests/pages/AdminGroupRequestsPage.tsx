import { useState } from 'react'
import {
  useGroupRequests,
  useApproveGroupRequest,
  useRejectGroupRequest,
} from '../hooks/useGroupRequests'
import { GroupRequestTable } from '../components/GroupRequestTable'
import { PromptDialog } from '@/shared/components/common/PromptDialog'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { usePromptDialog } from '@/shared/hooks/usePromptDialog'
import type { GroupRequestStatus, GroupRequestFilters } from '../types/groupRequest.types'
import type { GroupType } from '@/shared/types/api.types'
import { useAuthStore } from '@/features/auth/store/authStore'

export function AdminGroupRequestsPage() {
  const { user } = useAuthStore()
  const [filters, setFilters] = useState<GroupRequestFilters>({
    page: 0,
    size: 10,
  })
  const [pendingAction, setPendingAction] = useState<{ type: 'approve' | 'reject'; id: number } | null>(null)

  const { data, isLoading, error } = useGroupRequests(filters)
  const approveMutation = useApproveGroupRequest()
  const rejectMutation = useRejectGroupRequest()
  const { dialogProps, prompt } = usePromptDialog()

  const handleStatusChange = (status: GroupRequestStatus | '') => {
    setFilters((prev) => ({
      ...prev,
      status: status || undefined,
      page: 0,
    }))
  }

  const handleGroupTypeChange = (groupType: GroupType | '') => {
    setFilters((prev) => ({
      ...prev,
      requestedGroupType: groupType || undefined,
      page: 0,
    }))
  }

  const handleSubjectIdChange = (subjectId: string) => {
    const id = subjectId ? parseInt(subjectId, 10) : undefined
    setFilters((prev) => ({ ...prev, subjectId: id, page: 0 }))
  }

  const handlePageChange = (page: number) => {
    if (!Number.isNaN(page) && page >= 0) {
      setFilters((prev) => ({ ...prev, page }))
    }
  }

  const handleApprove = async (id: number) => {
    setPendingAction({ type: 'approve', id })
    const response = await prompt({
      title: 'Aprobar solicitud',
      message: '¿Aprobar esta solicitud de grupo?',
      inputLabel: 'Mensaje de aprobacion (opcional)',
      inputPlaceholder: 'Ingresa un mensaje...',
      confirmLabel: 'Aprobar',
    })
    setPendingAction(null)
    if (response !== null && user) {
      approveMutation.mutate({
        id,
        data: {
          adminId: user.id,
          adminResponse: response || undefined,
        },
      })
    }
  }

  const handleReject = async (id: number) => {
    setPendingAction({ type: 'reject', id })
    const response = await prompt({
      title: 'Rechazar solicitud',
      message: '¿Rechazar esta solicitud de grupo?',
      inputLabel: 'Motivo del rechazo',
      inputPlaceholder: 'Ingresa el motivo...',
      confirmLabel: 'Rechazar',
    })
    setPendingAction(null)
    if (response !== null && user) {
      rejectMutation.mutate({
        id,
        data: {
          adminId: user.id,
          adminResponse: response || undefined,
        },
      })
    }
  }

  if (error) {
    return <ErrorState error={error} title="Error al cargar solicitudes" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Solicitudes de Grupo
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestiona las solicitudes de nuevos grupos de los estudiantes
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Subject ID filter */}
          <div>
            <label
              htmlFor="subjectId"
              className="block text-sm font-medium text-gray-700"
            >
              ID Materia
            </label>
            <input
              type="number"
              id="subjectId"
              placeholder="ID de la materia..."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filters.subjectId ?? ''}
              onChange={(e) => handleSubjectIdChange(e.target.value)}
            />
          </div>

          {/* Group Type filter */}
          <div>
            <label
              htmlFor="groupType"
              className="block text-sm font-medium text-gray-700"
            >
              Tipo de Grupo
            </label>
            <select
              id="groupType"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filters.requestedGroupType ?? ''}
              onChange={(e) => handleGroupTypeChange(e.target.value as GroupType | '')}
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
              onChange={(e) => handleStatusChange(e.target.value as GroupRequestStatus | '')}
            >
              <option value="">Todos</option>
              <option value="PENDING">Pendiente</option>
              <option value="APPROVED">Aprobada</option>
              <option value="REJECTED">Rechazada</option>
              <option value="EXPIRED">Expirada</option>
            </select>
          </div>

          {/* Results info */}
          <div className="flex items-end">
            <p className="text-sm text-gray-500">
              {data ? (
                <>
                  Mostrando {data.content.length} de {data.totalElements}{' '}
                  solicitudes
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
          <GroupRequestTable
            key={`page-${data.page}`}
            groupRequests={data.content}
            onApprove={handleApprove}
            onReject={handleReject}
            isProcessing={approveMutation.isPending || rejectMutation.isPending}
          />

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
      ) : null}

      <PromptDialog {...dialogProps} isLoading={approveMutation.isPending || rejectMutation.isPending} />
    </div>
  )
}
