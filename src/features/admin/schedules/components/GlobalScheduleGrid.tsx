import { Link } from 'react-router-dom'
import type { EnrichedSchedule, DayOfWeek, Classroom } from '../../types/admin.types'
import { cn } from '@/shared/utils/cn'

interface GlobalScheduleGridProps {
  schedules: EnrichedSchedule[]
  selectedClassroom: Classroom | null
}

const DAYS: { key: DayOfWeek; label: string; shortLabel: string }[] = [
  { key: 'MONDAY', label: 'Lunes', shortLabel: 'Lun' },
  { key: 'TUESDAY', label: 'Martes', shortLabel: 'Mar' },
  { key: 'WEDNESDAY', label: 'Miércoles', shortLabel: 'Mié' },
  { key: 'THURSDAY', label: 'Jueves', shortLabel: 'Jue' },
  { key: 'FRIDAY', label: 'Viernes', shortLabel: 'Vie' },
  { key: 'SATURDAY', label: 'Sábado', shortLabel: 'Sáb' },
]

const CLASSROOMS: { key: Classroom; label: string; color: string; bgColor: string }[] = [
  { key: 'AULA_PORTAL1', label: 'Aula Portal 1', color: 'bg-blue-500', bgColor: 'bg-blue-50' },
  { key: 'AULA_PORTAL2', label: 'Aula Portal 2', color: 'bg-green-500', bgColor: 'bg-green-50' },
  { key: 'AULA_VIRTUAL', label: 'Aula Virtual', color: 'bg-purple-500', bgColor: 'bg-purple-50' },
]

// Hours from 8:00 to 22:00
const HOURS = Array.from({ length: 15 }, (_, i) => i + 8)
const HOUR_HEIGHT = 60 // pixels per hour

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function getSchedulePosition(schedule: EnrichedSchedule) {
  const startMinutes = timeToMinutes(schedule.startTime)
  const endMinutes = timeToMinutes(schedule.endTime)
  const top = ((startMinutes - 8 * 60) / 60) * HOUR_HEIGHT
  const height = ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT
  return { top, height }
}

function getClassroomConfig(classroom: Classroom) {
  return CLASSROOMS.find(c => c.key === classroom) ?? CLASSROOMS[0]
}

interface ScheduleBlockProps {
  schedule: EnrichedSchedule
}

function ScheduleBlock({ schedule }: ScheduleBlockProps) {
  const { top, height } = getSchedulePosition(schedule)
  const classroomConfig = getClassroomConfig(schedule.classroom)

  return (
    <Link
      to={`/admin/groups/${schedule.groupId}`}
      className={cn(
        'absolute left-1 right-1 rounded-md px-2 py-1 text-white text-xs overflow-hidden transition-transform hover:scale-[1.02] hover:z-10',
        classroomConfig.color
      )}
      style={{ top: `${top}px`, height: `${height}px`, minHeight: '30px' }}
    >
      <div className="flex flex-col h-full">
        <div className="font-medium truncate">{schedule.subjectCode}</div>
        <div className="opacity-90 truncate text-[10px]">{schedule.startTime} - {schedule.endTime}</div>
        {height >= 50 && (
          <div className="opacity-80 truncate text-[10px] mt-auto">{schedule.teacherName}</div>
        )}
      </div>
    </Link>
  )
}

export function GlobalScheduleGrid({ schedules, selectedClassroom }: GlobalScheduleGridProps) {
  // Filter schedules by classroom if selected
  const filteredSchedules = selectedClassroom
    ? schedules.filter(s => s.classroom === selectedClassroom)
    : schedules

  // Group schedules by day and classroom
  const schedulesByDayAndClassroom = DAYS.reduce((acc, day) => {
    acc[day.key] = {
      AULA_PORTAL1: [],
      AULA_PORTAL2: [],
      AULA_VIRTUAL: [],
    }
    CLASSROOMS.forEach(classroom => {
      acc[day.key][classroom.key] = filteredSchedules.filter(
        s => s.dayOfWeek === day.key && s.classroom === classroom.key
      )
    })
    return acc
  }, {} as Record<DayOfWeek, Record<Classroom, EnrichedSchedule[]>>)

  // If a classroom is selected, show only that column per day
  // Otherwise, show all classrooms side by side
  const classroomsToShow = selectedClassroom
    ? CLASSROOMS.filter(c => c.key === selectedClassroom)
    : CLASSROOMS

  return (
    <div className="overflow-x-auto">
      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-4">
        {CLASSROOMS.map((c) => (
          <div key={c.key} className="flex items-center gap-2">
            <div className={cn('h-4 w-4 rounded', c.color)} />
            <span className="text-sm text-gray-600">{c.label}</span>
          </div>
        ))}
      </div>

      <div className={cn(
        'rounded-lg border border-gray-200 bg-white',
        selectedClassroom ? 'min-w-[800px]' : 'min-w-[1200px]'
      )}>
        {/* Header */}
        <div className={cn(
          'grid border-b border-gray-200 bg-gray-50',
          selectedClassroom
            ? 'grid-cols-[60px_repeat(6,1fr)]'
            : 'grid-cols-[60px_repeat(6,minmax(150px,1fr))]'
        )}>
          <div className="p-2 text-center text-xs font-medium text-gray-500">Hora</div>
          {DAYS.map((day) => (
            <div key={day.key} className="border-l border-gray-200 p-2 text-center">
              <div className="font-medium text-gray-900">{day.label}</div>
              {!selectedClassroom && classroomsToShow.length > 1 && (
                <div className="flex gap-1 mt-1 justify-center">
                  {classroomsToShow.map(c => (
                    <div
                      key={c.key}
                      className={cn('w-2 h-2 rounded-full', c.color)}
                      title={c.label}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className={cn(
          'grid',
          selectedClassroom
            ? 'grid-cols-[60px_repeat(6,1fr)]'
            : 'grid-cols-[60px_repeat(6,minmax(150px,1fr))]'
        )}>
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
          {DAYS.map((day) => (
            <div
              key={day.key}
              className="relative border-l border-gray-200"
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

              {/* Classroom columns within each day */}
              {!selectedClassroom && classroomsToShow.length > 1 ? (
                <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${classroomsToShow.length}, 1fr)` }}>
                  {classroomsToShow.map((classroom, idx) => (
                    <div
                      key={classroom.key}
                      className={cn(
                        'relative',
                        idx > 0 && 'border-l border-gray-100'
                      )}
                    >
                      {schedulesByDayAndClassroom[day.key][classroom.key]?.map((schedule) => (
                        <ScheduleBlock key={schedule.id} schedule={schedule} />
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {classroomsToShow.map((classroom) => (
                    schedulesByDayAndClassroom[day.key][classroom.key]?.map((schedule) => (
                      <ScheduleBlock key={schedule.id} schedule={schedule} />
                    ))
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <p className="mt-3 text-sm text-gray-500">
        Haz clic en un bloque para ver los detalles del grupo.
      </p>
    </div>
  )
}
