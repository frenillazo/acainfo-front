import type { Course, ScheduleSummary } from '../types/subject.types'
import { cn } from '@/shared/utils/cn'
import { formatDateShort } from '@/shared/utils/formatters'
import { DAY_OF_WEEK_SHORT_LABELS } from '@/shared/types/api.types'
import { Card } from '@/shared/components/ui'
import { Clock } from 'lucide-react'

function formatScheduleSummary(schedules: ScheduleSummary[]): string[] {
  if (!schedules || schedules.length === 0) {
    return ['Por determinar']
  }

  return schedules.map(schedule => {
    const dayLabel = DAY_OF_WEEK_SHORT_LABELS[schedule.dayOfWeek] || schedule.dayOfWeek
    return `${dayLabel} ${schedule.startTime} - ${schedule.endTime}`
  })
}

function formatDateRange(startDate: string, endDate: string): string {
  return `${formatDateShort(startDate)} — ${formatDateShort(endDate)}`
}

interface CourseCardProps {
  course: Course
  onEnroll?: (course: Course) => void
  isEnrolling?: boolean
  hasPendingRequest?: boolean
}

export function CourseCard({ course, onEnroll, isEnrolling, hasPendingRequest }: CourseCardProps) {
  const isFull = course.availableSeats !== null && course.availableSeats <= 0

  return (
    <Card
      padding="sm"
      variant={isFull ? 'warning' : 'default'}
      className={cn(!course.isOpen && 'opacity-60')}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{course.name}</h3>
          <span className="mt-1 inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
            {formatDateRange(course.startDate, course.endDate)}
          </span>
        </div>
        <span
          className={cn(
            'rounded-full px-2 py-1 text-xs font-medium',
            course.isOpen
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600'
          )}
        >
          {course.isOpen ? 'Abierto' : 'Cerrado'}
        </span>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
          <span className="text-gray-700">{course.teacherName ?? 'Profesor por determinar'}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            />
          </svg>
          <span className={cn('text-gray-700', isFull && 'text-orange-600 font-medium')}>
            {course.currentEnrollmentCount}
            {course.capacity !== null && ` / ${course.capacity}`} inscritos
            {isFull && ' (Completo)'}
          </span>
        </div>

        {course.availableSeats !== null && course.availableSeats > 0 && (
          <p className="text-sm text-green-600">
            {course.availableSeats} plaza{course.availableSeats !== 1 ? 's' : ''} disponible
            {course.availableSeats !== 1 ? 's' : ''}
          </p>
        )}

        <div className="flex items-start gap-2 text-sm">
          <svg
            className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-gray-600">
            {formatScheduleSummary(course.schedules).map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        </div>
      </div>

      {hasPendingRequest ? (
        <div className="mt-4 flex items-center justify-center gap-2 rounded-md bg-amber-50 border border-amber-200 px-4 py-2 text-sm font-medium text-amber-700">
          <Clock className="h-4 w-4" />
          Esperando respuesta de administración
        </div>
      ) : onEnroll && course.canEnroll ? (
        <button
          onClick={() => onEnroll(course)}
          disabled={isEnrolling || isFull}
          className={cn(
            'mt-4 w-full rounded-md px-4 py-2 text-sm font-medium transition-colors',
            isFull
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
          )}
        >
          {isEnrolling ? 'Inscribiendo...' : isFull ? 'Sin plazas' : 'Inscribirse'}
        </button>
      ) : !course.isOpen ? (
        <p className="mt-4 text-center text-sm text-gray-500">
          Inscripciones cerradas
        </p>
      ) : null}
    </Card>
  )
}
