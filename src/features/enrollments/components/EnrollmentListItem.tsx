import { Link } from 'react-router-dom'
import type { Enrollment } from '../types/enrollment.types'
import { EnrollmentStatusBadge } from './EnrollmentStatusBadge'
import { cn } from '@/shared/utils/cn'
import { formatDate } from '@/shared/utils/formatters'
import { GROUP_TYPE_LABELS, type GroupType } from '@/shared/types/api.types'

interface EnrollmentListItemProps {
  enrollment: Enrollment
}

export function EnrollmentListItem({ enrollment }: EnrollmentListItemProps) {
  const groupTypeLabel = GROUP_TYPE_LABELS[enrollment.groupType as GroupType] || enrollment.groupType

  return (
    <Link
      to={`/enrollments/${enrollment.id}`}
      className={cn(
        'block rounded-lg border border-gray-200 bg-white p-4',
        'transition-shadow hover:shadow-md'
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">
            {groupTypeLabel}
          </p>
          <p className="text-sm text-gray-500">
            Inscrito: {formatDate(enrollment.enrolledAt)}
          </p>
        </div>
        <EnrollmentStatusBadge
          status={enrollment.status}
          waitingPosition={enrollment.waitingListPosition}
        />
      </div>
    </Link>
  )
}
