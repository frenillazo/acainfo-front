import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'
import type { Classroom } from '@/shared/types/api.types'
import { CLASSROOM_LABELS } from '@/shared/config/domainConstants'
import {
  WEEK_DAYS,
  GRID_CLASSROOMS,
  GRID_HOURS,
  HOUR_HEIGHT,
  HALF_HOUR_HEIGHT,
  GRID_START_MINUTES,
  timeToMinutes,
  minutesToTime,
} from './weekGridUtils'
import type { WeekGridItem } from './weekGridUtils'

// ============================================================
// Rejilla semanal compartida (lunes-sábado, 8:00-22:00).
// ÚNICA fuente del layout de los grids semanales: cada día se divide
// SIEMPRE en sub-columnas por aula (Portal 1 | Portal 2 | Virtual),
// de modo que dos bloques simultáneos en aulas distintas nunca se tapan.
// Los grids concretos (horarios admin, sesiones alumno/admin) solo
// aportan el contenido de cada bloque y sus interacciones.
// ============================================================

export interface WeekGridProps<T extends WeekGridItem> {
  items: T[]
  /** Sub-columnas por día. Por defecto las tres aulas. */
  classrooms?: Classroom[]
  /** Si se pasa, la cabecera muestra la fecha de cada día y resalta hoy. */
  weekStart?: Date
  /** Leyenda renderizada encima de la rejilla. */
  legend?: ReactNode
  /** Texto de ayuda bajo la rejilla. */
  footerText?: string
  /** Contenido del bloque; el grid lo posiciona en su día/aula/franja. */
  renderItem: (item: T) => ReactNode
  /** Click en una celda vacía (día + aula + hora redondeada a 30 min). */
  onCellClick?: (dayIndex: number, classroom: Classroom, startTime: string) => void
  /** Drop de un drag HTML5 sobre una celda (mismas coordenadas que el click). */
  onCellDrop?: (dayIndex: number, classroom: Classroom, startTime: string) => void
}

/** Posición vertical de un item dentro de su sub-columna. */
function getItemPosition(item: WeekGridItem) {
  const startMinutes = timeToMinutes(item.startTime)
  const endMinutes = timeToMinutes(item.endTime)
  const top = ((startMinutes - GRID_START_MINUTES) / 60) * HOUR_HEIGHT
  const height = ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT
  return { top, height }
}

/** Hora (redondeada a 30 min) correspondiente a una coordenada Y de celda. */
function yToStartTime(e: React.MouseEvent | React.DragEvent, target: HTMLElement): string {
  const rect = target.getBoundingClientRect()
  const y = e.clientY - rect.top
  const minutes = Math.floor(y / HALF_HOUR_HEIGHT) * 30 + GRID_START_MINUTES
  return minutesToTime(Math.round(minutes / 30) * 30)
}

function getDateForDay(weekStart: Date, dayIndex: number): Date {
  const date = new Date(weekStart)
  date.setDate(date.getDate() + dayIndex)
  return date
}

export function WeekGrid<T extends WeekGridItem>({
  items,
  classrooms = GRID_CLASSROOMS,
  weekStart,
  legend,
  footerText,
  renderItem,
  onCellClick,
  onCellDrop,
}: WeekGridProps<T>) {
  const multiColumn = classrooms.length > 1

  const handleDragOver = onCellDrop
    ? (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
      }
    : undefined

  return (
    <div className="overflow-x-auto">
      {legend && <div className="mb-4 flex flex-wrap items-center gap-4">{legend}</div>}

      <div
        className={cn(
          'rounded-lg border border-gray-200 bg-white',
          multiColumn ? 'min-w-[1200px]' : 'min-w-[800px]'
        )}
      >
        {/* Cabecera */}
        <div
          className={cn(
            'grid border-b border-gray-200 bg-gray-50',
            multiColumn
              ? 'grid-cols-[60px_repeat(6,minmax(150px,1fr))]'
              : 'grid-cols-[60px_repeat(6,1fr)]'
          )}
        >
          <div className="p-2 text-center text-xs font-medium text-gray-500">Hora</div>
          {WEEK_DAYS.map((day, dayIndex) => {
            const dayDate = weekStart ? getDateForDay(weekStart, dayIndex) : null
            const isToday = dayDate ? new Date().toDateString() === dayDate.toDateString() : false
            return (
              <div
                key={day.label}
                className={cn('border-l border-gray-200 p-2 text-center', isToday && 'bg-blue-50')}
              >
                <div className={cn('font-medium', isToday ? 'text-blue-600' : 'text-gray-900')}>
                  {day.label}
                </div>
                <div className={cn('text-xs', isToday ? 'text-blue-500' : 'text-gray-500')}>
                  {dayDate
                    ? dayDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
                    : day.shortLabel}
                </div>
                {multiColumn && (
                  <div className="mt-1 flex justify-center gap-1 text-[10px] text-gray-500">
                    {classrooms.map((c, idx) => (
                      <span key={c}>
                        {idx > 0 && ' | '}
                        {CLASSROOM_LABELS[c].replace('Aula ', '')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Rejilla */}
        <div
          className={cn(
            'grid',
            multiColumn
              ? 'grid-cols-[60px_repeat(6,minmax(150px,1fr))]'
              : 'grid-cols-[60px_repeat(6,1fr)]'
          )}
        >
          {/* Columna de horas */}
          <div className="border-r border-gray-200">
            {GRID_HOURS.map((hour) => (
              <div
                key={hour}
                className="border-b border-gray-100 pr-2 text-right text-xs text-gray-500"
                style={{ height: `${HOUR_HEIGHT}px` }}
              >
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Columnas de día */}
          {WEEK_DAYS.map((day, dayIndex) => {
            const dayDate = weekStart ? getDateForDay(weekStart, dayIndex) : null
            const isToday = dayDate ? new Date().toDateString() === dayDate.toDateString() : false
            return (
              <div
                key={day.label}
                className={cn('relative border-l border-gray-200', isToday && 'bg-blue-50/30')}
                style={{ height: `${GRID_HOURS.length * HOUR_HEIGHT}px` }}
              >
                {/* Líneas de hora y media hora */}
                {GRID_HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="absolute left-0 right-0 border-b border-gray-100"
                    style={{ top: `${(hour - 8) * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
                  >
                    <div
                      className="absolute left-0 right-0 border-b border-gray-50"
                      style={{ top: `${HALF_HOUR_HEIGHT}px` }}
                    />
                  </div>
                ))}

                {/* Split por aula: una sub-columna por aula, SIEMPRE */}
                <div
                  className="absolute inset-0 grid"
                  style={{ gridTemplateColumns: `repeat(${classrooms.length}, 1fr)` }}
                >
                  {classrooms.map((classroom, idx) => (
                    <div
                      key={classroom}
                      data-testid={`cell-${dayIndex}-${classroom}`}
                      className={cn(
                        'relative',
                        idx > 0 && 'border-l border-gray-100',
                        onCellClick && 'cursor-pointer'
                      )}
                      onClick={
                        onCellClick
                          ? (e) => onCellClick(dayIndex, classroom, yToStartTime(e, e.currentTarget))
                          : undefined
                      }
                      onDrop={
                        onCellDrop
                          ? (e) => {
                              e.preventDefault()
                              onCellDrop(dayIndex, classroom, yToStartTime(e, e.currentTarget))
                            }
                          : undefined
                      }
                      onDragOver={handleDragOver}
                    >
                      {items
                        .filter((item) => item.dayIndex === dayIndex && item.classroom === classroom)
                        .map((item) => {
                          const { top, height } = getItemPosition(item)
                          return (
                            <div
                              key={item.id}
                              className="absolute left-0.5 right-0.5"
                              style={{
                                top: `${top}px`,
                                height: `${height}px`,
                                minHeight: '30px',
                                zIndex: item.zIndex ?? 2,
                              }}
                            >
                              {renderItem(item)}
                            </div>
                          )
                        })}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {footerText && <p className="mt-3 text-sm text-gray-500">{footerText}</p>}
    </div>
  )
}
