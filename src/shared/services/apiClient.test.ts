import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import axios, { AxiosError, AxiosHeaders } from 'axios'
import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { apiClient } from './apiClient'
import { useAuthStore } from '@/features/auth/store/authStore'

// El refresh se hace con `axios.post` directo (no con apiClient), así que se
// espía sobre el módulo axios en vez de sustituir el adapter.
const refreshSpy = vi.spyOn(axios, 'post')

const originalAdapter = apiClient.defaults.adapter

function reply(
  config: InternalAxiosRequestConfig,
  status: number,
  data: unknown
): Promise<AxiosResponse> {
  const response: AxiosResponse = {
    data,
    status,
    statusText: '',
    headers: {},
    config,
  }
  if (status >= 200 && status < 300) return Promise.resolve(response)
  return Promise.reject(
    new AxiosError('Request failed', String(status), config, null, response)
  )
}

/** Sustituye el transporte de red por una función que decide la respuesta. */
function useAdapter(adapter: AxiosAdapter) {
  apiClient.defaults.adapter = adapter
}

describe('apiClient: interceptor de 401', () => {
  beforeEach(() => {
    refreshSpy.mockReset()
    useAuthStore.setState({ user: null, accessToken: null, termsAccepted: null })
  })

  afterEach(() => {
    apiClient.defaults.adapter = originalAdapter
  })

  it('NO intenta refrescar cuando el 401 viene de /auth/login: propaga el error para que el formulario lo enseñe', async () => {
    // Antes de este guard, un login con credenciales incorrectas disparaba un
    // refresh que también fallaba y acababa recargando /login sin enseñar nada.
    useAdapter((config) => reply(config, 401, { message: 'Email o contraseña incorrectos' }))

    await expect(apiClient.post('/auth/login', {})).rejects.toMatchObject({
      response: { status: 401, data: { message: 'Email o contraseña incorrectos' } },
    })
    expect(refreshSpy).not.toHaveBeenCalled()
  })

  it('NO intenta refrescar cuando el 401 viene de /auth/register', async () => {
    useAdapter((config) => reply(config, 401, { message: 'No autorizado' }))

    await expect(apiClient.post('/auth/register', {})).rejects.toMatchObject({
      response: { status: 401 },
    })
    expect(refreshSpy).not.toHaveBeenCalled()
  })

  it('refresca y reintenta una vez cuando el 401 viene de una ruta normal', async () => {
    useAuthStore.setState({ accessToken: 'caducado' })
    refreshSpy.mockResolvedValue({ data: { accessToken: 'nuevo' } })

    let calls = 0
    useAdapter((config) => {
      calls += 1
      return calls === 1
        ? reply(config, 401, { message: 'Token expirado' })
        : reply(config, 200, [{ id: 1 }])
    })

    const response = await apiClient.get('/enrollments')

    expect(response.data).toEqual([{ id: 1 }])
    expect(refreshSpy).toHaveBeenCalledTimes(1)
    expect(useAuthStore.getState().accessToken).toBe('nuevo')
    expect(calls).toBe(2)
  })

  it('añade el Bearer del access token del store', async () => {
    useAuthStore.setState({ accessToken: 'token-123' })
    let seen: AxiosHeaders | undefined
    useAdapter((config) => {
      seen = config.headers
      return reply(config, 200, [])
    })

    await apiClient.get('/subjects')

    expect(seen?.Authorization).toBe('Bearer token-123')
  })
})
