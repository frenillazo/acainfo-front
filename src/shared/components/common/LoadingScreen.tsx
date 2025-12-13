import { config } from '@/shared/config/env'

export function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        <p className="mt-4 text-sm text-gray-600">Cargando {config.appName}...</p>
      </div>
    </div>
  )
}
