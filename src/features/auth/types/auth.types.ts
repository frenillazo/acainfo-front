// Request types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface UpdateProfileRequest {
  firstName: string
  lastName: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface ResendVerificationRequest {
  email: string
}

export interface MessageResponse {
  message: string
  timestamp: string
}

export interface AssignRoleRequest {
  roleType: RoleType
}

export interface RevokeRoleRequest {
  roleType: RoleType
}

export interface UpdateUserStatusRequest {
  status: UserStatus
}

// Response types
export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: 'Bearer'
  expiresIn: number
  user: User
}

// User types
export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  fullName: string
  status: UserStatus
  roles: RoleType[] // Backend returns roles as string array: ["ADMIN", "STUDENT"]
  createdAt: string
  updatedAt: string
}

export type RoleType = 'ADMIN' | 'TEACHER' | 'STUDENT'
// Must match backend: ACTIVE, INACTIVE, BLOCKED, PENDING_ACTIVATION
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'PENDING_ACTIVATION'

// Auth state
export interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}
