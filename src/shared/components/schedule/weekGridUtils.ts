import type { Classroom } from '@/shared/types/api.types'

// Constantes y helpers de la rejilla semanal compartida (WeekGrid).
// En archivo aparte del componente para no romper fast-refresh.

export interface WeekGridItem {
  id: number | string
  /** 0 = lunes … 5 = sábado */
  dayIndex: number
  /** 'HH:mm' (se toleran segundos: se recorta) */
  startTime: string
  endTime: string
  classroom: Classroom
  /** Apilado dentro de la sub-columna (p.ej. sesiones alternativas debajo) */
  zIndex?: number
}

export const WEEK_DAYS = [
  { label: 'Lunes', shortLabel: 'Lun' },
  { label: 'Martes', shortLabel: 'Mar' },
  { label: 'Miércoles', shortLabel: 'Mié' },
  { label: 'Jueves', shortLabel: 'Jue' },
  { label: 'Viernes', shortLabel: 'Vie' },
  { label: 'Sábado', shortLabel: 'Sáb' },
] as const

export const GRID_CLASSROOMS: Classroom[] = ['AULA_PORTAL1', 'AULA_PORTAL2', 'AULA_VIRTUAL']

/** Colores canónicos por aula para bloques y leyendas de los grids. */
export const CLASSROOM_GRID_COLORS: Record<Classroom, string> = {
  AULA_PORTAL1: 'bg-blue-500',
  AULA_PORTAL2: 'bg-green-500',
  AULA_VIRTUAL: 'bg-purple-500',
}

// Horas visibles: 8:00 a 22:00
export const GRID_HOURS = Array.from({ length: 15 }, (_, i) => i + 8)
export const HOUR_HEIGHT = 60 // px por hora
export const HALF_HOUR_HEIGHT = HOUR_HEIGHT / 2
export const GRID_START_MINUTES = 8 * 60

const DAY_OF_WEEK_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

/** 'MONDAY' → 0 … 'SATURDAY' → 5 (−1 si no está en la rejilla). */
export function dayOfWeekToIndex(dayOfWeek: string): number {
  return DAY_OF_WEEK_ORDER.indexOf(dayOfWeek as (typeof DAY_OF_WEEK_ORDER)[number])
}

/** 0 → 'MONDAY' … 5 → 'SATURDAY'. */
export function indexToDayOfWeek(index: number): string {
  return DAY_OF_WEEK_ORDER[index]
}

/** Fecha ISO → índice de día de la rejilla (domingo queda fuera: 6). */
export function dateToDayIndex(date: string): number {
  const day = new Date(date).getDay() - 1 // domingo=0 → -1
  return day < 0 ? 6 : day
}

/** Lunes (00:00) de la semana a la que pertenece la fecha. */
export function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // domingo pertenece a la semana anterior
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

/** Sábado... último día mostrado: weekStart + 6 (domingo). */
export function getWeekEnd(weekStart: Date): Date {
  const d = new Date(weekStart)
  d.setDate(d.getDate() + 6)
  return d
}

/** "13 jul - 19 jul 2026" — rótulo del navegador de semanas. */
export function formatWeekRange(weekStart: Date): string {
  const weekEnd = getWeekEnd(weekStart)
  const startStr = weekStart.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  const endStr = weekEnd.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
  return `${startStr} - ${endStr}`
}
