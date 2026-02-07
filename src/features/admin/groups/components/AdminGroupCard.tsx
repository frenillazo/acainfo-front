import { Link } from 'react-router-dom'
import type { Group } from '../../types/admin.types'
import { GroupStatusBadge } from './GroupStatusBadge'
import { GroupTypeBadge } from './GroupTypeBadge'
import { CapacityBar } from './CapacityBar'
import { Card } from '@/shared/components/ui'
import { Eye, XCircle, Trash2 } from 'lucide-react'

interface AdminGroupCardsProps {
  groups: Group[]
  onCancel?: (id: number) => void
  onDelete?: (id: number) => void
  isCancelling?: boolean
  isDeleting?: boolean
}

export function AdminGroupCards({
  groups,
  onCancel,
  onDelete,
  isCancelling,
  isDeleting,
}: AdminGroupCardsProps) {
  if (groups.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-500">No se encontraron grupos</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <AdminGroupCard
          key={group.id}
          group={group}
          onCancel={onCancel}
          onDelete={onDelete}
          isCancelling={isCancelling}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  )
}

function AdminGroupCard({
  group,
  onCancel,
  onDelete,
  isCancelling,
  isDeleting,
}: {
  group: Group
  onCancel?: (id: number) => void
  onDelete?: (id: number) => void
  isCancelling?: boolean
  isDeleting?: boolean
}) {
  return (
    <Card padding="sm" variant="interactive">
      {/* Header: name + status */}
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium text-gray-900">{group.name}</h3>
          <p className="mt-0.5 text-xs text-gray-500">{group.subjectName}</p>
        </div>
        <GroupStatusBadge status={group.status} />
      </div>

      {/* Info: type, teacher */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <GroupTypeBadge type={group.type} />
        <span className="ml-auto text-xs text-gray-500">{group.teacherName}</span>
      </div>

      {/* Capacity bar */}
      <div className="mt-3">
        <CapacityBar current={group.currentEnrollmentCount} max={group.maxCapacity} />
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-1 border-t border-gray-100 pt-3">
        <Link
          to={`/admin/groups/${group.id}`}
          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
        >
          <Eye className="h-3.5 w-3.5" />
          Ver
        </Link>
        {onCancel && group.status !== 'CANCELLED' && (
          <button
            onClick={() => onCancel(group.id)}
            disabled={isCancelling}
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-50 disabled:opacity-50"
          >
            <XCircle className="h-3.5 w-3.5" />
            Cancelar
          </button>
        )}
        {onDelete && group.currentEnrollmentCount === 0 && (
          <button
            onClick={() => onDelete(group.id)}
            disabled={isDeleting}
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Eliminar
          </button>
        )}
      </div>
    </Card>
  )
}
