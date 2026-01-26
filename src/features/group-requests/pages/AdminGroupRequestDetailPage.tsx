import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  useGroupRequest,
  useApproveGroupRequest,
  useRejectGroupRequest,
} from '../hooks/useGroupRequests'
import { GroupRequestStatusBadge } from '../components/GroupRequestStatusBadge'
import { formatDateTime } from '@/shared/utils/formatters'
import { useAuthStore } from '@/features/auth/store/authStore'
import { Users, CheckCircle, XCircle } from 'lucide-react'

const groupTypeLabels: Record<string, string> = {
  REGULAR_Q1: 'Regular Q1',
  REGULAR_Q2: 'Regular Q2',
  INTENSIVE_Q1: 'Intensivo Q1',
  INTENSIVE_Q2: 'Intensivo Q2',
}

export function AdminGroupRequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const requestId = id ? parseInt(id, 10) : 0

  const { data: groupRequest, isLoading, error } = useGroupRequest(requestId)
  const approveMutation = useApproveGroupRequest()
  const rejectMutation = useRejectGroupRequest()

  const handleApprove = () => {
    const response = window.prompt('Mensaje de aprobacion (opcional):')
    if (response !== null && user) {
      approveMutation.mutate(
        {
          id: requestId,
          data: {
            adminId: user.id,
            adminResponse: response || undefined,
          },
        },
        {
          onSuccess: () => {
            navigate('/admin/group-requests')
          },
        }
      )
    }
  }

  const handleReject = () => {
    const response = window.prompt('Motivo del rechazo:')
    if (response !== null && user) {
      rejectMutation.mutate(
        {
          id: requestId,
          data: {
            adminId: user.id,
            adminResponse: response || undefined,
          },
        },
        {
          onSuccess: () => {
            navigate('/admin/group-requests')
          },
        }
      )
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    )
  }

  if (error || !groupRequest) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/group-requests"
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

  const isProcessing = approveMutation.isPending || rejectMutation.isPending

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        to="/admin/group-requests"
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
      >
        ← Volver a solicitudes
      </Link>

      {/* Header */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Solicitud #{groupRequest.id}
            </h1>
            <p className="mt-1 text-gray-500">
              Solicitud de grupo {groupTypeLabels[groupRequest.requestedGroupType]}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <GroupRequestStatusBadge
              status={groupRequest.status}
              supportersNeeded={groupRequest.supportersNeeded}
            />
            {groupRequest.isPending && (
              <>
                <button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4" />
                  {approveMutation.isPending ? 'Aprobando...' : 'Aprobar'}
                </button>
                <button
                  onClick={handleReject}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" />
                  {rejectMutation.isPending ? 'Rechazando...' : 'Rechazar'}
                </button>
              </>
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
              <dt className="text-sm font-medium text-gray-500">ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{groupRequest.id}</dd>
            </div>
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
                {groupTypeLabels[groupRequest.requestedGroupType] || groupRequest.requestedGroupType}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">ID Materia</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <Link
                  to={`/admin/subjects/${groupRequest.subjectId}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  #{groupRequest.subjectId}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">ID Solicitante</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <Link
                  to={`/admin/users/${groupRequest.requesterId}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  #{groupRequest.requesterId}
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
          {groupRequest.supporterIds && groupRequest.supporterIds.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {groupRequest.supporterIds.map((supporterId) => (
                <Link
                  key={supporterId}
                  to={`/admin/users/${supporterId}`}
                  className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
                >
                  Estudiante #{supporterId}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No hay apoyos todavia</p>
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
        {groupRequest.isProcessed && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Respuesta del Administrador
            </h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Procesado por</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  Admin #{groupRequest.processedByAdminId}
                </dd>
              </div>
              {groupRequest.adminResponse && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Mensaje</dt>
                  <dd className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                    {groupRequest.adminResponse}
                  </dd>
                </div>
              )}
              {groupRequest.processedAt && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Fecha de procesamiento</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDateTime(groupRequest.processedAt)}
                  </dd>
                </div>
              )}
              {groupRequest.createdGroupId && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Grupo creado</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <Link
                      to={`/admin/groups/${groupRequest.createdGroupId}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Ver grupo #{groupRequest.createdGroupId}
                    </Link>
                  </dd>
                </div>
              )}
            </dl>
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
            <div>
              <dt className="text-sm font-medium text-gray-500">Ultima actualizacion</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDateTime(groupRequest.updatedAt)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
