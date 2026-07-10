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
  Course,
  CourseFilters,
  CoursePageResponse,
  CreateCourseRequest,
  UpdateCourseRequest,
  Subject,
  SubjectFilters,
  SubjectPageResponse,
  CreateSubjectRequest,
  UpdateSubjectRequest,
  SubjectInterestSummary,
  Schedule,
  ScheduleFilters,
  SchedulePageResponse,
  CreateScheduleRequest,
  UpdateScheduleRequest,
  EnrichedSchedulePageResponse,
  Session,
  SessionFilters,
  SessionPageResponse,
  CreateSessionRequest,
  UpdateSessionRequest,
  GenerateSessionsRequest,
  PostponeSessionRequest,
} from '../types/admin.types'
import type { PageResponse } from '@/shared/types/api.types'
import type { Enrollment } from '@/features/enrollments/types/enrollment.types'

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

  // Subjects
  getSubjects: async (filters: SubjectFilters = {}): Promise<SubjectPageResponse> => {
    const response = await apiClient.get<SubjectPageResponse>('/subjects', {
      params: filters,
    })
    return response.data
  },

  getSubjectById: async (id: number): Promise<Subject> => {
    const response = await apiClient.get<Subject>(`/subjects/${id}`)
    return response.data
  },

  getSubjectByCode: async (code: string): Promise<Subject> => {
    const response = await apiClient.get<Subject>(`/subjects/code/${code}`)
    return response.data
  },

  createSubject: async (data: CreateSubjectRequest): Promise<Subject> => {
    const response = await apiClient.post<Subject>('/subjects', data)
    return response.data
  },

  updateSubject: async (id: number, data: UpdateSubjectRequest): Promise<Subject> => {
    const response = await apiClient.put<Subject>(`/subjects/${id}`, data)
    return response.data
  },

  deleteSubject: async (id: number): Promise<void> => {
    await apiClient.delete(`/subjects/${id}`)
  },

  archiveSubject: async (id: number): Promise<Subject> => {
    const response = await apiClient.put<Subject>(`/subjects/${id}/archive`)
    return response.data
  },

  // Subject interest (demand view, ADMIN only)
  getSubjectInterestSummary: async (): Promise<SubjectInterestSummary[]> => {
    const response = await apiClient.get<SubjectInterestSummary[]>('/subjects/interest-summary')
    return response.data
  },

  // Courses
  getCourses: async (filters: CourseFilters = {}): Promise<CoursePageResponse> => {
    const response = await apiClient.get<CoursePageResponse>('/courses', {
      params: filters,
    })
    return response.data
  },

  getCourseById: async (id: number): Promise<Course> => {
    const response = await apiClient.get<Course>(`/courses/${id}`)
    return response.data
  },

  createCourse: async (data: CreateCourseRequest): Promise<Course> => {
    const response = await apiClient.post<Course>('/courses', data)
    return response.data
  },

  updateCourse: async (id: number, data: UpdateCourseRequest): Promise<Course> => {
    const response = await apiClient.put<Course>(`/courses/${id}`, data)
    return response.data
  },

  deleteCourse: async (id: number): Promise<void> => {
    await apiClient.delete(`/courses/${id}`)
  },

  cancelCourse: async (id: number): Promise<Course> => {
    const response = await apiClient.post<Course>(`/courses/${id}/cancel`)
    return response.data
  },

  // Enrollments (for stats)
  getEnrollments: async (params: { page?: number; size?: number; status?: string } = {}): Promise<PageResponse<Enrollment>> => {
    const response = await apiClient.get<PageResponse<Enrollment>>('/enrollments', {
      params: { page: params.page ?? 0, size: params.size ?? 1, ...params },
    })
    return response.data
  },

  // Schedules
  getSchedules: async (filters: ScheduleFilters = {}): Promise<SchedulePageResponse> => {
    const response = await apiClient.get<SchedulePageResponse>('/schedules', {
      params: filters,
    })
    return response.data
  },

  getScheduleById: async (id: number): Promise<Schedule> => {
    const response = await apiClient.get<Schedule>(`/schedules/${id}`)
    return response.data
  },

  getSchedulesByCourse: async (courseId: number): Promise<Schedule[]> => {
    const response = await apiClient.get<Schedule[]>(`/schedules/course/${courseId}`)
    return response.data
  },

  createSchedule: async (data: CreateScheduleRequest): Promise<Schedule> => {
    const response = await apiClient.post<Schedule>('/schedules', data)
    return response.data
  },

  updateSchedule: async (id: number, data: UpdateScheduleRequest): Promise<Schedule> => {
    const response = await apiClient.put<Schedule>(`/schedules/${id}`, data)
    return response.data
  },

  deleteSchedule: async (id: number): Promise<void> => {
    await apiClient.delete(`/schedules/${id}`)
  },

  getEnrichedSchedules: async (filters: ScheduleFilters = {}): Promise<EnrichedSchedulePageResponse> => {
    const response = await apiClient.get<EnrichedSchedulePageResponse>('/schedules/enriched', {
      params: { size: 100, ...filters },
    })
    return response.data
  },

  // Sessions
  getSessions: async (filters: SessionFilters = {}): Promise<SessionPageResponse> => {
    const response = await apiClient.get<SessionPageResponse>('/sessions', {
      params: filters,
    })
    return response.data
  },

  getSessionById: async (id: number): Promise<Session> => {
    const response = await apiClient.get<Session>(`/sessions/${id}`)
    return response.data
  },

  getSessionsByCourse: async (courseId: number): Promise<Session[]> => {
    const response = await apiClient.get<Session[]>(`/sessions/course/${courseId}`)
    return response.data
  },

  getSessionsBySubject: async (subjectId: number): Promise<Session[]> => {
    const response = await apiClient.get<Session[]>(`/sessions/subject/${subjectId}`)
    return response.data
  },

  createSession: async (data: CreateSessionRequest): Promise<Session> => {
    const response = await apiClient.post<Session>('/sessions', data)
    return response.data
  },

  updateSession: async (id: number, data: UpdateSessionRequest): Promise<Session> => {
    const response = await apiClient.put<Session>(`/sessions/${id}`, data)
    return response.data
  },

  deleteSession: async (id: number): Promise<void> => {
    await apiClient.delete(`/sessions/${id}`)
  },

  // Session generation
  generateSessions: async (data: GenerateSessionsRequest): Promise<Session[]> => {
    const response = await apiClient.post<Session[]>('/sessions/generate', data)
    return response.data
  },

  previewGenerateSessions: async (data: GenerateSessionsRequest): Promise<Session[]> => {
    const response = await apiClient.post<Session[]>('/sessions/generate/preview', data)
    return response.data
  },

  // Session lifecycle
  startSession: async (id: number): Promise<Session> => {
    const response = await apiClient.post<Session>(`/sessions/${id}/start`)
    return response.data
  },

  completeSession: async (id: number): Promise<Session> => {
    const response = await apiClient.post<Session>(`/sessions/${id}/complete`)
    return response.data
  },

  cancelSession: async (id: number): Promise<Session> => {
    const response = await apiClient.post<Session>(`/sessions/${id}/cancel`)
    return response.data
  },

  postponeSession: async (id: number, data: PostponeSessionRequest): Promise<Session> => {
    const response = await apiClient.post<Session>(`/sessions/${id}/postpone`, data)
    return response.data
  },
}
