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
    onSuccess: async (data) => {
      setAuth(data)
      const user = await authApi.getMe()
      setUser(user)
      queryClient.invalidateQueries({ queryKey: ['auth'] })
      navigate('/')
    },
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: async (data) => {
      setAuth(data)
      const user = await authApi.getMe()
      setUser(user)
      queryClient.invalidateQueries({ queryKey: ['auth'] })
      navigate('/')
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
