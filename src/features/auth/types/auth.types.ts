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

// Response types
export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: 'Bearer'
  expiresIn: number
}

// User types
export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  status: UserStatus
  roles: Role[]
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: number
  type: RoleType
}

export type RoleType = 'ADMIN' | 'TEACHER' | 'STUDENT'
export type UserStatus = 'ACTIVE' | 'BLOCKED' | 'PENDING_ACTIVATION'

// Auth state
export interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}
