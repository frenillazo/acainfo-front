import { Link } from 'react-router-dom'
import type { GroupRequest } from '../types/groupRequest.types'
import { GroupRequestStatusBadge } from './GroupRequestStatusBadge'
import { cn } from '@/shared/utils/cn'
import { formatDate } from '@/shared/utils/formatters'
import { Users } from 'lucide-react'

interface GroupRequestListItemProps {
  groupRequest: GroupRequest
  basePath?: string
}

const groupTypeLabels: Record<string, string> = {
  REGULAR_Q1: 'Regular Q1',
  REGULAR_Q2: 'Regular Q2',
  INTENSIVE_Q1: 'Intensivo Q1',
  INTENSIVE_Q2: 'Intensivo Q2',
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
              {groupTypeLabels[groupRequest.requestedGroupType] || groupRequest.requestedGroupType}
            </span>
            <GroupRequestStatusBadge
              status={groupRequest.status}
              supportersNeeded={groupRequest.supportersNeeded}
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Materia #{groupRequest.subjectId}
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
