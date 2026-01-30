import { Link } from 'react-router-dom'
import type { GroupRequest } from '../types/groupRequest.types'
import { GroupRequestStatusBadge } from './GroupRequestStatusBadge'
import { cn } from '@/shared/utils/cn'
import { formatDate } from '@/shared/utils/formatters'
import { Users } from 'lucide-react'
import { GROUP_TYPE_LABELS } from '@/shared/types/api.types'

interface GroupRequestListItemProps {
  groupRequest: GroupRequest
  basePath?: string
}

export function GroupRequestListItem({ groupRequest, basePath = '/group-requests' }: GroupRequestListItemProps) {
  return (
    <Link
      to={`${basePath}/${groupRequest.id}`}
      className={cn(
        'block rounded-lg border border-gray-200 bg-white p-4',
        'transition-shadow hover:shadow-md'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              {GROUP_TYPE_LABELS[groupRequest.requestedGroupType] || groupRequest.requestedGroupType}
            </span>
            <GroupRequestStatusBadge
              status={groupRequest.status}
              supportersNeeded={groupRequest.supportersNeeded}
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {groupRequest.subjectName || 'Asignatura'}
          </p>
          {groupRequest.justification && (
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              {groupRequest.justification}
            </p>
          )}
          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {groupRequest.supporterCount} / 8 apoyos
            </span>
            <span>Creada: {formatDate(groupRequest.createdAt)}</span>
            {groupRequest.expiresAt && (
              <span>Expira: {formatDate(groupRequest.expiresAt)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
