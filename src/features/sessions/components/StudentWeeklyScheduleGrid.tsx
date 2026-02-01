import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { Session } from '../types/session.types'
import { cn } from '@/shared/utils/cn'

interface StudentWeeklyScheduleGridProps {
  sessions: Session[]
  weekStart: Date
}

const DAYS = [
  { key: 0, label: 'Lunes', shortLabel: 'Lun' },
  { key: 1, label: 'Martes', shortLabel: 'Mar' },
  { key: 2, label: 'Miércoles', shortLabel: 'Mié' },
  { key: 3, label: 'Jueves', shortLabel: 'Jue' },
  { key: 4, label: 'Viernes', shortLabel: 'Vie' },
  { key: 5, label: 'Sábado', shortLabel: 'Sáb' },
]

const CLASSROOMS: Record<string, { label: string; color: string }> = {
  AULA_PORTAL1: { label: 'Aula Portal 1', color: 'bg-blue-500' },
  AULA_PORTAL2: { label: 'Aula Portal 2', color: 'bg-green-500' },
  AULA_VIRTUAL: { label: 'Aula Virtual', color: 'bg-purple-500' },
  AULA_101: { label: 'Aula 101', color: 'bg-blue-500' },
  AULA_102: { label: 'Aula 102', color: 'bg-blue-400' },
  AULA_201: { label: 'Aula 201', color: 'bg-green-500' },
  AULA_202: { label: 'Aula 202', color: 'bg-green-400' },
  LAB_A: { label: 'Lab A', color: 'bg-orange-500' },
  LAB_B: { label: 'Lab B', color: 'bg-orange-400' },
  ONLINE_MEET: { label: 'Online', color: 'bg-purple-500' },
}

// Hours from 8:00 to 22:00
const HOURS = Array.from({ length: 15 }, (_, i) => i + 8)
const HOUR_HEIGHT = 60 // pixels per hour

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function getSessionPosition(session: Session) {
  const startMinutes = timeToMinutes(session.startTime)
  const endMinutes = timeToMinutes(session.endTime)
  const top = ((startMinutes - 8 * 60) / 60) * HOUR_HEIGHT
  const height = ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT
  return { top, height }
}

function getClassroomConfig(classroom: string) {
  return CLASSROOMS[classroom] ?? { label: classroom, color: 'bg-gray-500' }
}

function formatTime(time: string): string {
  return time.substring(0, 5)
}

function getDateForDay(weekStart: Date, dayIndex: number): Date {
  const date = new Date(weekStart)
  date.setDate(date.getDate() + dayIndex)
  return date
}

function formatDayDate(date: Date): string {
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

interface SessionBlockProps {
  session: Session
}

function SessionBlock({ session }: SessionBlockProps) {
  const { top, height } = getSessionPosition(session)
  const classroomConfig = getClassroomConfig(session.classroom)
  const isUpcoming = session.status === 'SCHEDULED'
  const isCancelled = session.status === 'CANCELLED' || session.status === 'POSTPONED'

  return (
    <Link
      to={`/dashboard/sessions/${session.id}`}
      className={cn(
        'absolute left-1 right-1 rounded-md px-2 py-1 text-white text-xs overflow-hidden transition-transform hover:scale-[1.02] hover:z-10',
        isCancelled ? 'bg-gray-400 line-through opacity-60' : classroomConfig.color,
        !isUpcoming && !isCancelled && 'opacity-75'
      )}
      style={{ top: `${top}px`, height: `${height}px`, minHeight: '30px' }}
    >
      <div className="flex flex-col h-full">
        <div className="font-medium truncate">{session.subjectCode || session.subjectName}</div>
        <div className="opacity-90 truncate text-[10px]">
          {formatTime(session.startTime)} - {formatTime(session.endTime)}
        </div>
        {height >= 50 && (
          <div className="opacity-80 truncate text-[10px] mt-auto">
            {classroomConfig.label}
          </div>
        )}
      </div>
    </Link>
  )
}

export function StudentWeeklyScheduleGrid({ sessions, weekStart }: StudentWeeklyScheduleGridProps) {
  // Group sessions by day of week
  const sessionsByDay = useMemo(() => {
    const grouped: Record<number, Session[]> = {}
    DAYS.forEach(day => {
      grouped[day.key] = []
    })

    sessions.forEach(session => {
      const sessionDate = new Date(session.date)
      // Get day of week (0 = Monday, 5 = Saturday in our grid)
      let dayOfWeek = sessionDate.getDay() - 1 // Convert Sunday=0 to Monday=0
      if (dayOfWeek < 0) dayOfWeek = 6 // Sunday becomes 6
      if (dayOfWeek <= 5) { // Only show Mon-Sat
        grouped[dayOfWeek]?.push(session)
      }
    })

    return grouped
  }, [sessions])

  // Get unique classrooms from sessions for legend
  const uniqueClassrooms = useMemo(() => {
    const classrooms = new Set(sessions.map(s => s.classroom))
    return Array.from(classrooms).map(c => ({
      key: c,
      ...getClassroomConfig(c)
    }))
  }, [sessions])

  return (
    <div className="overflow-x-auto">
      {/* Legend */}
      {uniqueClassrooms.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-4">
          {uniqueClassrooms.map((c) => (
            <div key={c.key} className="flex items-center gap-2">
              <div className={cn('h-4 w-4 rounded', c.color)} />
              <span className="text-sm text-gray-600">{c.label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="min-w-[800px] rounded-lg border border-gray-200 bg-white">
        {/* Header */}
        <div className="grid grid-cols-[60px_repeat(6,1fr)] border-b border-gray-200 bg-gray-50">
          <div className="p-2 text-center text-xs font-medium text-gray-500">Hora</div>
          {DAYS.map((day) => {
            const dayDate = getDateForDay(weekStart, day.key)
            const isToday = new Date().toDateString() === dayDate.toDateString()
            return (
              <div
                key={day.key}
                className={cn(
                  'border-l border-gray-200 p-2 text-center',
                  isToday && 'bg-blue-50'
                )}
              >
                <div className={cn('font-medium', isToday ? 'text-blue-600' : 'text-gray-900')}>
                  {day.label}
                </div>
                <div className={cn('text-xs', isToday ? 'text-blue-500' : 'text-gray-500')}>
                  {formatDayDate(dayDate)}
                </div>
              </div>
            )
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-[60px_repeat(6,1fr)]">
          {/* Hours column */}
          <div className="border-r border-gray-200">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="border-b border-gray-100 text-right pr-2 text-xs text-gray-400"
                style={{ height: `${HOUR_HEIGHT}px` }}
              >
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Day columns */}
          {DAYS.map((day) => {
            const dayDate = getDateForDay(weekStart, day.key)
            const isToday = new Date().toDateString() === dayDate.toDateString()
            return (
              <div
                key={day.key}
                className={cn(
                  'relative border-l border-gray-200',
                  isToday && 'bg-blue-50/30'
                )}
                style={{ height: `${HOURS.length * HOUR_HEIGHT}px` }}
              >
                {/* Hour lines */}
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="absolute left-0 right-0 border-b border-gray-100"
                    style={{ top: `${(hour - 8) * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
                  >
                    <div
                      className="absolute left-0 right-0 border-b border-gray-50"
                      style={{ top: `${HOUR_HEIGHT / 2}px` }}
                    />
                  </div>
                ))}

                {/* Session blocks */}
                {sessionsByDay[day.key]?.map((session) => (
                  <SessionBlock key={session.id} session={session} />
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* Instructions */}
      <p className="mt-3 text-sm text-gray-500">
        Haz clic en una sesión para ver más detalles.
      </p>
    </div>
  )
}
