import { Link } from 'react-router-dom'
import type { EnrollmentSummary } from '../types/student.types'
import { formatDate } from '@/shared/utils/formatters'
import { Card } from '@/shared/components/ui'

interface EnrollmentCardProps {
  enrollment: EnrollmentSummary
}

export function EnrollmentCard({ enrollment }: EnrollmentCardProps) {
  return (
    <Link to={`/dashboard/enrollments/${enrollment.enrollmentId}`}>
      <Card variant="interactive" padding="sm">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-gray-900">{enrollment.subjectName}</h3>
          </div>
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
            {enrollment.subjectCode}
          </span>
        </div>
        <div className="mt-3 space-y-1 text-sm text-gray-600">
          <p>Profesor: {enrollment.teacherName ?? 'Sin asignar'}</p>
          <p>Inscrito: {formatDate(enrollment.enrolledAt)}</p>
        </div>
      </Card>
    </Link>
  )
}
