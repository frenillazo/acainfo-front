import { Link } from 'react-router-dom'
import type { Teacher } from '../../types/admin.types'
import { UserStatusBadge } from '../../users/components/UserStatusBadge'

interface TeacherTableProps {
  teachers: Teacher[]
  onDelete?: (id: number) => void
  isDeleting?: boolean
}

export function TeacherTable({
  teachers,
  onDelete,
  isDeleting,
}: TeacherTableProps) {
  if (teachers.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
        No se encontraron profesores
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Profesor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Creado
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {teachers.map((teacher) => (
            <tr key={teacher.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex items-center">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                    {teacher.firstName[0]}
                    {teacher.lastName[0]}
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">
                      {teacher.fullName}
                    </div>
                    <div className="text-sm text-gray-500">ID: {teacher.id}</div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {teacher.email}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <UserStatusBadge status={teacher.status} />
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {new Date(teacher.createdAt).toLocaleDateString('es-ES')}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                <div className="flex items-center justify-end gap-3">
                  <Link
                    to={`/admin/teachers/${teacher.id}`}
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    Ver detalle
                  </Link>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(teacher.id)}
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
