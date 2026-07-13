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
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        const newToken = await getRefreshedToken()
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      } catch {
        // Refresh fallido: limpia el estado y manda a login.
        useAuthStore.getState().clearAuth()
        localStorage.removeItem('auth-storage')
        window.location.href = '/login'
        // Promesa que nunca resuelve para cortar la propagación del error.
        return new Promise(() => {})
      }
    }

    return Promise.reject(error)
  }
)
