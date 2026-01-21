import { apiClient } from '@/shared/services/apiClient'
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from '../types/auth.types'

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data)
    return response.data
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data)
    return response.data
  },

  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    })
    return response.data
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
  },

  logoutAll: async (): Promise<void> => {
    await apiClient.post('/auth/logout/all')
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/profile')
    return response.data
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await apiClient.put<User>('/users/profile', data)
    return response.data
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await apiClient.put('/users/profile/password', data)
  },
}
