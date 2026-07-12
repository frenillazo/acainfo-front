import { describe, it, expect, beforeEach, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from './useAuth'
import { useAuthStore } from '../store/authStore'
import { authApi } from '../services/authApi'
import type { User } from '../types/auth.types'

vi.mock('../services/authApi', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getMe: vi.fn(),
  },
}))

const user: User = {
  id: 1,
  email: 'student@acainfo.com',
  firstName: 'Estu',
  lastName: 'Diante',
  fullName: 'Estu Diante',
  phoneNumber: '600000000',
  status: 'ACTIVE',
  degree: 'INGENIERIA_INFORMATICA',
  roles: ['STUDENT'],
  createdAt: '2026-01-01T00:00:00',
  updatedAt: '2026-01-01T00:00:00',
}

const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  )
}

describe('useAuth.logout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      termsAccepted: null,
    })
    vi.mocked(authApi.getMe).mockResolvedValue(user)
    vi.mocked(authApi.logout).mockResolvedValue(undefined)
  })

  it('envía el refresh token de localStorage, no el del store (el interceptor rota tokens solo en localStorage)', async () => {
    // Regresión del fix 11-jul-2026: tras un refresh silencioso el store
    // conserva el token viejo ya revocado; el vigente vive en localStorage
    localStorage.setItem('accessToken', 'access-rotado')
    localStorage.setItem('refreshToken', 'refresh-rotado-vigente')
    useAuthStore.setState({
      user,
      accessToken: 'access-viejo',
      refreshToken: 'refresh-viejo-revocado',
    })

    const { result } = renderHook(() => useAuth(), { wrapper })
    await act(async () => {
      await result.current.logout()
    })

    expect(authApi.logout).toHaveBeenCalledWith('refresh-rotado-vigente')
  })

  it('limpia el estado y localStorage aunque la petición de logout falle', async () => {
    localStorage.setItem('accessToken', 'access')
    localStorage.setItem('refreshToken', 'refresh')
    useAuthStore.setState({ user, accessToken: 'access', refreshToken: 'refresh' })
    vi.mocked(authApi.logout).mockRejectedValue(new Error('network'))

    const { result } = renderHook(() => useAuth(), { wrapper })
    await act(async () => {
      await result.current.logout().catch(() => {})
    })

    expect(useAuthStore.getState().accessToken).toBeNull()
    expect(useAuthStore.getState().user).toBeNull()
    expect(localStorage.getItem('accessToken')).toBeNull()
    expect(localStorage.getItem('refreshToken')).toBeNull()
  })
})
