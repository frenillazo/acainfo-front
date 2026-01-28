import { Link } from 'react-router-dom'
import type { GroupRequest } from '../types/groupRequest.types'
import { GroupRequestStatusBadge } from './GroupRequestStatusBadge'
import { formatDate } from '@/shared/utils/formatters'
import { Users, Eye, CheckCircle, XCircle } from 'lucide-react'
import { GROUP_TYPE_LABELS } from '@/shared/types/api.types'

interface GroupRequestTableProps {
  groupRequests: GroupRequest[]
  onApprove?: (id: number) => void
  onReject?: (id: number) => void
  isProcessing?: boolean
  basePath?: string
}

export function GroupRequestTable({
  groupRequests,
  onApprove,
  onReject,
  isProcessing,
  basePath = '/admin/group-requests',
}: GroupRequestTableProps) {
  if (groupRequests.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">No hay solicitudes de grupo</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Materia
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Tipo Solicitado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Apoyos
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Creada
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Expira
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {groupRequests.map((request) => (
            <tr key={request.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                #{request.id}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                #{request.subjectId}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {GROUP_TYPE_LABELS[request.requestedGroupType] || request.requestedGroupType}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex items-center gap-1 text-sm">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className={request.hasMinimumSupporters ? 'text-green-600 font-medium' : 'text-gray-600'}>
                    {request.supporterCount} / 8
                  </span>
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <GroupRequestStatusBadge
                  status={request.status}
                  supportersNeeded={request.supportersNeeded}
                />
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {formatDate(request.createdAt)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {request.expiresAt ? formatDate(request.expiresAt) : '-'}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    to={`${basePath}/${request.id}`}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    title="Ver detalle"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  {request.isPending && onApprove && (
                    <button
                      onClick={() => onApprove(request.id)}
                      disabled={isProcessing}
                      className="rounded p-1 text-green-500 hover:bg-green-50 hover:text-green-700 disabled:opacity-50"
                      title="Aprobar"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                  {request.isPending && onReject && (
                    <button
                      onClick={() => onReject(request.id)}
                      disabled={isProcessing}
                      className="rounded p-1 text-red-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                      title="Rechazar"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
