import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Session } from '../../types/admin.types'
import { SessionContextMenu } from './SessionContextMenu'
import { cn } from '@/shared/utils/cn'
import { MoreHorizontal } from 'lucide-react'

interface AdminWeeklyScheduleGridProps {
  sessions: Session[]
  weekStart: Date
  onStart: (id: number) => void
  onComplete: (id: number) => void
  onCancel: (id: number) => void
  onPostpone: (id: number) => void
  onDelete: (id: number) => void
  onAttendance: (id: number) => void
}

const DAYS = [
  { key: 0, label: 'Lunes', shortLabel: 'Lun' },
  { key: 1, label: 'Martes', shortLabel: 'Mar' },
  { key: 2, label: 'Miércoles', shortLabel: 'Mié' },
  { key: 3, label: 'Jueves', shortLabel: 'Jue' },
  { key: 4, label: 'Viernes', shortLabel: 'Vie' },
  { key: 5, label: 'Sábado', shortLabel: 'Sáb' },
]

const STATUS_COLORS: Record<string, { bg: string; label: string }> = {
  SCHEDULED: { bg: 'bg-blue-500', label: 'Programada' },
  IN_PROGRESS: { bg: 'bg-yellow-500', label: 'En curso' },
  COMPLETED: { bg: 'bg-green-500', label: 'Completada' },
  CANCELLED: { bg: 'bg-red-400', label: 'Cancelada' },
  POSTPONED: { bg: 'bg-orange-400', label: 'Pospuesta' },
}

const HOURS = Array.from({ length: 15 }, (_, i) => i + 8)
const HOUR_HEIGHT = 60

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
  onContextMenu: (session: Session, position: { x: number; y: number }) => void
}

function SessionBlock({ session, onContextMenu }: SessionBlockProps) {
  const { top, height } = getSessionPosition(session)
  const statusConfig = STATUS_COLORS[session.status] ?? { bg: 'bg-gray-500', label: session.status }
  const isCancelled = session.isCancelled || session.isPostponed

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onContextMenu(session, { x: e.clientX, y: e.clientY })
  }

  return (
    <div
      className={cn(
        'absolute left-1 right-1 rounded-md px-2 py-1 text-white text-xs overflow-hidden group',
        statusConfig.bg,
        isCancelled && 'opacity-60'
      )}
      style={{
        top: `${top}px`,
        height: `${height}px`,
        minHeight: '30px',
        zIndex: 2,
      }}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between">
          <span className={cn('font-medium truncate', isCancelled && 'line-through')}>
            {session.subjectCode}
          </span>
          <button
            onClick={handleMenuClick}
            className="ml-1 shrink-0 rounded p-0.5 opacity-0 transition-opacity hover:bg-white/20 group-hover:opacity-100"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="truncate opacity-90 text-[10px]">
          {formatTime(session.startTime)} - {formatTime(session.endTime)}
        </div>
        {height >= 50 && session.teacherName && (
          <div className="mt-auto truncate opacity-80 text-[10px]">
            {session.teacherName}
          </div>
        )}
      </div>
    </div>
  )
}

export function AdminWeeklyScheduleGrid({
  sessions,
  weekStart,
  onStart,
  onComplete,
  onCancel,
  onPostpone,
  onDelete,
  onAttendance,
}: AdminWeeklyScheduleGridProps) {
  const navigate = useNavigate()
  const [contextMenu, setContextMenu] = useState<{
    session: Session
    position: { x: number; y: number }
  } | null>(null)

  const sessionsByDay = useMemo(() => {
    const grouped: Record<number, Session[]> = {}
    DAYS.forEach((day) => {
      grouped[day.key] = []
    })

    sessions.forEach((session) => {
      const sessionDate = new Date(session.date)
      let dayOfWeek = sessionDate.getDay() - 1
      if (dayOfWeek < 0) dayOfWeek = 6
      if (dayOfWeek <= 5) {
        grouped[dayOfWeek]?.push(session)
      }
    })

    return grouped
  }, [sessions])

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(sessions.map((s) => s.status))
    return Array.from(statuses).map((s) => ({
      key: s,
      ...(STATUS_COLORS[s] ?? { bg: 'bg-gray-500', label: s }),
    }))
  }, [sessions])

  const handleContextMenu = (session: Session, position: { x: number; y: number }) => {
    setContextMenu({ session, position })
  }

  return (
    <div className="overflow-x-auto">
      {/* Legend */}
      {uniqueStatuses.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-4">
          {uniqueStatuses.map((s) => (
            <div key={s.key} className="flex items-center gap-2">
              <div className={cn('h-4 w-4 rounded', s.bg)} />
              <span className="text-sm text-gray-600">{s.label}</span>
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
                className="border-b border-gray-100 pr-2 text-right text-xs text-gray-400"
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
                  <SessionBlock
                    key={session.id}
                    session={session}
                    onContextMenu={handleContextMenu}
                  />
                ))}
              </div>
            )
          })}
        </div>
      </div>

      <p className="mt-3 text-sm text-gray-500">
        Haz clic en &quot;...&quot; de una sesión para ver las acciones disponibles.
      </p>

      {/* Context Menu */}
      {contextMenu && (
        <SessionContextMenu
          session={contextMenu.session}
          anchorPosition={contextMenu.position}
          onClose={() => setContextMenu(null)}
          onStart={onStart}
          onComplete={onComplete}
          onCancel={onCancel}
          onPostpone={onPostpone}
          onDelete={onDelete}
          onAttendance={onAttendance}
          onViewDetail={(id) => navigate(`/admin/sessions/${id}`)}
        />
      )}
    </div>
  )
}
