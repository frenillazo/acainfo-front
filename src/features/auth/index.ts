// Components
export { LoginForm } from './components/LoginForm'
export { RegisterForm } from './components/RegisterForm'
export { ProtectedRoute } from './components/ProtectedRoute'
export { RestrictedAccountBanner } from './components/RestrictedAccountBanner'
export { ProfileEditForm } from './components/ProfileEditForm'
export { ChangePasswordForm } from './components/ChangePasswordForm'
export { RoleManagementPanel } from './components/RoleManagementPanel'

// Pages
export { LoginPage } from './pages/LoginPage'
export { RegisterPage } from './pages/RegisterPage'
export { ProfilePage } from './pages/ProfilePage'
export { VerificationPendingPage } from './pages/VerificationPendingPage'
export { VerifyEmailPage } from './pages/VerifyEmailPage'
export { ForgotPasswordPage } from './pages/ForgotPasswordPage'
export { ResetPasswordPage } from './pages/ResetPasswordPage'

// Hooks
export { useAuth } from './hooks/useAuth'
export { useProfile } from './hooks/useProfile'
export { useTerms } from './hooks/useTerms'

// Store
export { useAuthStore } from './store/authStore'

// Services
export { authApi } from './services/authApi'
export { adminApi } from './services/adminApi'
export { termsApi } from './services/termsApi'

// Types
export type {
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  AuthResponse,
  User,
  RoleType,
  UserStatus,
  AuthState,
} from './types/auth.types'
