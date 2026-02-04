export type SessionStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED'
export type SessionType = 'REGULAR' | 'EXTRA' | 'SCHEDULING'
export type SessionMode = 'IN_PERSON' | 'ONLINE' | 'DUAL'
export type Classroom =
  | 'AULA_101'
  | 'AULA_102'
  | 'AULA_201'
  | 'AULA_202'
  | 'LAB_A'
  | 'LAB_B'
  | 'ONLINE_MEET'

export interface Session {
  id: number
  subjectId: number
  groupId: number
  scheduleId: number | null
  classroom: Classroom
  // Enriched data
  subjectName: string
  subjectCode: string
  groupName: string
  groupType: string
  teacherName: string
  // Date and time
  date: string
  startTime: string
  endTime: string
  postponedToDate: string | null
  // Status and type
  status: SessionStatus
  type: SessionType
  mode: SessionMode
  // Computed
  durationMinutes: number
  // Flags
  isScheduled: boolean
  isInProgress: boolean
  isCompleted: boolean
  isCancelled: boolean
  isPostponed: boolean
  isRegular: boolean
  isExtra: boolean
  isSchedulingType: boolean
  hasGroup: boolean
  hasSchedule: boolean
  // Metadata
  createdAt: string
  updatedAt: string
}

export interface SessionFilters {
  subjectId?: number
  groupId?: number
  scheduleId?: number
  type?: SessionType
  status?: SessionStatus
  mode?: SessionMode
  dateFrom?: string
  dateTo?: string
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: 'ASC' | 'DESC'
}

/**
 * Extended session type for student view that includes
 * information about whether this is the student's own session
 * or an alternative session from another group of the same subject.
 */
export interface StudentSession extends Session {
  /** True if this session belongs to a group the student is enrolled in */
  isOwnSession: boolean
  /** True if this is an alternative session from another group of the same subject */
  isAlternative: boolean
}
