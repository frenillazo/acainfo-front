import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../services/adminApi'
import type { AdminDashboardStats } from '../types/admin.types'

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: async (): Promise<AdminDashboardStats> => {
      // Fetch all counts in parallel
      const [
        usersResponse,
        studentsResponse,
        teachersResponse,
        subjectsResponse,
        coursesResponse,
        activeEnrollmentsResponse,
      ] = await Promise.all([
        adminApi.getUsers({ size: 1 }),
        adminApi.getUsers({ size: 1, roleType: 'STUDENT' }),
        adminApi.getTeachers({ size: 1 }),
        adminApi.getSubjects({ size: 1 }),
        adminApi.getCourses({ size: 1 }),
        adminApi.getEnrollments({ size: 1, status: 'ACTIVE' }),
      ])

      return {
        totalUsers: usersResponse.totalElements,
        totalStudents: studentsResponse.totalElements,
        totalTeachers: teachersResponse.totalElements,
        totalSubjects: subjectsResponse.totalElements,
        totalCourses: coursesResponse.totalElements,
        activeEnrollments: activeEnrollmentsResponse.totalElements,
      }
    },
    staleTime: 30000, // 30 seconds
  })
}

export function useUsers(filters = {}) {
  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: () => adminApi.getUsers(filters),
  })
}

export function useTeachers(filters = {}) {
  return useQuery({
    queryKey: ['admin', 'teachers', filters],
    queryFn: () => adminApi.getTeachers(filters),
  })
}
