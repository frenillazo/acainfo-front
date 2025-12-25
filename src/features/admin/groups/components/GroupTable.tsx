import { Link } from 'react-router-dom'
import type { Group } from '../../types/admin.types'
import { GroupStatusBadge } from './GroupStatusBadge'
import { GroupTypeBadge } from './GroupTypeBadge'

interface GroupTableProps {
  groups: Group[]
  onCancel?: (id: number) => void
  onDelete?: (id: number) => void
  isCancelling?: boolean
  isDeleting?: boolean
}

export function GroupTable({
  groups,
  onCancel,
  onDelete,
  isCancelling,
  isDeleting,
}: GroupTableProps) {
  if (groups.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
        No se encontraron grupos
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Asignatura
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Profesor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Capacidad
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
          {groups.map((group) => (
            <tr key={group.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4">
                <div className="font-medium text-gray-900">
                  {group.subjectName}
                </div>
                <div className="text-sm text-gray-500">{group.subjectCode}</div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <GroupTypeBadge type={group.type} />
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {group.teacherName}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                <span
                  className={
                    group.availableSeats === 0 ? 'text-red-600 font-medium' : ''
                  }
                >
                  {group.currentEnrollmentCount}/{group.maxCapacity}
                </span>
                <span className="text-gray-400 ml-1">
                  ({group.availableSeats} disponibles)
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <GroupStatusBadge status={group.status} />
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                <div className="flex items-center justify-end gap-3">
                  <Link
                    to={`/admin/groups/${group.id}`}
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    Ver
                  </Link>
                  {onCancel && group.status !== 'CANCELLED' && (
                    <button
                      onClick={() => onCancel(group.id)}
                      disabled={isCancelling}
                      className="font-medium text-yellow-600 hover:text-yellow-800 disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                  )}
                  {onDelete && group.currentEnrollmentCount === 0 && (
                    <button
                      onClick={() => onDelete(group.id)}
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
