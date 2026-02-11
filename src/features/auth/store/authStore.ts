import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AuthResponse } from '../types/auth.types'

interface AuthStore {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  termsAccepted: boolean | null

  // Actions
  setAuth: (response: AuthResponse, user?: User) => void
  setUser: (user: User) => void
  setTermsAccepted: (accepted: boolean) => void
  clearAuth: () => void

  // Getters
  isAuthenticated: () => boolean
  hasRole: (role: string) => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      termsAccepted: null,

      setAuth: (response, user) => {
        localStorage.setItem('accessToken', response.accessToken)
        localStorage.setItem('refreshToken', response.refreshToken)
        set({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          termsAccepted: response.termsAccepted,
          user: user ?? get().user,
        })
      },

      setUser: (user) => set({ user }),

      setTermsAccepted: (accepted) => set({ termsAccepted: accepted }),

      clearAuth: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          termsAccepted: null,
        })
      },

      isAuthenticated: () => !!get().accessToken,

      hasRole: (role) => {
        const user = get().user
        // Backend returns roles as string array: ["ADMIN", "STUDENT"]
        return user?.roles.includes(role as User['roles'][number]) ?? false
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        termsAccepted: state.termsAccepted,
      }),
    }
  )
)
