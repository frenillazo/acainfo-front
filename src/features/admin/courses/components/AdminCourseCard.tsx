import { Link } from 'react-router-dom'
import type { Course } from '../../types/admin.types'
import { CapacityBar } from './CapacityBar'
import { Card, ConfigBadge } from '@/shared/components/ui'
import { COURSE_STATUS_CONFIG } from '@/shared/config/badgeConfig'
import { Eye, XCircle, Trash2, CalendarRange } from 'lucide-react'

interface AdminCourseCardsProps {
  courses: Course[]
  onCancel?: (id: number) => void
  onDelete?: (id: number) => void
  isCancelling?: boolean
  isDeleting?: boolean
}

export function AdminCourseCards({
  courses,
  onCancel,
  onDelete,
  isCancelling,
  isDeleting,
}: AdminCourseCardsProps) {
  if (courses.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-500">No se encontraron cursos</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <AdminCourseCard
          key={course.id}
          course={course}
          onCancel={onCancel}
          onDelete={onDelete}
          isCancelling={isCancelling}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  )
}

function AdminCourseCard({
  course,
  onCancel,
  onDelete,
  isCancelling,
  isDeleting,
}: {
  course: Course
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
          <h3 className="truncate font-medium text-gray-900">{course.name}</h3>
          <p className="mt-0.5 text-xs text-gray-500">{course.subjectName}</p>
        </div>
        <ConfigBadge config={COURSE_STATUS_CONFIG} value={course.status} />
      </div>

      {/* Info: dates, teacher */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
          <CalendarRange className="h-3.5 w-3.5" />
          {course.startDate} → {course.endDate}
        </span>
        <span className="ml-auto text-xs text-gray-500">
          {course.teacherName ?? 'Sin profesor'}
        </span>
      </div>

      {/* Capacity bar */}
      <div className="mt-3">
        <CapacityBar current={course.currentEnrollmentCount} max={course.capacity} />
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-1 border-t border-gray-100 pt-3">
        <Link
          to={`/admin/courses/${course.id}`}
          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
        >
          <Eye className="h-3.5 w-3.5" />
          Ver
        </Link>
        {onCancel && course.status !== 'CANCELLED' && (
          <button
            onClick={() => onCancel(course.id)}
            disabled={isCancelling}
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-50 disabled:opacity-50"
          >
            <XCircle className="h-3.5 w-3.5" />
            Cancelar
          </button>
        )}
        {onDelete && course.currentEnrollmentCount === 0 && (
          <button
            onClick={() => onDelete(course.id)}
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
