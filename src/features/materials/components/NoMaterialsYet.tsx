import { FolderOpen } from 'lucide-react'
import { currentAcademicYear, formatAcademicYear } from '@/shared/utils/formatters'

/**
 * Estado vacío de los materiales de una asignatura.
 *
 * El alumno solo ve el material del curso académico en marcha (el back corta en
 * septiembre). Sin decirlo, el 1 de septiembre el material que ayer estaba
 * desaparece y el mensaje sugiere que no existe: aquí se nombra el curso, para
 * que se entienda que es un cambio de año y no un fallo.
 */
export function NoMaterialsYet() {
  const year = formatAcademicYear(currentAcademicYear())

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
      <FolderOpen className="mx-auto mb-3 h-10 w-10 text-gray-400" aria-hidden="true" />
      <p className="font-medium text-gray-700">
        Todavía no hay material del curso {year}
      </p>
      <p className="mt-1 text-sm text-gray-500">
        Aquí solo se ve el material del curso actual. El de años anteriores no aparece.
      </p>
    </div>
  )
}
