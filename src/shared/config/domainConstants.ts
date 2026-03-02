/**
 * Centralized domain constants for labels used in forms and UI.
 * These are display labels for backend enum values.
 */

// ==================== Classroom ====================
export const CLASSROOM_LABELS: Record<string, string> = {
  AULA_PORTAL1: 'Aula Portal 1',
  AULA_PORTAL2: 'Aula Portal 2',
  AULA_VIRTUAL: 'Aula Virtual',
}

// ==================== Session Mode ====================
export const SESSION_MODE_LABELS: Record<string, string> = {
  IN_PERSON: 'Presencial',
  ONLINE: 'Online',
  DUAL: 'Dual',
}

// ==================== Months ====================
export const MONTH_LABELS: { value: number; label: string }[] = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
]
