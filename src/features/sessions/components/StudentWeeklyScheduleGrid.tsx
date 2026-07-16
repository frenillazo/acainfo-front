import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { Session, StudentSession } from '../types/session.types'
import { cn } from '@/shared/utils/cn'
import { getVisualSessionStatus } from '@/shared/utils/sessionStatus'
import { WeekGrid } from '@/shared/components/schedule/WeekGrid'
import {
  CLASSROOM_GRID_COLORS,
  dateToDayIndex,
} from '@/shared/components/schedule/weekGridUtils'
import { CLASSROOM_LABELS } from '@/shared/config/domainConstants'
import { formatTime } from '@/shared/utils/formatters'

interface StudentWeeklyScheduleGridProps {
  sessions: (Session | StudentSession)[]
  weekStart: Date
}

function isStudentSession(session: Session | StudentSession): session is StudentSession {
  return 'isAlternative' in session
}

type GridSession = (Session | StudentSession) & { dayIndex: number; zIndex: number }

export function StudentWeeklyScheduleGrid({ sessions, weekStart }: StudentWeeklyScheduleGridProps) {
  const items: GridSession[] = useMemo(
    () =>
      sessions
        .map((s) => ({
          ...s,
          dayIndex: dateToDayIndex(s.date),
          // Alternativas debajo para que las sesiones propias queden encima al solapar
          zIndex: isStudentSession(s) && s.isAlternative ? 1 : 2,
        }))
        .filter((s) => s.dayIndex <= 5),
    [sessions]
  )

  // Leyenda: aulas presentes + marcador de sesión alternativa si aplica
  const uniqueClassrooms = useMemo(() => {
    const classrooms = new Set(sessions.map((s) => s.classroom))
    return Array.from(classrooms)
  }, [sessions])

  const hasAlternatives = useMemo(
    () => sessions.some((s) => isStudentSession(s) && s.isAlternative),
    [sessions]
  )

  const legend =
    uniqueClassrooms.length > 0 || hasAlternatives ? (
      <>
        {uniqueClassrooms.map((c) => (
          <div key={c} className="flex items-center gap-2">
            <div className={cn('h-4 w-4 rounded', CLASSROOM_GRID_COLORS[c] ?? 'bg-gray-500')} />
            <span className="text-sm text-gray-600">{CLASSROOM_LABELS[c] ?? c}</span>
          </div>
        ))}
        {hasAlternatives && (
          <>
            <div className="h-4 w-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border-2 border-dashed border-purple-400 bg-purple-200 opacity-50" />
              <span className="text-sm text-gray-600">Sesión alternativa</span>
            </div>
          </>
        )}
      </>
    ) : undefined

  return (
    <WeekGrid
      items={items}
      // Solo las aulas donde el alumno tiene clase: `uniqueClassrooms` ya se
      // calculaba para la leyenda pero no se pasaba, así que el grid partía
      // SIEMPRE cada día en Portal 1 | Portal 2 | Virtual y comprimía sus
      // bloques a un tercio de columna en una rejilla medio vacía. Con un solo
      // curso —el caso normal— el día pasa a ser una columna entera.
      classrooms={uniqueClassrooms.length > 0 ? uniqueClassrooms : undefined}
      weekStart={weekStart}
      legend={legend}
      footerText="Haz clic en una sesión para ver más detalles."
      renderItem={(session) => {
        const visualStatus = getVisualSessionStatus(session)
        const isUpcoming = visualStatus === 'scheduled'
        const isInProgress = visualStatus === 'in_progress'
        const isCancelled = visualStatus === 'cancelled' || visualStatus === 'postponed'
        const isAlternative = isStudentSession(session) && session.isAlternative
        const classroomColor = CLASSROOM_GRID_COLORS[session.classroom] ?? 'bg-gray-500'

        return (
          <Link
            to={`/dashboard/sessions/${session.id}`}
            className={cn(
              'block h-full overflow-hidden rounded-md px-2 py-1 text-xs text-white transition-transform hover:z-10 hover:scale-[1.02]',
              isCancelled ? 'bg-gray-400 line-through opacity-60' : classroomColor,
              isInProgress && 'ring-2 ring-yellow-400 ring-offset-1',
              !isUpcoming && !isInProgress && !isCancelled && 'opacity-75',
              // Alternativas: desaturadas, borde discontinuo, menor opacidad
              isAlternative && [
                'opacity-50',
                'saturate-[0.4]',
                'border-2 border-dashed border-white/60',
                'hover:opacity-70',
              ]
            )}
            title={isAlternative ? `Sesión alternativa - ${session.subjectName}` : undefined}
          >
            <div className="flex h-full flex-col">
              <div className="truncate font-medium">
                {isAlternative && <span className="mr-1">◇</span>}
                {session.courseName || session.subjectName}
              </div>
              <div className="truncate text-[10px] opacity-90">
                {formatTime(session.startTime)} - {formatTime(session.endTime)}
              </div>
              <div className="mt-auto truncate text-[10px] opacity-80">
                {CLASSROOM_LABELS[session.classroom] ?? session.classroom}
              </div>
            </div>
          </Link>
        )
      }}
    />
  )
}
