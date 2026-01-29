import { useParams, Link } from 'react-router-dom'
import {
  useGroupRequest,
  useAddSupporter,
  useRemoveSupporter,
} from '../hooks/useGroupRequests'
import { GroupRequestStatusBadge } from '../components/GroupRequestStatusBadge'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { formatDateTime } from '@/shared/utils/formatters'
import { useAuthStore } from '@/features/auth/store/authStore'
import { Users, Plus, Minus } from 'lucide-react'
import { GROUP_TYPE_LABELS } from '@/shared/types/api.types'

export function GroupRequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const requestId = id ? parseInt(id, 10) : 0

  const { data: groupRequest, isLoading, error } = useGroupRequest(requestId)
  const addSupporterMutation = useAddSupporter()
  const removeSupporterMutation = useRemoveSupporter()

  const handleSupport = () => {
    if (user) {
      addSupporterMutation.mutate({
        id: requestId,
        data: { studentId: user.id },
      })
    }
  }

  const handleRemoveSupport = () => {
    if (user) {
      removeSupporterMutation.mutate({
        id: requestId,
        studentId: user.id,
      })
    }
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (error || !groupRequest) {
    return (
      <div className="space-y-4">
        <Link
          to="/group-requests"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          ← Volver a solicitudes
        </Link>
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          Error al cargar la solicitud. Por favor, intenta de nuevo.
        </div>
      </div>
    )
  }

  const userIsSupporter = user ? groupRequest.supporterIds.includes(user.id) : false
  const isOwnRequest = user?.id === groupRequest.requesterId
  const isProcessing = addSupporterMutation.isPending || removeSupporterMutation.isPending

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        to="/group-requests"
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
      >
        ← Volver a solicitudes
      </Link>

      {/* Header */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">
                Solicitud #{groupRequest.id}
              </h1>
              {isOwnRequest && (
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  Tu solicitud
                </span>
              )}
            </div>
            <p className="mt-1 text-gray-500">
              Grupo {GROUP_TYPE_LABELS[groupRequest.requestedGroupType]} para materia #{groupRequest.subjectId}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <GroupRequestStatusBadge
              status={groupRequest.status}
              supportersNeeded={groupRequest.supportersNeeded}
            />
            {groupRequest.isPending && !isOwnRequest && (
              userIsSupporter ? (
                <button
                  onClick={handleRemoveSupport}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  <Minus className="h-4 w-4" />
                  Quitar apoyo
                </button>
              ) : (
                <button
                  onClick={handleSupport}
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

      {/* Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Request Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Informacion de la Solicitud
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Estado</dt>
              <dd className="mt-1">
                <GroupRequestStatusBadge
                  status={groupRequest.status}
                  supportersNeeded={groupRequest.supportersNeeded}
                />
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Tipo de grupo solicitado</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {GROUP_TYPE_LABELS[groupRequest.requestedGroupType] || groupRequest.requestedGroupType}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Materia</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <Link
                  to={`/subjects/${groupRequest.subjectId}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Ver materia #{groupRequest.subjectId}
                </Link>
              </dd>
            </div>
          </dl>
        </div>

        {/* Supporters */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Apoyos
          </h2>
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-400" />
            <span className={`text-lg font-semibold ${groupRequest.hasMinimumSupporters ? 'text-green-600' : 'text-gray-900'}`}>
              {groupRequest.supporterCount} / 8
            </span>
            {groupRequest.hasMinimumSupporters ? (
              <span className="text-sm text-green-600">(minimo alcanzado)</span>
            ) : (
              <span className="text-sm text-gray-500">
                (faltan {groupRequest.supportersNeeded})
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className={`h-2 rounded-full transition-all ${
                  groupRequest.hasMinimumSupporters ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(100, (groupRequest.supporterCount / 8) * 100)}%` }}
              />
            </div>
          </div>

          {userIsSupporter && (
            <p className="text-sm text-blue-600">
              Ya estas apoyando esta solicitud
            </p>
          )}
        </div>

        {/* Justification */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Justificacion
          </h2>
          {groupRequest.justification ? (
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {groupRequest.justification}
            </p>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No se proporciono justificacion
            </p>
          )}
        </div>

        {/* Admin Response (if processed) */}
        {groupRequest.isProcessed && groupRequest.adminResponse && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Respuesta del Administrador
            </h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {groupRequest.adminResponse}
            </p>
            {groupRequest.processedAt && (
              <p className="mt-2 text-xs text-gray-500">
                Procesada: {formatDateTime(groupRequest.processedAt)}
              </p>
            )}
          </div>
        )}

        {/* Dates */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Fechas</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Creacion</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDateTime(groupRequest.createdAt)}
              </dd>
            </div>
            {groupRequest.expiresAt && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Expiracion</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDateTime(groupRequest.expiresAt)}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  )
}
