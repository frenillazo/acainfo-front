import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { EnrichedSchedule, Classroom } from '../../types/admin.types'
import { cn } from '@/shared/utils/cn'
import { WeekGrid } from '@/shared/components/schedule/WeekGrid'
import { dayOfWeekToIndex } from '@/shared/components/schedule/weekGridUtils'
import { CLASSROOM_LABELS } from '@/shared/config/domainConstants'

interface GlobalScheduleGridProps {
  schedules: EnrichedSchedule[]
  selectedClassroom: Classroom | null
}

// Paleta por asignatura: colores visualmente distinguibles
const SUBJECT_COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-fuchsia-500',
  'bg-lime-500',
  'bg-orange-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-pink-500',
]

function getSubjectColor(subjectId: number): string {
  return SUBJECT_COLORS[subjectId % SUBJECT_COLORS.length]
}

type GridSchedule = EnrichedSchedule & { dayIndex: number }

export function GlobalScheduleGrid({ schedules, selectedClassroom }: GlobalScheduleGridProps) {
  const items: GridSchedule[] = useMemo(
    () =>
      (selectedClassroom ? schedules.filter((s) => s.classroom === selectedClassroom) : schedules)
        .map((s) => ({ ...s, dayIndex: dayOfWeekToIndex(s.dayOfWeek) }))
        .filter((s) => s.dayIndex >= 0),
    [schedules, selectedClassroom]
  )

  // Leyenda: asignaturas presentes con su color asignado
  const subjectLegend = useMemo(() => {
    const subjectMap = new Map<number, { id: number; name: string; color: string }>()
    items.forEach((schedule) => {
      if (!subjectMap.has(schedule.subjectId)) {
        subjectMap.set(schedule.subjectId, {
          id: schedule.subjectId,
          name: schedule.subjectName,
          color: getSubjectColor(schedule.subjectId),
        })
      }
    })
    return Array.from(subjectMap.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [items])

  return (
    <WeekGrid
      items={items}
      classrooms={selectedClassroom ? [selectedClassroom] : undefined}
      legend={
        subjectLegend.length > 0
          ? subjectLegend.map((subject) => (
              <div key={subject.id} className="flex items-center gap-2">
                <div className={cn('h-4 w-4 rounded', subject.color)} />
                <span className="text-sm text-gray-600">{subject.name}</span>
              </div>
            ))
          : undefined
      }
      footerText="Haz clic en un bloque para ver los detalles del grupo."
      renderItem={(schedule) => (
        <Link
          to={`/admin/courses/${schedule.courseId}`}
          className={cn(
            'block h-full overflow-hidden rounded-md px-2 py-1 text-xs text-white transition-transform hover:z-10 hover:scale-[1.02]',
            getSubjectColor(schedule.subjectId)
          )}
          title={`${schedule.subjectName} - ${CLASSROOM_LABELS[schedule.classroom]}`}
        >
          <div className="flex h-full flex-col">
            <div className="truncate font-medium">{schedule.subjectName}</div>
            <div className="truncate text-[10px] opacity-90">
              {schedule.startTime} - {schedule.endTime}
            </div>
            <div className="mt-auto truncate text-[10px] opacity-80">{schedule.teacherName}</div>
          </div>
        </Link>
      )}
    />
  )
}
