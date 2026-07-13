import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AuthResponse } from '../types/auth.types'

interface AuthStore {
  user: User | null
  accessToken: string | null
  termsAccepted: boolean | null

  // Actions
  setAuth: (response: AuthResponse, user?: User) => void
  setUser: (user: User) => void
  setAccessToken: (token: string) => void
  setTermsAccepted: (accepted: boolean) => void
  clearAuth: () => void

  // Getters
  isAuthenticated: () => boolean
  hasRole: (role: string) => boolean
}

// El refresh token NO vive aquí: lo gestiona el back en una cookie httpOnly.
// El access token es la única fuente de verdad de sesión en el front (store
// persistido en 'auth-storage'); el interceptor de apiClient lo lee/actualiza.
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      termsAccepted: null,

      setAuth: (response, user) => {
        set({
          accessToken: response.accessToken,
          termsAccepted: response.termsAccepted,
          user: user ?? get().user,
        })
      },

      setUser: (user) => set({ user }),

      setAccessToken: (token) => set({ accessToken: token }),

      setTermsAccepted: (accepted) => set({ termsAccepted: accepted }),

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
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
        termsAccepted: state.termsAccepted,
      }),
    }
  )
)
