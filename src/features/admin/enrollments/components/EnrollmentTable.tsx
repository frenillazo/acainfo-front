import { Link } from 'react-router-dom'
import type { Enrollment } from '@/features/enrollments/types/enrollment.types'
import { EnrollmentStatusBadge } from '@/features/enrollments/components/EnrollmentStatusBadge'
import {
  DataTable,
  TextCell,
  ActionsCell,
  ActionButton,
  type Column,
} from '@/shared/components/ui'

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
  const columns: Column<Enrollment>[] = [
    {
      key: 'student',
      header: 'Estudiante',
      render: (enrollment) => (
        <div className="font-medium text-gray-900">{enrollment.studentName}</div>
      ),
    },
    {
      key: 'subject',
      header: 'Asignatura',
      render: (enrollment) => (
        <TextCell primary={enrollment.subjectName} secondary={enrollment.subjectCode} />
      ),
    },
    {
      key: 'group',
      header: 'Grupo',
      render: (enrollment) => (
        <span className="text-sm text-gray-500">{enrollment.groupType}</span>
      ),
    },
    {
      key: 'teacher',
      header: 'Profesor',
      render: (enrollment) => (
        <span className="text-sm text-gray-500">{enrollment.teacherName}</span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (enrollment) => (
        <EnrollmentStatusBadge
          status={enrollment.status}
          waitingPosition={enrollment.waitingListPosition}
        />
      ),
    },
    {
      key: 'date',
      header: 'Fecha',
      render: (enrollment) => (
        <span className="text-sm text-gray-500">
          {new Date(enrollment.enrolledAt).toLocaleDateString('es-ES')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'right',
      render: (enrollment) => (
        <ActionsCell>
          <Link
            to={`/admin/enrollments/${enrollment.id}`}
            className="font-medium text-blue-600 hover:text-blue-800"
          >
            Ver detalle
          </Link>
          {onWithdraw && enrollment.canBeWithdrawn && (
            <ActionButton
              onClick={() => onWithdraw(enrollment.id)}
              variant="danger"
              disabled={isWithdrawing}
            >
              Retirar
            </ActionButton>
          )}
        </ActionsCell>
      ),
    },
  ]

  return (
    <DataTable
      data={enrollments}
      columns={columns}
      keyExtractor={(enrollment) => enrollment.id}
      emptyMessage="No se encontraron inscripciones"
    />
  )
}
