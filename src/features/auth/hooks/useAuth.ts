import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { authApi } from '../services/authApi'
import { useAuthStore } from '../store/authStore'
import type { LoginRequest, RegisterRequest } from '../types/auth.types'

/**
 * Acepta solo rutas internas de la propia app: un `?next=//otro-sitio` o una
 * URL absoluta convertirían el login en un redirector abierto.
 */
function safeInternalPath(path: string | null | undefined): string | null {
  if (!path) return null
  if (!path.startsWith('/') || path.startsWith('//')) return null
  if (path.startsWith('/login')) return null
  return path
}

export const useAuth = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { setAuth, setUser, clearAuth, isAuthenticated, hasRole, user } =
    useAuthStore()

  // Fetch current user
  const { isLoading: isLoadingUser } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const user = await authApi.getMe()
      setUser(user)
      return user
    },
    enabled: isAuthenticated(),
    retry: false,
  })

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    // El formulario ya pinta loginError en su Alert.
    meta: { silentError: true },
    onSuccess: (data) => {
      // User is included in the auth response from backend
      setAuth(data, data.user)
      queryClient.invalidateQueries({ queryKey: ['auth'] })

      // Navigate based on role - roles is a string array: ["ADMIN", "STUDENT"]
      const isAdminOnly =
        data.user.roles.includes('ADMIN') && !data.user.roles.includes('STUDENT')
      const defaultTarget = isAdminOnly ? '/admin' : '/dashboard'

      // Devolver al usuario donde estaba: `from` lo pone ProtectedRoute al
      // interceptar un deep link; `next`, el interceptor al caducar la sesión.
      const from = (location.state as { from?: { pathname?: string; search?: string } } | null)?.from
      const fromPath = from?.pathname ? `${from.pathname}${from.search ?? ''}` : null
      const target =
        safeInternalPath(fromPath) ?? safeInternalPath(searchParams.get('next')) ?? defaultTarget

      navigate(target, { replace: true })
    },
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    // El formulario ya pinta registerError en su Alert.
    meta: { silentError: true },
    onSuccess: (data) => {
      // Registration now requires email verification
      // User is returned with PENDING_ACTIVATION status, no tokens
      navigate('/verification-pending', { state: { email: data.email } })
    },
  })

  // Logout
  const logout = async () => {
    try {
      // El refresh token viaja en la cookie httpOnly; el back la lee y revoca.
      await authApi.logout()
    } finally {
      clearAuth()
      queryClient.clear()
      navigate('/login')
    }
  }

  return {
    // State
    user,
    isAuthenticated: isAuthenticated(),
    isLoading: isLoadingUser,

    // Actions
    login: (data: LoginRequest) => loginMutation.mutate(data),
    register: (data: RegisterRequest) => registerMutation.mutate(data),
    logout,

    // Mutation states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,

    // Role checks
    hasRole,
    isAdmin: hasRole('ADMIN'),
    isTeacher: hasRole('TEACHER'),
    isStudent: hasRole('STUDENT'),
  }
}
