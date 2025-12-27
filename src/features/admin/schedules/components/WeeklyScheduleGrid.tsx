import { useState, useRef, useCallback } from 'react'
import type { Schedule, DayOfWeek, Classroom, CreateScheduleRequest } from '../../types/admin.types'
import { cn } from '@/shared/utils/cn'

interface WeeklyScheduleGridProps {
  schedules: Schedule[]
  groupId: number
  onCreateSchedule: (data: CreateScheduleRequest) => void
  onUpdateSchedule: (id: number, data: { dayOfWeek?: DayOfWeek; startTime?: string; endTime?: string }) => void
  onDeleteSchedule: (id: number) => void
  isCreating?: boolean
  isUpdating?: boolean
  readOnly?: boolean
}

const DAYS: { key: DayOfWeek; label: string; shortLabel: string }[] = [
  { key: 'MONDAY', label: 'Lunes', shortLabel: 'Lun' },
  { key: 'TUESDAY', label: 'Martes', shortLabel: 'Mar' },
  { key: 'WEDNESDAY', label: 'Miércoles', shortLabel: 'Mié' },
  { key: 'THURSDAY', label: 'Jueves', shortLabel: 'Jue' },
  { key: 'FRIDAY', label: 'Viernes', shortLabel: 'Vie' },
  { key: 'SATURDAY', label: 'Sábado', shortLabel: 'Sáb' },
]

const CLASSROOMS: { key: Classroom; label: string; color: string }[] = [
  { key: 'AULA_PORTAL1', label: 'Aula Portal 1', color: 'bg-blue-500' },
  { key: 'AULA_PORTAL2', label: 'Aula Portal 2', color: 'bg-green-500' },
  { key: 'AULA_VIRTUAL', label: 'Aula Virtual', color: 'bg-purple-500' },
]

// Hours from 8:00 to 22:00
const HOURS = Array.from({ length: 15 }, (_, i) => i + 8)
const HOUR_HEIGHT = 60 // pixels per hour
const HALF_HOUR_HEIGHT = HOUR_HEIGHT / 2

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

function getSchedulePosition(schedule: Schedule) {
  const startMinutes = timeToMinutes(schedule.startTime)
  const endMinutes = timeToMinutes(schedule.endTime)
  const top = ((startMinutes - 8 * 60) / 60) * HOUR_HEIGHT
  const height = ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT
  return { top, height }
}

function getClassroomColor(classroom: Classroom): string {
  return CLASSROOMS.find(c => c.key === classroom)?.color ?? 'bg-gray-500'
}

interface ScheduleBlockProps {
  schedule: Schedule
  onDelete: () => void
  onDragStart: (e: React.DragEvent, schedule: Schedule) => void
  readOnly?: boolean
}

function ScheduleBlock({ schedule, onDelete, onDragStart, readOnly }: ScheduleBlockProps) {
  const { top, height } = getSchedulePosition(schedule)
  const colorClass = getClassroomColor(schedule.classroom)

  return (
    <div
      draggable={!readOnly}
      onDragStart={(e) => onDragStart(e, schedule)}
      className={cn(
        'absolute left-1 right-1 rounded-md px-2 py-1 text-white text-xs cursor-move overflow-hidden',
        colorClass,
        readOnly && 'cursor-default'
      )}
      style={{ top: `${top}px`, height: `${height}px`, minHeight: '30px' }}
    >
      <div className="flex items-start justify-between">
        <div className="truncate">
          <div className="font-medium">{schedule.startTime} - {schedule.endTime}</div>
          <div className="opacity-80 truncate">{schedule.classroomDisplayName}</div>
        </div>
        {!readOnly && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="ml-1 opacity-70 hover:opacity-100 flex-shrink-0"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

interface CreateScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { startTime: string; endTime: string; classroom: Classroom }) => void
  defaultStartTime: string
  defaultEndTime: string
  dayLabel: string
  isSubmitting?: boolean
}

function CreateScheduleModal({
  isOpen,
  onClose,
  onSubmit,
  defaultStartTime,
  defaultEndTime,
  dayLabel,
  isSubmitting,
}: CreateScheduleModalProps) {
  const [startTime, setStartTime] = useState(defaultStartTime)
  const [endTime, setEndTime] = useState(defaultEndTime)
  const [classroom, setClassroom] = useState<Classroom>('AULA_PORTAL1')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ startTime, endTime, classroom })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold">Nuevo horario - {dayLabel}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Hora inicio</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Hora fin</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Aula</label>
            <select
              value={classroom}
              onChange={(e) => setClassroom(e.target.value as Classroom)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              {CLASSROOMS.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function WeeklyScheduleGrid({
  schedules,
  groupId,
  onCreateSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  isCreating,
  isUpdating,
  readOnly,
}: WeeklyScheduleGridProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | null>(null)
  const [defaultTime, setDefaultTime] = useState({ start: '09:00', end: '11:00' })
  const draggedScheduleRef = useRef<Schedule | null>(null)

  const handleDayClick = useCallback((day: DayOfWeek, e: React.MouseEvent<HTMLDivElement>) => {
    if (readOnly) return

    const rect = e.currentTarget.getBoundingClientRect()
    const y = e.clientY - rect.top
    const minutes = Math.floor(y / HALF_HOUR_HEIGHT) * 30 + 8 * 60
    const roundedMinutes = Math.round(minutes / 30) * 30
    const startTime = minutesToTime(roundedMinutes)
    const endTime = minutesToTime(roundedMinutes + 120) // Default 2 hours

    setSelectedDay(day)
    setDefaultTime({ start: startTime, end: endTime })
    setModalOpen(true)
  }, [readOnly])

  const handleCreateSubmit = useCallback((data: { startTime: string; endTime: string; classroom: Classroom }) => {
    if (!selectedDay) return

    onCreateSchedule({
      groupId,
      dayOfWeek: selectedDay,
      startTime: data.startTime,
      endTime: data.endTime,
      classroom: data.classroom,
    })
    setModalOpen(false)
    setSelectedDay(null)
  }, [groupId, selectedDay, onCreateSchedule])

  const handleDragStart = useCallback((e: React.DragEvent, schedule: Schedule) => {
    draggedScheduleRef.current = schedule
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleDrop = useCallback((day: DayOfWeek, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const schedule = draggedScheduleRef.current
    if (!schedule || readOnly) return

    const rect = e.currentTarget.getBoundingClientRect()
    const y = e.clientY - rect.top
    const minutes = Math.floor(y / HALF_HOUR_HEIGHT) * 30 + 8 * 60
    const roundedMinutes = Math.round(minutes / 30) * 30
    const duration = timeToMinutes(schedule.endTime) - timeToMinutes(schedule.startTime)
    const newStartTime = minutesToTime(roundedMinutes)
    const newEndTime = minutesToTime(roundedMinutes + duration)

    if (day !== schedule.dayOfWeek || newStartTime !== schedule.startTime) {
      onUpdateSchedule(schedule.id, {
        dayOfWeek: day,
        startTime: newStartTime,
        endTime: newEndTime,
      })
    }

    draggedScheduleRef.current = null
  }, [onUpdateSchedule, readOnly])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  // Group schedules by day
  const schedulesByDay = DAYS.reduce((acc, day) => {
    acc[day.key] = schedules.filter(s => s.dayOfWeek === day.key)
    return acc
  }, {} as Record<DayOfWeek, Schedule[]>)

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

      <div className="min-w-[800px] rounded-lg border border-gray-200 bg-white">
        {/* Header */}
        <div className="grid grid-cols-[60px_repeat(6,1fr)] border-b border-gray-200 bg-gray-50">
          <div className="p-2 text-center text-xs font-medium text-gray-500">Hora</div>
          {DAYS.map((day) => (
            <div key={day.key} className="border-l border-gray-200 p-2 text-center">
              <div className="font-medium text-gray-900">{day.label}</div>
              <div className="text-xs text-gray-500">{day.shortLabel}</div>
            </div>
          ))}
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
          {DAYS.map((day) => (
            <div
              key={day.key}
              className="relative border-l border-gray-200 cursor-pointer"
              style={{ height: `${HOURS.length * HOUR_HEIGHT}px` }}
              onClick={(e) => handleDayClick(day.key, e)}
              onDrop={(e) => handleDrop(day.key, e)}
              onDragOver={handleDragOver}
            >
              {/* Hour lines */}
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="absolute left-0 right-0 border-b border-gray-100"
                  style={{ top: `${(hour - 8) * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
                >
                  {/* Half hour line */}
                  <div
                    className="absolute left-0 right-0 border-b border-gray-50"
                    style={{ top: `${HALF_HOUR_HEIGHT}px` }}
                  />
                </div>
              ))}

              {/* Schedule blocks */}
              {schedulesByDay[day.key]?.map((schedule) => (
                <ScheduleBlock
                  key={schedule.id}
                  schedule={schedule}
                  onDelete={() => onDeleteSchedule(schedule.id)}
                  onDragStart={handleDragStart}
                  readOnly={readOnly}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      {!readOnly && (
        <p className="mt-3 text-sm text-gray-500">
          Haz clic en cualquier celda para crear un nuevo horario. Arrastra los bloques para moverlos.
        </p>
      )}

      {/* Create Modal */}
      <CreateScheduleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateSubmit}
        defaultStartTime={defaultTime.start}
        defaultEndTime={defaultTime.end}
        dayLabel={DAYS.find(d => d.key === selectedDay)?.label ?? ''}
        isSubmitting={isCreating}
      />
    </div>
  )
}
