import { Link } from 'react-router-dom'
import type { Subject } from '../types/subject.types'
import type { Enrollment } from '@/features/enrollments/types/enrollment.types'
import { Card } from '@/shared/components/ui'
import { Badge } from '@/shared/components/ui/Badge'
import { ENROLLMENT_STATUS_CONFIG } from '@/shared/config/badgeConfig'
import { BookOpen, Calendar } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface EnrolledSubjectCardProps {
  subject: Subject
  enrollment: Enrollment
}

const degreeLabels: Record<string, string> = {
  INGENIERIA_INFORMATICA: 'Ing. Informatica',
  INGENIERIA_INDUSTRIAL: 'Ing. Industrial',
}

const statusBorderColor: Record<string, string> = {
  ACTIVE: 'border-l-green-500',
  PENDING_APPROVAL: 'border-l-amber-500',
  WAITING_LIST: 'border-l-amber-500',
}

export function EnrolledSubjectCard({ subject, enrollment }: EnrolledSubjectCardProps) {
  const statusConfig = ENROLLMENT_STATUS_CONFIG[enrollment.status]
  const borderColor = statusBorderColor[enrollment.status] ?? 'border-l-gray-300'

  return (
    <Card
      padding="sm"
      className={cn('border-l-4', borderColor)}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium text-gray-900">{subject.name}</h3>
          <p className="mt-0.5 font-mono text-xs text-gray-500">{subject.code}</p>
        </div>
        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
      </div>

      <div className="mt-3 space-y-1.5 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <span>{degreeLabels[subject.degree] || subject.degree}</span>
          {subject.year && (
            <span className="text-xs text-gray-500">{subject.year}o Curso</span>
          )}
        </div>
        {enrollment.groupName && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span>{enrollment.groupName}</span>
            <span>&middot;</span>
            <span>{enrollment.teacherName}</span>
          </div>
        )}
        {enrollment.scheduleSummary && (
          <p className="text-xs text-gray-400">{enrollment.scheduleSummary}</p>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <Link
          to={`/dashboard/enrollments/${enrollment.id}`}
          className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
        >
          <BookOpen className="h-3 w-3" />
          Ver materiales
        </Link>
        <Link
          to="/dashboard/sessions"
          className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
        >
          <Calendar className="h-3 w-3" />
          Ver sesiones
        </Link>
      </div>
    </Card>
  )
}
