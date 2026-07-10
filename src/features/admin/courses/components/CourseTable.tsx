import { Link } from 'react-router-dom'
import type { Course } from '../../types/admin.types'
import {
  DataTable,
  TextCell,
  ActionsCell,
  ActionButton,
  ConfigBadge,
  type Column,
} from '@/shared/components/ui'
import { COURSE_STATUS_CONFIG } from '@/shared/config/badgeConfig'

interface CourseTableProps {
  courses: Course[]
  onCancel?: (id: number) => void
  onDelete?: (id: number) => void
  isCancelling?: boolean
  isDeleting?: boolean
}

export function CourseTable({
  courses,
  onCancel,
  onDelete,
  isCancelling,
  isDeleting,
}: CourseTableProps) {
  const columns: Column<Course>[] = [
    {
      key: 'name',
      header: 'Curso',
      render: (course) => (
        <TextCell primary={course.name} secondary={course.subjectName} />
      ),
    },
    {
      key: 'dates',
      header: 'Fechas',
      render: (course) => (
        <span className="text-sm text-gray-500">
          {course.startDate} → {course.endDate}
        </span>
      ),
    },
    {
      key: 'teacher',
      header: 'Profesor',
      render: (course) => (
        <span className="text-sm text-gray-500">
          {course.teacherName ?? 'Sin asignar'}
        </span>
      ),
    },
    {
      key: 'capacity',
      header: 'Capacidad',
      render: (course) => (
        <span className="text-sm text-gray-500">
          {course.capacity === null ? (
            <>
              {course.currentEnrollmentCount}
              <span className="ml-1 text-gray-400">(sin límite)</span>
            </>
          ) : (
            <>
              <span
                className={
                  course.availableSeats === 0 ? 'font-medium text-red-600' : ''
                }
              >
                {course.currentEnrollmentCount}/{course.capacity}
              </span>
              <span className="ml-1 text-gray-400">
                ({course.availableSeats} disponibles)
              </span>
            </>
          )}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (course) => <ConfigBadge config={COURSE_STATUS_CONFIG} value={course.status} />,
    },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'right',
      render: (course) => (
        <ActionsCell>
          <Link
            to={`/admin/courses/${course.id}`}
            className="font-medium text-blue-600 hover:text-blue-800"
          >
            Ver
          </Link>
          {onCancel && course.status !== 'CANCELLED' && (
            <ActionButton
              onClick={() => onCancel(course.id)}
              variant="warning"
              disabled={isCancelling}
            >
              Cancelar
            </ActionButton>
          )}
          {onDelete && course.currentEnrollmentCount === 0 && (
            <ActionButton
              onClick={() => onDelete(course.id)}
              variant="danger"
              disabled={isDeleting}
            >
              Eliminar
            </ActionButton>
          )}
        </ActionsCell>
      ),
    },
  ]

  return (
    <DataTable
      data={courses}
      columns={columns}
      keyExtractor={(course) => course.id}
      emptyMessage="No se encontraron cursos"
    />
  )
}
