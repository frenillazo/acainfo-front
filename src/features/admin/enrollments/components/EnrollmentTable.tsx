import { Link } from 'react-router-dom'
import type { Enrollment } from '@/features/enrollments/types/enrollment.types'
import { EnrollmentStatusBadge } from '@/features/enrollments/components/EnrollmentStatusBadge'

interface EnrollmentTableProps {
  enrollments: Enrollment[]
  onWithdraw?: (id: number) => void
  isWithdrawing?: boolean
}

export function EnrollmentTable({
  enrollments,
  onWithdraw,
  isWithdrawing,
}: EnrollmentTableProps) {
  if (enrollments.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
        No se encontraron inscripciones
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Estudiante
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Asignatura
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Grupo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Profesor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Fecha
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {enrollments.map((enrollment) => (
            <tr key={enrollment.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4">
                <div className="font-medium text-gray-900">
                  {enrollment.studentName}
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="font-medium text-gray-900">
                  {enrollment.subjectName}
                </div>
                <div className="text-sm text-gray-500">
                  {enrollment.subjectCode}
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {enrollment.groupType}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {enrollment.teacherName}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <EnrollmentStatusBadge
                  status={enrollment.status}
                  waitingPosition={enrollment.waitingListPosition}
                />
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {new Date(enrollment.enrolledAt).toLocaleDateString('es-ES')}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                <div className="flex items-center justify-end gap-3">
                  <Link
                    to={`/admin/enrollments/${enrollment.id}`}
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    Ver detalle
                  </Link>
                  {onWithdraw && enrollment.canBeWithdrawn && (
                    <button
                      onClick={() => onWithdraw(enrollment.id)}
                      disabled={isWithdrawing}
                      className="font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      Retirar
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
