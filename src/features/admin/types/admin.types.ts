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

// Course types (unified course model: date range identifies the course)
export type CourseStatus = 'OPEN' | 'CLOSED' | 'CANCELLED'

export interface ScheduleSummary {
  dayOfWeek: DayOfWeek
  startTime: string // HH:mm
  endTime: string // HH:mm
}

export interface Course {
  id: number
  name: string
  subjectId: number
  teacherId: number | null
  status: CourseStatus
  currentEnrollmentCount: number
  /** null = unlimited (virtual/dual course) */
  capacity: number | null
  /** null = unlimited */
  availableSeats: number | null
  /** Informative only, null if not set */
  pricePerMonth: number | null
  /** Inclusive — first day sessions can be generated. */
  startDate: string // yyyy-MM-dd
  /** Inclusive — last day sessions can be generated. */
  endDate: string // yyyy-MM-dd
  createdAt: string
  updatedAt: string
  // Enriched
  subjectName: string
  subjectCode: string
  teacherName: string | null
  // Flags
  isOpen: boolean
  canEnroll: boolean
  // Schedule summary for display
  schedules: ScheduleSummary[]
}

export interface CreateCourseRequest {
  subjectId: number
  /** Optional: null = not assigned yet */
  teacherId?: number
  startDate: string // yyyy-MM-dd
  endDate: string // yyyy-MM-dd
  /** Empty = unlimited (virtual/dual) */
  capacity?: number
  pricePerMonth?: number
}

export interface UpdateCourseRequest {
  status?: CourseStatus
  capacity?: number
  pricePerMonth?: number
  teacherId?: number
  startDate?: string
  endDate?: string
}

export interface CourseFilters {
  subjectId?: number
  teacherId?: number
  status?: CourseStatus
  searchTerm?: string
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: 'ASC' | 'DESC'
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

// Subject interest summary (admin demand view)
export interface SubjectInterestSummary {
  subjectId: number
  subjectName: string
  subjectCode: string
  degreeName: string | null
  interestedCount: number
}

// Schedule types
export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
export type Classroom = 'AULA_PORTAL1' | 'AULA_PORTAL2' | 'AULA_VIRTUAL'

export interface Schedule {
  id: number
  courseId: number
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
  courseId: number
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
  courseId?: number
  classroom?: Classroom
  dayOfWeek?: DayOfWeek
  /** Filtra por estado del curso dueño del horario (p.ej. solo OPEN) */
  courseStatus?: CourseStatus
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: 'ASC' | 'DESC'
}

// Enriched schedule with course, subject, and teacher info
export interface EnrichedSchedule {
  // Schedule fields
  id: number
  courseId: number
  dayOfWeek: DayOfWeek
  startTime: string // HH:mm format
  endTime: string // HH:mm format
  classroom: Classroom
  classroomDisplayName: string
  durationMinutes: number
  createdAt: string
  updatedAt: string
  // Enriched data from Course
  courseStatus: CourseStatus
  pricePerMonth: number | null
  // Enriched data from Subject
  subjectId: number
  subjectName: string
  subjectCode: string
  // Enriched data from Teacher
  teacherId: number | null
  teacherName: string | null
}

// Dashboard stats computed from API responses
export interface AdminDashboardStats {
  totalUsers: number
  totalStudents: number
  totalTeachers: number
  activeEnrollments: number
  totalSubjects: number
  totalCourses: number
}

// Session types
export type SessionStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED'
export type SessionType = 'REGULAR' | 'EXTRA'
export type SessionMode = 'IN_PERSON' | 'ONLINE' | 'DUAL'

export interface Session {
  // Core fields
  id: number
  subjectId: number
  courseId: number
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
  courseName: string | null
  teacherName: string | null
  // Convenience flags
  isScheduled: boolean
  isInProgress: boolean
  isCompleted: boolean
  isCancelled: boolean
  isPostponed: boolean
  isRegular: boolean
  isExtra: boolean
  hasSchedule: boolean
  durationMinutes: number
}

export interface CreateSessionRequest {
  type: SessionType
  subjectId?: number // Optional: derived from the course
  courseId?: number // Required for EXTRA, optional for REGULAR
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
  courseId: number
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
  courseId?: number
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
export type CoursePageResponse = PageResponse<Course>
export type SubjectPageResponse = PageResponse<Subject>
export type SchedulePageResponse = PageResponse<Schedule>
export type EnrichedSchedulePageResponse = PageResponse<EnrichedSchedule>
export type SessionPageResponse = PageResponse<Session>
