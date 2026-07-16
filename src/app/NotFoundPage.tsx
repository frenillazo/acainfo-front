import { Link } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/authStore'

export function NotFoundPage() {
  // El catch-all también atrapa typos bajo /dashboard y /admin, así que la
  // salida útil depende de si hay sesión: sin ella, mandar al panel sería un
  // rebote a /login.
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="text-center">
        <p className="text-4xl font-bold text-gray-900">404</p>
        <h1 className="mt-2 text-xl font-semibold text-gray-900">Página no encontrada</h1>
        <p className="mt-2 text-gray-600">
          La dirección que has abierto no existe o ha cambiado.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Ir a mi panel
            </Link>
          ) : (
            <Link
              to="/login"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Iniciar sesión
            </Link>
          )}
          <Link
            to="/"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
