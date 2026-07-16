import axios from 'axios'
import { config } from '@/shared/config/env'
import { useAuthStore } from '@/features/auth/store/authStore'

export const apiClient = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  // Enviar/recibir la cookie httpOnly del refresh token.
  withCredentials: true,
})

// Interceptor de request: añade el access token desde el store (fuente única).
apiClient.interceptors.request.use((requestConfig) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`
  }
  return requestConfig
})

// Un 401 en estas rutas es la respuesta legítima del back (credenciales
// incorrectas, refresh caducado), NO un access token expirado: intentar
// refrescar aquí acabaría expulsando al usuario a /login sin enseñarle nunca
// el error de su formulario.
const AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh']

function isAuthPath(url: string | undefined): boolean {
  if (!url) return false
  const path = url.startsWith(config.apiUrl) ? url.slice(config.apiUrl.length) : url
  return AUTH_PATHS.some((authPath) => path.startsWith(authPath))
}

// --- Refresh single-flight ---------------------------------------------------
// Un solo POST /auth/refresh en vuelo; los 401 concurrentes esperan la misma
// promesa. Evita rotaciones en paralelo que revocarían el token recién emitido
// (la rotación en el back invalida el refresh anterior en cada refresh).
let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  // El refresh token viaja en la cookie httpOnly (withCredentials); sin body.
  const { data } = await axios.post(
    `${config.apiUrl}/auth/refresh`,
    {},
    { withCredentials: true }
  )
  const newToken = data.accessToken as string
  useAuthStore.getState().setAccessToken(newToken)
  return newToken
}

function getRefreshedToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

// Interceptor de response: en 401 intenta un refresh y reintenta la request.
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthPath(originalRequest.url)
    ) {
      originalRequest._retry = true

      try {
        const newToken = await getRefreshedToken()
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      } catch {
        // Refresh fallido: la sesión ha caducado de verdad. Limpia el estado y
        // manda a login avisando de por qué, recordando dónde estaba el usuario
        // para devolverlo ahí tras volver a entrar.
        useAuthStore.getState().clearAuth()
        localStorage.removeItem('auth-storage')
        const params = new URLSearchParams({ expired: '1' })
        const next = `${window.location.pathname}${window.location.search}`
        if (next !== '/' && !next.startsWith('/login')) {
          params.set('next', next)
        }
        window.location.href = `/login?${params.toString()}`
        // Promesa que nunca resuelve para cortar la propagación del error.
        return new Promise(() => {})
      }
    }

    return Promise.reject(error)
  }
)
