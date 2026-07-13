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
      termsAccepted: null,
    })
    vi.mocked(authApi.getMe).mockResolvedValue(user)
    vi.mocked(authApi.logout).mockResolvedValue(undefined)
  })

  it('llama a authApi.logout sin argumentos: el refresh token viaja en la cookie httpOnly', async () => {
    // El refresh token ya no es accesible a JS (cookie httpOnly); el back lo
    // lee de la cookie y lo revoca. El front no envía ningún token en el body.
    useAuthStore.setState({ user, accessToken: 'access' })

    const { result } = renderHook(() => useAuth(), { wrapper })
    await act(async () => {
      await result.current.logout()
    })

    expect(authApi.logout).toHaveBeenCalledWith()
  })

  it('limpia el estado aunque la petición de logout falle', async () => {
    useAuthStore.setState({ user, accessToken: 'access' })
    vi.mocked(authApi.logout).mockRejectedValue(new Error('network'))

    const { result } = renderHook(() => useAuth(), { wrapper })
    await act(async () => {
      await result.current.logout().catch(() => {})
    })

    expect(useAuthStore.getState().accessToken).toBeNull()
    expect(useAuthStore.getState().user).toBeNull()
  })
})
