import { Lock } from 'lucide-react'

interface MaterialsLockedProps {
  /** Por qué está bloqueado y qué puede hacer el alumno al respecto. */
  message: string
}

/**
 * El material de una asignatura solo lo sirve el back a quien tiene inscripción
 * ACTIVA. Donde no la hay, hay que decirlo en vez de listar material con botones
 * que devuelven 403 al pulsarlos.
 */
export function MaterialsLocked({ message }: MaterialsLockedProps) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-8 text-center">
      <Lock className="mx-auto mb-3 h-10 w-10 text-amber-600" aria-hidden="true" />
      <p className="font-medium text-amber-900">Todavía no puedes ver este material</p>
      <p className="mt-2 text-sm text-amber-800">{message}</p>
    </div>
  )
}
