export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  appName: import.meta.env.VITE_APP_NAME || 'AcaInfo',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
