import type { SubjectStatus } from '../../types/admin.types'

interface SubjectStatusBadgeProps {
  status: SubjectStatus
}

const statusConfig: Record<SubjectStatus, { label: string; className: string }> = {
  ACTIVE: {
    label: 'Activa',
    className: 'bg-green-100 text-green-800',
  },
  INACTIVE: {
    label: 'Inactiva',
    className: 'bg-yellow-100 text-yellow-800',
  },
  ARCHIVED: {
    label: 'Archivada',
    className: 'bg-gray-100 text-gray-800',
  },
}

export function SubjectStatusBadge({ status }: SubjectStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}
