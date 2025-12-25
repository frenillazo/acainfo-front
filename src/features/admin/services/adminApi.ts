import { apiClient } from '@/shared/services/apiClient'
import type {
  User,
  Teacher,
  UserFilters,
  TeacherFilters,
  UserPageResponse,
  TeacherPageResponse,
  CreateTeacherRequest,
  UpdateTeacherRequest,
  Group,
  GroupFilters,
  GroupPageResponse,
  CreateGroupRequest,
  UpdateGroupRequest,
} from '../types/admin.types'
import type { PageResponse } from '@/shared/types/api.types'
import type { Subject } from '@/features/subjects/types/subject.types'
import type { Enrollment } from '@/features/enrollments/types/enrollment.types'
import type { Payment } from '@/features/payments/types/payment.types'

export const adminApi = {
  // Users
  getUsers: async (filters: UserFilters = {}): Promise<UserPageResponse> => {
    const response = await apiClient.get<UserPageResponse>('/admin/users', {
      params: filters,
    })
    return response.data
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`/admin/users/${id}`)
    return response.data
  },

  getUserByEmail: async (email: string): Promise<User> => {
    const response = await apiClient.get<User>(`/admin/users/email/${email}`)
    return response.data
  },

  // Teachers
  getTeachers: async (filters: TeacherFilters = {}): Promise<TeacherPageResponse> => {
    const response = await apiClient.get<TeacherPageResponse>('/teachers', {
      params: filters,
    })
    return response.data
  },

  getTeacherById: async (id: number): Promise<Teacher> => {
    const response = await apiClient.get<Teacher>(`/teachers/${id}`)
    return response.data
  },

  deleteTeacher: async (id: number): Promise<void> => {
    await apiClient.delete(`/teachers/${id}`)
  },

  createTeacher: async (data: CreateTeacherRequest): Promise<Teacher> => {
    const response = await apiClient.post<Teacher>('/teachers', data)
    return response.data
  },

  updateTeacher: async (id: number, data: UpdateTeacherRequest): Promise<Teacher> => {
    const response = await apiClient.put<Teacher>(`/teachers/${id}`, data)
    return response.data
  },

  // Subjects (for stats)
  getSubjects: async (params: { page?: number; size?: number } = {}): Promise<PageResponse<Subject>> => {
    const response = await apiClient.get<PageResponse<Subject>>('/subjects', {
      params: { page: params.page ?? 0, size: params.size ?? 1 },
    })
    return response.data
  },

  // Groups
  getGroups: async (filters: GroupFilters = {}): Promise<GroupPageResponse> => {
    const response = await apiClient.get<GroupPageResponse>('/groups', {
      params: filters,
    })
    return response.data
  },

  getGroupById: async (id: number): Promise<Group> => {
    const response = await apiClient.get<Group>(`/groups/${id}`)
    return response.data
  },

  createGroup: async (data: CreateGroupRequest): Promise<Group> => {
    const response = await apiClient.post<Group>('/groups', data)
    return response.data
  },

  updateGroup: async (id: number, data: UpdateGroupRequest): Promise<Group> => {
    const response = await apiClient.put<Group>(`/groups/${id}`, data)
    return response.data
  },

  deleteGroup: async (id: number): Promise<void> => {
    await apiClient.delete(`/groups/${id}`)
  },

  cancelGroup: async (id: number): Promise<Group> => {
    const response = await apiClient.post<Group>(`/groups/${id}/cancel`)
    return response.data
  },

  // Enrollments (for stats)
  getEnrollments: async (params: { page?: number; size?: number; status?: string } = {}): Promise<PageResponse<Enrollment>> => {
    const response = await apiClient.get<PageResponse<Enrollment>>('/enrollments', {
      params: { page: params.page ?? 0, size: params.size ?? 1, ...params },
    })
    return response.data
  },

  // Payments (for stats)
  getPayments: async (params: { page?: number; size?: number; status?: string } = {}): Promise<PageResponse<Payment>> => {
    const response = await apiClient.get<PageResponse<Payment>>('/payments', {
      params: { page: params.page ?? 0, size: params.size ?? 1, ...params },
    })
    return response.data
  },
}
