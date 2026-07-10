import type { BadgeVariant } from '@/shared/components/ui/Badge'

// ==================== User ====================
export const USER_STATUS_CONFIG = {
  ACTIVE: { label: 'Activo', variant: 'success' as BadgeVariant },
  INACTIVE: { label: 'Inactivo', variant: 'default' as BadgeVariant },
  BLOCKED: { label: 'Bloqueado', variant: 'error' as BadgeVariant },
  PENDING_ACTIVATION: { label: 'Pendiente', variant: 'warning' as BadgeVariant },
} as const

export const ROLE_CONFIG = {
  ADMIN: { label: 'Admin', variant: 'purple' as BadgeVariant },
  TEACHER: { label: 'Profesor', variant: 'info' as BadgeVariant },
  STUDENT: { label: 'Estudiante', variant: 'success' as BadgeVariant },
} as const

// ==================== Enrollment ====================
export const ENROLLMENT_STATUS_CONFIG = {
  ACTIVE: { label: 'Activa', variant: 'success' as BadgeVariant },
  WAITING_LIST: { label: 'Lista de espera', variant: 'warning' as BadgeVariant },
  WITHDRAWN: { label: 'Retirado', variant: 'default' as BadgeVariant },
  COMPLETED: { label: 'Completada', variant: 'info' as BadgeVariant },
  PENDING_APPROVAL: { label: 'Pendiente de aprobación', variant: 'warning' as BadgeVariant },
  REJECTED: { label: 'Rechazada', variant: 'error' as BadgeVariant },
  EXPIRED: { label: 'Expirada', variant: 'default' as BadgeVariant },
} as const

// ==================== Session ====================
export const SESSION_STATUS_CONFIG = {
  SCHEDULED: { label: 'Programada', variant: 'info' as BadgeVariant },
  IN_PROGRESS: { label: 'En curso', variant: 'warning' as BadgeVariant },
  COMPLETED: { label: 'Completada', variant: 'success' as BadgeVariant },
  CANCELLED: { label: 'Cancelada', variant: 'error' as BadgeVariant },
  POSTPONED: { label: 'Pospuesta', variant: 'orange' as BadgeVariant },
} as const

export const SESSION_TYPE_CONFIG = {
  REGULAR: { label: 'Regular', variant: 'info' as BadgeVariant },
  EXTRA: { label: 'Extra', variant: 'purple' as BadgeVariant },
} as const

export const SESSION_MODE_CONFIG = {
  IN_PERSON: { label: 'Presencial', variant: 'success' as BadgeVariant, icon: '🏫' },
  ONLINE: { label: 'Online', variant: 'info' as BadgeVariant, icon: '💻' },
  DUAL: { label: 'Dual', variant: 'purple' as BadgeVariant, icon: '🔄' },
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
  INACTIVE: { label: 'Inactiva', variant: 'warning' as BadgeVariant },
  ARCHIVED: { label: 'Archivada', variant: 'default' as BadgeVariant },
} as const

export const DEGREE_CONFIG = {
  INGENIERIA_INFORMATICA: { label: 'Ing. Informatica', variant: 'info' as BadgeVariant },
  INGENIERIA_INDUSTRIAL: { label: 'Ing. Industrial', variant: 'purple' as BadgeVariant },
} as const

// ==================== Reservation ====================
export const RESERVATION_STATUS_CONFIG = {
  CONFIRMED: { label: 'Confirmada', variant: 'success' as BadgeVariant },
  CANCELLED: { label: 'Cancelada', variant: 'default' as BadgeVariant },
} as const

export const RESERVATION_MODE_CONFIG = {
  IN_PERSON: { label: 'Presencial', variant: 'success' as BadgeVariant },
  ONLINE: { label: 'Online', variant: 'info' as BadgeVariant },
} as const

// ==================== Classroom ====================
export const CLASSROOM_CONFIG = {
  AULA_PORTAL1: { label: 'Aula Portal 1', variant: 'info' as BadgeVariant },
  AULA_PORTAL2: { label: 'Aula Portal 2', variant: 'success' as BadgeVariant },
  AULA_VIRTUAL: { label: 'Aula Virtual', variant: 'purple' as BadgeVariant },
} as const
