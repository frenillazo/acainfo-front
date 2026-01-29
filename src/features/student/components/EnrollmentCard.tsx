import { Link } from 'react-router-dom'
import type { EnrollmentSummary } from '../types/student.types'
import { cn } from '@/shared/utils/cn'
import { formatDate } from '@/shared/utils/formatters'
import { GROUP_TYPE_LABELS } from '@/shared/types/api.types'

interface EnrollmentCardProps {
  enrollment: EnrollmentSummary
}

export function EnrollmentCard({ enrollment }: EnrollmentCardProps) {
  return (
    <Link
      to={`/enrollments/${enrollment.enrollmentId}`}
      className={cn(
        'block rounded-lg border border-gray-200 bg-white p-4 shadow-sm',
        'transition-shadow hover:shadow-md'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{enrollment.subjectName}</h3>
        </div>
        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
          {GROUP_TYPE_LABELS[enrollment.groupType as keyof typeof GROUP_TYPE_LABELS] || enrollment.groupType}
        </span>
      </div>
      <div className="mt-3 space-y-1 text-sm text-gray-600">
        <p>Profesor: {enrollment.teacherName}</p>
        <p>Inscrito: {formatDate(enrollment.enrolledAt)}</p>
      </div>
    </Link>
  )
}
