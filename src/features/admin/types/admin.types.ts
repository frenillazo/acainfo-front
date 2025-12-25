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
  status: UserStatus
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
export type GroupType = 'REGULAR_Q1' | 'INTENSIVE_Q1' | 'REGULAR_Q2' | 'INTENSIVE_Q2'
export type GroupStatus = 'OPEN' | 'CLOSED' | 'CANCELLED'

export interface Group {
  id: number
  subjectId: number
  teacherId: number
  type: GroupType
  status: GroupStatus
  currentEnrollmentCount: number
  capacity: number | null
  availableSeats: number
  maxCapacity: number
  pricePerHour: number
  createdAt: string
  updatedAt: string
  // Enriched
  subjectName: string
  subjectCode: string
  teacherName: string
  // Flags
  isOpen: boolean
  canEnroll: boolean
  isIntensive: boolean
  isRegular: boolean
}

export interface CreateGroupRequest {
  subjectId: number
  teacherId: number
  type: GroupType
  capacity?: number
  pricePerHour?: number
}

export interface UpdateGroupRequest {
  status?: GroupStatus
  capacity?: number
}

export interface GroupFilters {
  subjectId?: number
  teacherId?: number
  type?: GroupType
  status?: GroupStatus
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: 'ASC' | 'DESC'
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

export type UserPageResponse = PageResponse<User>
export type TeacherPageResponse = PageResponse<Teacher>
export type GroupPageResponse = PageResponse<Group>
