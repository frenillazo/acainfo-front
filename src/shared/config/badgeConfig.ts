import { Monitor, RefreshCw, School } from 'lucide-react'
import type { BadgeVariant } from '@/shared/components/ui/Badge'

/**
 * REGLA DEL COLOR (16-jul-2026): el color solo codifica el eje SEMÁNTICO —
 * success = va bien / vivo · warning = pide atención · error = problema ·
 * default = neutro, terminado o informativo.
 *
 * Los ejes DESCRIPTIVOS (modalidad, aula, grado, rol, tipo) van en neutro: su
 * etiqueta ya dice lo que son. Antes tenían color propio y el resultado era que
 * el verde significaba a la vez "inscripción activa", "presencial", "estudiante",
 * "Aula Portal 2" y "curso abierto": el color no se podía aprender y había que
 * leer cada etiqueta, que es justo lo que un badge debería ahorrar.
 *
 * Corolario: la misma palabra, el mismo color. "Completada" era azul en una
 * inscripción y verde en una sesión; "Inactivo", gris en un usuario y amarillo
 * en una asignatura.
 */

// ==================== User ====================
export const USER_STATUS_CONFIG = {
  ACTIVE: { label: 'Activo', variant: 'success' as BadgeVariant },
  INACTIVE: { label: 'Inactivo', variant: 'default' as BadgeVariant },
  BLOCKED: { label: 'Bloqueado', variant: 'error' as BadgeVariant },
  PENDING_ACTIVATION: { label: 'Pendiente', variant: 'warning' as BadgeVariant },
} as const

// Descriptivo: qué es este usuario, no si va bien o mal.
export const ROLE_CONFIG = {
  ADMIN: { label: 'Admin', variant: 'default' as BadgeVariant },
  TEACHER: { label: 'Profesor', variant: 'default' as BadgeVariant },
  STUDENT: { label: 'Estudiante', variant: 'default' as BadgeVariant },
} as const

// ==================== Enrollment ====================
export const ENROLLMENT_STATUS_CONFIG = {
  ACTIVE: { label: 'Activa', variant: 'success' as BadgeVariant },
  WAITING_LIST: { label: 'Lista de espera', variant: 'warning' as BadgeVariant },
  WITHDRAWN: { label: 'Dada de baja', variant: 'default' as BadgeVariant },
  COMPLETED: { label: 'Completada', variant: 'default' as BadgeVariant },
  PENDING_APPROVAL: { label: 'Pendiente de aprobación', variant: 'warning' as BadgeVariant },
  REJECTED: { label: 'Rechazada', variant: 'error' as BadgeVariant },
  EXPIRED: { label: 'Caducada', variant: 'default' as BadgeVariant },
} as const

// ==================== Session ====================
export const SESSION_STATUS_CONFIG = {
  SCHEDULED: { label: 'Programada', variant: 'info' as BadgeVariant },
  IN_PROGRESS: { label: 'En curso', variant: 'warning' as BadgeVariant },
  COMPLETED: { label: 'Completada', variant: 'default' as BadgeVariant },
  CANCELLED: { label: 'Cancelada', variant: 'error' as BadgeVariant },
  POSTPONED: { label: 'Pospuesta', variant: 'orange' as BadgeVariant },
} as const

// Descriptivo.
export const SESSION_TYPE_CONFIG = {
  REGULAR: { label: 'Regular', variant: 'default' as BadgeVariant },
  EXTRA: { label: 'Extra', variant: 'default' as BadgeVariant },
} as const

// Descriptivo: el icono distingue de un vistazo, no el color.
export const SESSION_MODE_CONFIG = {
  IN_PERSON: { label: 'Presencial', variant: 'default' as BadgeVariant, icon: School },
  ONLINE: { label: 'Online', variant: 'default' as BadgeVariant, icon: Monitor },
  DUAL: { label: 'Dual', variant: 'default' as BadgeVariant, icon: RefreshCw },
} as const

// ==================== Course ====================
export const COURSE_STATUS_CONFIG = {
  OPEN: { label: 'Abierto', variant: 'success' as BadgeVariant },
  CLOSED: { label: 'Cerrado', variant: 'warning' as BadgeVariant },
  CANCELLED: { label: 'Cancelado', variant: 'error' as BadgeVariant },
} as const

// ==================== Subject ====================
export const SUBJECT_STATUS_CONFIG = {
  ACTIVE: { label: 'Activa', variant: 'success' as BadgeVariant },
  INACTIVE: { label: 'Inactiva', variant: 'default' as BadgeVariant },
  ARCHIVED: { label: 'Archivada', variant: 'default' as BadgeVariant },
} as const

// Descriptivo.
export const DEGREE_CONFIG = {
  INGENIERIA_INFORMATICA: { label: 'Ing. Informática', variant: 'default' as BadgeVariant },
  INGENIERIA_INDUSTRIAL: { label: 'Ing. Industrial', variant: 'default' as BadgeVariant },
} as const

// ==================== Reservation ====================
export const RESERVATION_STATUS_CONFIG = {
  CONFIRMED: { label: 'Confirmada', variant: 'success' as BadgeVariant },
  CANCELLED: { label: 'Cancelada', variant: 'default' as BadgeVariant },
} as const

// Descriptivo.
export const RESERVATION_MODE_CONFIG = {
  IN_PERSON: { label: 'Presencial', variant: 'default' as BadgeVariant, icon: School },
  ONLINE: { label: 'Online', variant: 'default' as BadgeVariant, icon: Monitor },
} as const

// ==================== Classroom ====================
// Descriptivo: dónde es la clase. El grid ya distingue las aulas por columna.
export const CLASSROOM_CONFIG = {
  AULA_PORTAL1: { label: 'Aula Portal 1', variant: 'default' as BadgeVariant },
  AULA_PORTAL2: { label: 'Aula Portal 2', variant: 'default' as BadgeVariant },
  AULA_VIRTUAL: { label: 'Aula Virtual', variant: 'default' as BadgeVariant },
} as const
