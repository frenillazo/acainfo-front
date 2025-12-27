import { Link } from 'react-router-dom'
import type { Subject } from '../../types/admin.types'
import { SubjectStatusBadge } from './SubjectStatusBadge'
import { DegreeBadge } from './DegreeBadge'

interface SubjectTableProps {
  subjects: Subject[]
  onArchive?: (id: number) => void
  onDelete?: (id: number) => void
  isArchiving?: boolean
  isDeleting?: boolean
}

export function SubjectTable({
  subjects,
  onArchive,
  onDelete,
  isArchiving,
  isDeleting,
}: SubjectTableProps) {
  if (subjects.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
        No se encontraron asignaturas
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Código
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Grado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Grupos
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Estado
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {subjects.map((subject) => (
            <tr key={subject.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4">
                <span className="font-mono text-sm font-medium text-gray-900">
                  {subject.code}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="text-sm text-gray-900">{subject.name}</div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <DegreeBadge degree={subject.degree} />
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {subject.currentGroupCount}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <SubjectStatusBadge status={subject.status} />
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                <div className="flex items-center justify-end gap-3">
                  <Link
                    to={`/admin/subjects/${subject.id}`}
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    Ver
                  </Link>
                  <Link
                    to={`/admin/subjects/${subject.id}/edit`}
                    className="font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    Editar
                  </Link>
                  {onArchive && subject.status !== 'ARCHIVED' && (
                    <button
                      onClick={() => onArchive(subject.id)}
                      disabled={isArchiving}
                      className="font-medium text-yellow-600 hover:text-yellow-800 disabled:opacity-50"
                    >
                      Archivar
                    </button>
                  )}
                  {onDelete && subject.currentGroupCount === 0 && (
                    <button
                      onClick={() => onDelete(subject.id)}
                      disabled={isDeleting}
                      className="font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
