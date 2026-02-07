import { apiClient } from '@/shared/services/apiClient'
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  UpdateProfileRequest,
  ChangePasswordRequest,
  MessageResponse,
} from '../types/auth.types'

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data)
    return response.data
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await apiClient.post<User>('/auth/register', data)
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

  verifyEmail: async (token: string): Promise<MessageResponse> => {
    const response = await apiClient.get<MessageResponse>(
      `/auth/verify-email?token=${token}`
    )
    return response.data
  },

  resendVerification: async (email: string): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>(
      '/auth/resend-verification',
      { email }
    )
    return response.data
  },

  requestPasswordReset: async (email: string): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>(
      '/auth/request-password-reset',
      { email }
    )
    return response.data
  },

  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>(
      '/auth/reset-password',
      { token, newPassword }
    )
    return response.data
  },
}
