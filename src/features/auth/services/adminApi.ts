import { apiClient } from '@/shared/services/apiClient'
import type {
  User,
  RoleType,
  UserStatus,
  AssignRoleRequest,
  RevokeRoleRequest,
  UpdateUserStatusRequest,
} from '../types/auth.types'

export const adminApi = {
  // PUT /admin/users/{id}/roles/assign - Assign role to user
  assignRole: async (userId: number, roleType: RoleType): Promise<User> => {
    const request: AssignRoleRequest = { roleType }
    const response = await apiClient.put<User>(
      `/admin/users/${userId}/roles/assign`,
      request
    )
    return response.data
  },

  // PUT /admin/users/{id}/roles/revoke - Revoke role from user
  revokeRole: async (userId: number, roleType: RoleType): Promise<User> => {
    const request: RevokeRoleRequest = { roleType }
    const response = await apiClient.put<User>(
      `/admin/users/${userId}/roles/revoke`,
      request
    )
    return response.data
  },

  // PUT /admin/users/{id}/status - Update user status
  updateStatus: async (userId: number, status: UserStatus): Promise<User> => {
    const request: UpdateUserStatusRequest = { status }
    const response = await apiClient.put<User>(`/admin/users/${userId}/status`, request)
    return response.data
  },
}
