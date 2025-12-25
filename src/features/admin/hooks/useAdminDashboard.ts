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
        groupsResponse,
        activeEnrollmentsResponse,
        pendingPaymentsResponse,
      ] = await Promise.all([
        adminApi.getUsers({ size: 1 }),
        adminApi.getUsers({ size: 1, roleType: 'STUDENT' }),
        adminApi.getTeachers({ size: 1 }),
        adminApi.getSubjects({ size: 1 }),
        adminApi.getGroups({ size: 1 }),
        adminApi.getEnrollments({ size: 1, status: 'ACTIVE' }),
        adminApi.getPayments({ size: 1, status: 'PENDING' }),
      ])

      return {
        totalUsers: usersResponse.totalElements,
        totalStudents: studentsResponse.totalElements,
        totalTeachers: teachersResponse.totalElements,
        totalSubjects: subjectsResponse.totalElements,
        totalGroups: groupsResponse.totalElements,
        activeEnrollments: activeEnrollmentsResponse.totalElements,
        pendingPayments: pendingPaymentsResponse.totalElements,
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
