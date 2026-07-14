import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Session } from '../../types/admin.types'
import { SessionContextMenu } from './SessionContextMenu'
import { cn } from '@/shared/utils/cn'
import { MoreHorizontal } from 'lucide-react'
import { WeekGrid } from '@/shared/components/schedule/WeekGrid'
import { dateToDayIndex } from '@/shared/components/schedule/weekGridUtils'

interface AdminWeeklyScheduleGridProps {
  sessions: Session[]
  weekStart: Date
  onStart: (id: number) => void
  onComplete: (id: number) => void
  onCancel: (id: number) => void
  onPostpone: (id: number) => void
  onDelete: (id: number) => void
}

const STATUS_COLORS: Record<string, { bg: string; label: string }> = {
  SCHEDULED: { bg: 'bg-blue-500', label: 'Programada' },
  IN_PROGRESS: { bg: 'bg-yellow-500', label: 'En curso' },
  COMPLETED: { bg: 'bg-green-500', label: 'Completada' },
  CANCELLED: { bg: 'bg-red-400', label: 'Cancelada' },
  POSTPONED: { bg: 'bg-orange-400', label: 'Pospuesta' },
}

function formatTime(time: string): string {
  return time.substring(0, 5)
}

type GridSession = Session & { dayIndex: number }

export function AdminWeeklyScheduleGrid({
  sessions,
  weekStart,
  onStart,
  onComplete,
  onCancel,
  onPostpone,
  onDelete,
}: AdminWeeklyScheduleGridProps) {
  const navigate = useNavigate()
  const [contextMenu, setContextMenu] = useState<{
    session: Session
    position: { x: number; y: number }
  } | null>(null)

  const items: GridSession[] = useMemo(
    () =>
      sessions
        .map((s) => ({ ...s, dayIndex: dateToDayIndex(s.date) }))
        .filter((s) => s.dayIndex <= 5),
    [sessions]
  )

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(sessions.map((s) => s.status))
    return Array.from(statuses).map((s) => ({
      key: s,
      ...(STATUS_COLORS[s] ?? { bg: 'bg-gray-500', label: s }),
    }))
  }, [sessions])

  return (
    <>
      <WeekGrid
        items={items}
        weekStart={weekStart}
        legend={
          uniqueStatuses.length > 0
            ? uniqueStatuses.map((s) => (
                <div key={s.key} className="flex items-center gap-2">
                  <div className={cn('h-4 w-4 rounded', s.bg)} />
                  <span className="text-sm text-gray-600">{s.label}</span>
                </div>
              ))
            : undefined
        }
        footerText='Haz clic en "..." de una sesión para ver las acciones disponibles.'
        renderItem={(session) => {
          const statusConfig = STATUS_COLORS[session.status] ?? {
            bg: 'bg-gray-500',
            label: session.status,
          }
          const isCancelled = session.isCancelled || session.isPostponed

          return (
            <div
              className={cn(
                'group h-full overflow-hidden rounded-md px-2 py-1 text-xs text-white',
                statusConfig.bg,
                isCancelled && 'opacity-60'
              )}
            >
              <div className="flex h-full flex-col">
                <div className="flex items-start justify-between">
                  <span className={cn('truncate font-medium', isCancelled && 'line-through')}>
                    {session.subjectCode}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setContextMenu({ session, position: { x: e.clientX, y: e.clientY } })
                    }}
                    className="ml-1 shrink-0 rounded p-0.5 opacity-0 transition-opacity hover:bg-white/20 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="truncate text-[10px] opacity-90">
                  {formatTime(session.startTime)} - {formatTime(session.endTime)}
                </div>
                {session.teacherName && (
                  <div className="mt-auto truncate text-[10px] opacity-80">
                    {session.teacherName}
                  </div>
                )}
              </div>
            </div>
          )
        }}
      />

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
          onViewDetail={(id) => navigate(`/admin/sessions/${id}`)}
        />
      )}
    </>
  )
}
