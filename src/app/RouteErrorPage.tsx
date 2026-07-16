import { Link, useRouteError } from 'react-router-dom'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'

/**
 * Un chunk que no se puede descargar casi siempre significa que acabamos de
 * desplegar: el index en memoria del usuario apunta a ficheros con un hash que
 * ya no existe en el servidor. No es culpa suya y se arregla recargando.
 */
function isStaleChunkError(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message : typeof error === 'string' ? error : ''
  return /dynamically imported module|Importing a module script failed|Failed to fetch/i.test(
    message
  )
}

export function RouteErrorPage() {
  const error = useRouteError()
  const isStaleChunk = isStaleChunkError(error)

  // Sin esta página, React Router pinta su pantalla por defecto: "Unexpected
  // Application Error!", en inglés, sin marca y sin salida.
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
          <AlertTriangle className="h-6 w-6 text-amber-700" aria-hidden="true" />
        </div>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          {isStaleChunk ? 'Hay una versión nueva de la app' : 'Algo ha ido mal'}
        </h1>
        <p className="mt-2 text-gray-600">
          {isStaleChunk
            ? 'Recarga la página para cargarla; no perderás nada de lo que ya habías hecho.'
            : 'No hemos podido mostrar esta página. Puedes recargar o volver al inicio.'}
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            variant="primary"
            leftIcon={<RefreshCw className="h-4 w-4" aria-hidden="true" />}
            onClick={() => window.location.reload()}
          >
            Recargar
          </Button>
          {!isStaleChunk && (
            <Link
              to="/dashboard"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Ir a mi panel
            </Link>
          )}
        </div>

        {import.meta.env.DEV && error instanceof Error && (
          <pre className="mt-6 overflow-x-auto rounded-md bg-gray-100 p-3 text-left text-xs text-gray-700">
            {error.message}
          </pre>
        )}
      </div>
    </div>
  )
}
