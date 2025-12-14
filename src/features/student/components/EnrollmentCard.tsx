import { Link } from 'react-router-dom'
import type { EnrollmentSummary } from '../types/student.types'
import { cn } from '@/shared/utils/cn'
import { formatDate } from '@/shared/utils/formatters'

interface EnrollmentCardProps {
  enrollment: EnrollmentSummary
}

const groupTypeLabels: Record<string, string> = {
  REGULAR_Q1: 'Regular Q1',
  REGULAR_Q2: 'Regular Q2',
  INTENSIVE_Q1: 'Intensivo Q1',
  INTENSIVE_Q2: 'Intensivo Q2',
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
          <p className="text-sm text-gray-500">{enrollment.subjectCode}</p>
        </div>
        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
          {groupTypeLabels[enrollment.groupType] || enrollment.groupType}
        </span>
      </div>
      <div className="mt-3 space-y-1 text-sm text-gray-600">
        <p>Profesor: {enrollment.teacherName}</p>
        <p>Inscrito: {formatDate(enrollment.enrolledAt)}</p>
      </div>
    </Link>
  )
}
