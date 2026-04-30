import type { PageResponse } from '@/shared/types/api.types'

// Must match backend: ACTIVE, INACTIVE, BLOCKED, PENDING_ACTIVATION
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'PENDING_ACTIVATION'
export type RoleType = 'ADMIN' | 'TEACHER' | 'STUDENT'

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  fullName: string
  phoneNumber: string
  status: UserStatus
  degree: Degree | null
  roles: string[]
  createdAt: string
  updatedAt: string
}

export interface Teacher {
  id: number
  email: string
  firstName: string
  lastName: string
  fullName: string
  status: UserStatus
  createdAt: string
  updatedAt: string
}

export interface CreateTeacherRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface UpdateTeacherRequest {
  firstName: string
  lastName: string
}

export interface UserFilters {
  email?: string
  searchTerm?: string
  status?: UserStatus
  roleType?: RoleType
  degree?: Degree
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: 'ASC' | 'DESC'
}

export interface TeacherFilters {
  email?: string
  searchTerm?: string
  status?: UserStatus
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: 'ASC' | 'DESC'
}

// Group types
// NOTE: GroupType has been removed from the backend. The alias below stays for
// backwards-compatibility; prefer omitting it for new code.
export type GroupType = string
export type GroupStatus = 'OPEN' | 'CLOSED' | 'CANCELLED'

export interface Group {
  id: number
  name: string
  subjectId: number
  teacherId: number
  /** @deprecated Removed from backend. Always undefined in new responses. */
  type?: GroupType
  status: GroupStatus
  currentEnrollmentCount: number
  capacity: number | null
  availableSeats: number
  maxCapacity: number
  pricePerHour: number
  /** Inclusive — first day sessions can be generated. */
  startDate?: string // yyyy-MM-dd
  /** Inclusive — last day sessions can be generated. */
  endDate?: string // yyyy-MM-dd
  createdAt: string
  updatedAt: string
  // Enriched
  subjectName: string
  subjectCode: string
  teacherName: string
  // Flags
  isOpen: boolean
  canEnroll: boolean
  /** @deprecated Always false (intensives are now a separate entity). */
  isIntensive?: boolean
  /** @deprecated Always true. */
  isRegular?: boolean
}

export interface CreateGroupRequest {
  subjectId: number
  teacherId: number
  startDate: string // yyyy-MM-dd
  endDate: string // yyyy-MM-dd
  capacity?: number
  pricePerHour?: number
  /** @deprecated Removed from backend, ignored. */
  type?: GroupType
}

export interface UpdateGroupRequest {
  status?: GroupStatus
  capacity?: number
  pricePerHour?: number
  startDate?: string
  endDate?: string
}

export interface GroupFilters {
  subjectId?: number
  teacherId?: number
  status?: GroupStatus
  searchTerm?: string
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: 'ASC' | 'DESC'
  /** @deprecated Removed from backend, will be ignored if sent. */
  type?: GroupType
}

// Subject types
export type Degree = 'INGENIERIA_INFORMATICA' | 'INGENIERIA_INDUSTRIAL'
export type SubjectStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'

export interface Subject {
  id: number
  code: string
  name: string
  displayName: string
  degree: Degree
  year: number | null
  status: SubjectStatus
  currentGroupCount: number
  active: boolean
  archived: boolean
  canCreateGroup: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateSubjectRequest {
  code: string
  name: string
  degree: Degree
  year?: number
}

export interface UpdateSubjectRequest {
  name?: string
  year?: number
  status?: SubjectStatus
}

export interface SubjectFilters {
  code?: string
  searchTerm?: string
  degree?: Degree
  year?: number
  status?: SubjectStatus
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: 'ASC' | 'DESC'
}

// Schedule types
export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
export type Classroom = 'AULA_PORTAL1' | 'AULA_PORTAL2' | 'AULA_VIRTUAL'

export interface Schedule {
  id: number
  groupId: number
  dayOfWeek: DayOfWeek
  startTime: string // HH:mm format
  endTime: string // HH:mm format
  classroom: Classroom
  classroomDisplayName: string
  durationMinutes: number
  createdAt: string
  updatedAt: string
}

export interface CreateScheduleRequest {
  groupId: number
  dayOfWeek: DayOfWeek
  startTime: string // HH:mm format
  endTime: string // HH:mm format
  classroom: Classroom
}

export interface UpdateScheduleRequest {
  dayOfWeek?: DayOfWeek
  startTime?: string
  endTime?: string
  classroom?: Classroom
}

export interface ScheduleFilters {
  groupId?: number
  classroom?: Classroom
  dayOfWeek?: DayOfWeek
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: 'ASC' | 'DESC'
}

// Enriched schedule with group, subject, and teacher info
export interface EnrichedSchedule {
  // Schedule fields
  id: number
  groupId: number
  dayOfWeek: DayOfWeek
  startTime: string // HH:mm format
  endTime: string // HH:mm format
  classroom: Classroom
  classroomDisplayName: string
  durationMinutes: number
  createdAt: string
  updatedAt: string
  // Enriched data from Group
  /** @deprecated Removed from backend. */
  groupType?: GroupType
  groupStatus: GroupStatus
  pricePerHour: number
  // Enriched data from Subject
  subjectId: number
  subjectName: string
  subjectCode: string
  // Enriched data from Teacher
  teacherId: number
  teacherName: string
}

// Dashboard stats computed from API responses
export interface AdminDashboardStats {
  totalUsers: number
  totalStudents: number
  totalTeachers: number
  activeEnrollments: number
  pendingPayments: number
  totalSubjects: number
  totalGroups: number
}

// Session types
export type SessionStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED'
export type SessionType = 'REGULAR' | 'EXTRA' | 'SCHEDULING'
export type SessionMode = 'IN_PERSON' | 'ONLINE' | 'DUAL'

export interface Session {
  // Core fields
  id: number
  subjectId: number
  groupId: number | null
  scheduleId: number | null
  classroom: Classroom
  date: string // yyyy-MM-dd format
  startTime: string // HH:mm format
  endTime: string // HH:mm format
  status: SessionStatus
  type: SessionType
  mode: SessionMode
  postponedToDate: string | null
  createdAt: string
  updatedAt: string
  // Enriched data
  subjectName: string
  subjectCode: string
  /** @deprecated Removed from backend response. */
  groupType?: GroupType | null
  teacherName: string | null
  // Convenience flags
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
  durationMinutes: number
}

export interface CreateSessionRequest {
  type: SessionType
  subjectId?: number // Required for SCHEDULING
  groupId?: number // Required for EXTRA, optional for REGULAR
  scheduleId?: number // Required for REGULAR
  classroom: Classroom
  date: string // yyyy-MM-dd format
  startTime: string // HH:mm format
  endTime: string // HH:mm format
  mode: SessionMode
}

export interface UpdateSessionRequest {
  classroom?: Classroom
  date?: string
  startTime?: string
  endTime?: string
  mode?: SessionMode
}

export interface GenerateSessionsRequest {
  groupId: number
  startDate: string // yyyy-MM-dd format
  endDate: string // yyyy-MM-dd format
}

export interface PostponeSessionRequest {
  newDate: string // yyyy-MM-dd format
  newStartTime?: string
  newEndTime?: string
  newClassroom?: Classroom
  newMode?: SessionMode
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

export type UserPageResponse = PageResponse<User>
export type TeacherPageResponse = PageResponse<Teacher>
export type GroupPageResponse = PageResponse<Group>
export type SubjectPageResponse = PageResponse<Subject>
export type SchedulePageResponse = PageResponse<Schedule>
export type EnrichedSchedulePageResponse = PageResponse<EnrichedSchedule>
export type SessionPageResponse = PageResponse<Session>
