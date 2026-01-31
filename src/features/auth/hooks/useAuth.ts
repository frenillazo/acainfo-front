import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/authApi'
import { useAuthStore } from '../store/authStore'
import type { LoginRequest, RegisterRequest } from '../types/auth.types'

export const useAuth = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
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
    onSuccess: (data) => {
      // User is included in the auth response from backend
      setAuth(data, data.user)
      queryClient.invalidateQueries({ queryKey: ['auth'] })

      // Navigate based on role - roles is a string array: ["ADMIN", "STUDENT"]
      const isAdminOnly =
        data.user.roles.includes('ADMIN') && !data.user.roles.includes('STUDENT')
      navigate(isAdminOnly ? '/admin' : '/dashboard')
    },
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      // Registration now requires email verification
      // User is returned with PENDING_ACTIVATION status, no tokens
      navigate('/verification-pending', { state: { email: data.email } })
    },
  })

  // Logout
  const logout = async () => {
    try {
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
