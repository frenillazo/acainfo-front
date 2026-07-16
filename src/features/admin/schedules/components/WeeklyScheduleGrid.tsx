import { useState, useRef, useCallback } from 'react'
import { Pencil, X } from 'lucide-react'
import type { Schedule, DayOfWeek, Classroom, CreateScheduleRequest } from '../../types/admin.types'
import { cn } from '@/shared/utils/cn'
import { Alert } from '@/shared/components/ui/Alert'
import { Button } from '@/shared/components/ui/Button'
import { Modal, ModalFooter } from '@/shared/components/ui/Modal'
import { FormFieldControlled } from '@/shared/components/form/FormFieldControlled'
import { FormSelectControlled } from '@/shared/components/form/FormSelectControlled'
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

const DAY_LABELS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

interface ScheduleFormValues {
  dayIndex: number
  startTime: string
  endTime: string
  classroom: Classroom
}

interface ScheduleFormModalProps {
  mode: 'create' | 'edit'
  initial: ScheduleFormValues
  onClose: () => void
  onSubmit: (data: ScheduleFormValues) => void
  isSubmitting?: boolean
}

/**
 * Crear y editar un horario por formulario. Antes solo existía el modal de
 * creación, que se abría clicando una celda, y mover un bloque de día/hora/aula
 * era exclusivamente drag&drop: sin ratón (teclado o pantalla táctil) el editor
 * era inoperable.
 *
 * Montado solo mientras está abierto: el estado inicial sale de las props de
 * ESTA apertura.
 */
function ScheduleFormModal({
  mode,
  initial,
  onClose,
  onSubmit,
  isSubmitting,
}: ScheduleFormModalProps) {
  const [dayIndex, setDayIndex] = useState(initial.dayIndex)
  const [startTime, setStartTime] = useState(initial.startTime)
  const [endTime, setEndTime] = useState(initial.endTime)
  const [classroom, setClassroom] = useState<Classroom>(initial.classroom)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Nadie validaba esto: el back lo rechazaba y el aviso aparecía al fondo
    // de la página, con el modal ya cerrado y las horas perdidas.
    if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
      setError('La hora de fin debe ser posterior a la de inicio.')
      return
    }
    setError(null)
    onSubmit({ dayIndex, startTime, endTime, classroom })
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={mode === 'create' ? 'Nuevo horario' : 'Editar horario'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormSelectControlled
          label="Día"
          name="schedule-day"
          value={String(dayIndex)}
          onChange={(value) => setDayIndex(Number(value))}
          options={DAY_LABELS.map((label, index) => ({ value: String(index), label }))}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormFieldControlled
            label="Hora inicio"
            name="schedule-start"
            type="time"
            value={startTime}
            onChange={setStartTime}
            required
          />
          <FormFieldControlled
            label="Hora fin"
            name="schedule-end"
            type="time"
            value={endTime}
            onChange={setEndTime}
            required
          />
        </div>

        <FormSelectControlled
          label="Aula"
          name="schedule-classroom"
          value={classroom}
          onChange={(value) => setClassroom(value as Classroom)}
          options={GRID_CLASSROOMS.map((c) => ({ value: c, label: CLASSROOM_LABELS[c] }))}
        />

        {error && <Alert variant="error" message={error} />}

        <ModalFooter className="-mx-6 -mb-6 mt-6">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            loadingText="Guardando..."
          >
            {mode === 'create' ? 'Crear' : 'Guardar'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
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
  isUpdating,
  readOnly,
}: WeeklyScheduleGridProps) {
  // null = formulario cerrado; el modo distingue crear de editar.
  const [formState, setFormState] = useState<
    | { mode: 'create'; initial: ScheduleFormValues }
    | { mode: 'edit'; scheduleId: number; initial: ScheduleFormValues }
    | null
  >(null)
  const draggedScheduleRef = useRef<Schedule | null>(null)

  const items: GridSchedule[] = schedules
    .map((s) => ({ ...s, dayIndex: dayOfWeekToIndex(s.dayOfWeek) }))
    .filter((s) => s.dayIndex >= 0)

  const handleCellClick = useCallback((dayIndex: number, classroom: Classroom, startTime: string) => {
    const endTime = minutesToTime(timeToMinutes(startTime) + 120) // 2h por defecto
    setFormState({ mode: 'create', initial: { dayIndex, classroom, startTime, endTime } })
  }, [])

  const openCreateForm = useCallback(() => {
    setFormState({
      mode: 'create',
      initial: { dayIndex: 0, classroom: GRID_CLASSROOMS[0], startTime: '16:00', endTime: '18:00' },
    })
  }, [])

  const openEditForm = useCallback((schedule: GridSchedule) => {
    setFormState({
      mode: 'edit',
      scheduleId: schedule.id,
      initial: {
        dayIndex: schedule.dayIndex,
        classroom: schedule.classroom,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
      },
    })
  }, [])

  const handleFormSubmit = useCallback(
    (data: ScheduleFormValues) => {
      if (!formState) return
      const payload = {
        dayOfWeek: indexToDayOfWeek(data.dayIndex) as DayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        classroom: data.classroom,
      }
      if (formState.mode === 'create') {
        onCreateSchedule({ courseId, ...payload })
      } else {
        onUpdateSchedule(formState.scheduleId, payload)
      }
      setFormState(null)
    },
    [courseId, formState, onCreateSchedule, onUpdateSchedule]
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
      {!readOnly && (
        <div className="mb-3 flex justify-end">
          <Button variant="secondary" size="sm" onClick={openCreateForm}>
            Nuevo horario
          </Button>
        </div>
      )}

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
            : 'Haz clic en una celda para crear un horario en esa aula, o arrastra los bloques para moverlos. También puedes usar "Nuevo horario" y el lápiz de cada bloque.'
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
                <div className="ml-1 flex flex-shrink-0 items-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      openEditForm(schedule)
                    }}
                    aria-label={`Editar horario del ${DAY_LABELS[schedule.dayIndex]} a las ${schedule.startTime}`}
                    className="flex h-6 w-6 items-center justify-center rounded opacity-70 hover:bg-white/20 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <Pencil className="h-3 w-3" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteSchedule(schedule.id)
                    }}
                    aria-label={`Eliminar horario del ${DAY_LABELS[schedule.dayIndex]} a las ${schedule.startTime}`}
                    className="flex h-6 w-6 items-center justify-center rounded opacity-70 hover:bg-white/20 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      />

      {formState && (
        <ScheduleFormModal
          mode={formState.mode}
          initial={formState.initial}
          onClose={() => setFormState(null)}
          onSubmit={handleFormSubmit}
          isSubmitting={formState.mode === 'create' ? isCreating : isUpdating}
        />
      )}
    </>
  )
}
