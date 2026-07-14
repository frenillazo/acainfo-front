import { useState, useRef, useCallback } from 'react'
import type { Schedule, DayOfWeek, Classroom, CreateScheduleRequest } from '../../types/admin.types'
import { cn } from '@/shared/utils/cn'
import { WeekGrid } from '@/shared/components/schedule/WeekGrid'
import {
  GRID_CLASSROOMS,
  CLASSROOM_GRID_COLORS,
  dayOfWeekToIndex,
  indexToDayOfWeek,
  timeToMinutes,
  minutesToTime,
} from '@/shared/components/schedule/weekGridUtils'
import { CLASSROOM_LABELS } from '@/shared/config/domainConstants'

interface WeeklyScheduleGridProps {
  schedules: Schedule[]
  courseId: number
  onCreateSchedule: (data: CreateScheduleRequest) => void
  onUpdateSchedule: (
    id: number,
    data: { dayOfWeek?: DayOfWeek; startTime?: string; endTime?: string; classroom?: Classroom }
  ) => void
  onDeleteSchedule: (id: number) => void
  isCreating?: boolean
  isUpdating?: boolean
  readOnly?: boolean
}

interface CreateScheduleModalProps {
  onClose: () => void
  onSubmit: (data: { startTime: string; endTime: string; classroom: Classroom }) => void
  defaultStartTime: string
  defaultEndTime: string
  defaultClassroom: Classroom
  dayLabel: string
  isSubmitting?: boolean
}

// Montado solo mientras está abierto: el estado inicial se toma de las props
// de ESTA apertura (día/aula/hora de la celda clicada).
function CreateScheduleModal({
  onClose,
  onSubmit,
  defaultStartTime,
  defaultEndTime,
  defaultClassroom,
  dayLabel,
  isSubmitting,
}: CreateScheduleModalProps) {
  const [startTime, setStartTime] = useState(defaultStartTime)
  const [endTime, setEndTime] = useState(defaultEndTime)
  const [classroom, setClassroom] = useState<Classroom>(defaultClassroom)

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
              {GRID_CLASSROOMS.map((c) => (
                <option key={c} value={c}>
                  {CLASSROOM_LABELS[c]}
                </option>
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

type GridSchedule = Schedule & { dayIndex: number }

export function WeeklyScheduleGrid({
  schedules,
  courseId,
  onCreateSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  isCreating,
  readOnly,
}: WeeklyScheduleGridProps) {
  const [modalState, setModalState] = useState<{
    dayIndex: number
    classroom: Classroom
    start: string
    end: string
  } | null>(null)
  const draggedScheduleRef = useRef<Schedule | null>(null)

  const items: GridSchedule[] = schedules
    .map((s) => ({ ...s, dayIndex: dayOfWeekToIndex(s.dayOfWeek) }))
    .filter((s) => s.dayIndex >= 0)

  const handleCellClick = useCallback((dayIndex: number, classroom: Classroom, startTime: string) => {
    const endTime = minutesToTime(timeToMinutes(startTime) + 120) // 2h por defecto
    setModalState({ dayIndex, classroom, start: startTime, end: endTime })
  }, [])

  const handleCreateSubmit = useCallback(
    (data: { startTime: string; endTime: string; classroom: Classroom }) => {
      if (!modalState) return
      onCreateSchedule({
        courseId,
        dayOfWeek: indexToDayOfWeek(modalState.dayIndex) as DayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        classroom: data.classroom,
      })
      setModalState(null)
    },
    [courseId, modalState, onCreateSchedule]
  )

  const handleCellDrop = useCallback(
    (dayIndex: number, classroom: Classroom, startTime: string) => {
      const schedule = draggedScheduleRef.current
      draggedScheduleRef.current = null
      if (!schedule || readOnly) return

      const duration = timeToMinutes(schedule.endTime) - timeToMinutes(schedule.startTime)
      const dayOfWeek = indexToDayOfWeek(dayIndex) as DayOfWeek

      if (
        dayOfWeek !== schedule.dayOfWeek ||
        startTime !== schedule.startTime ||
        classroom !== schedule.classroom
      ) {
        onUpdateSchedule(schedule.id, {
          dayOfWeek,
          startTime,
          endTime: minutesToTime(timeToMinutes(startTime) + duration),
          classroom,
        })
      }
    },
    [onUpdateSchedule, readOnly]
  )

  return (
    <>
      <WeekGrid
        items={items}
        legend={GRID_CLASSROOMS.map((c) => (
          <div key={c} className="flex items-center gap-2">
            <div className={cn('h-4 w-4 rounded', CLASSROOM_GRID_COLORS[c])} />
            <span className="text-sm text-gray-600">{CLASSROOM_LABELS[c]}</span>
          </div>
        ))}
        footerText={
          readOnly
            ? undefined
            : 'Haz clic en una celda para crear un horario en esa aula. Arrastra los bloques para moverlos de hora o de aula.'
        }
        onCellClick={readOnly ? undefined : handleCellClick}
        onCellDrop={readOnly ? undefined : handleCellDrop}
        renderItem={(schedule) => (
          <div
            draggable={!readOnly}
            onDragStart={(e) => {
              draggedScheduleRef.current = schedule
              e.dataTransfer.effectAllowed = 'move'
            }}
            className={cn(
              'h-full cursor-move overflow-hidden rounded-md px-2 py-1 text-xs text-white',
              CLASSROOM_GRID_COLORS[schedule.classroom],
              readOnly && 'cursor-default'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="truncate">
                <div className="font-medium">
                  {schedule.startTime} - {schedule.endTime}
                </div>
                <div className="truncate opacity-80">{schedule.classroomDisplayName}</div>
              </div>
              {!readOnly && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteSchedule(schedule.id)
                  }}
                  className="ml-1 flex-shrink-0 opacity-70 hover:opacity-100"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        )}
      />

      {modalState && (
        <CreateScheduleModal
          onClose={() => setModalState(null)}
          onSubmit={handleCreateSubmit}
          defaultStartTime={modalState.start}
          defaultEndTime={modalState.end}
          defaultClassroom={modalState.classroom}
          dayLabel={
            ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][modalState.dayIndex]
          }
          isSubmitting={isCreating}
        />
      )}
    </>
  )
}
