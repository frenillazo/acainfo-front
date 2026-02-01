import { Link } from 'react-router-dom'
import type { Teacher } from '../../types/admin.types'
import { UserStatusBadge } from '../../users/components/UserStatusBadge'
import {
  DataTable,
  ActionsCell,
  ActionButton,
  Avatar,
  type Column,
} from '@/shared/components/ui'

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
  const columns: Column<Teacher>[] = [
    {
      key: 'teacher',
      header: 'Profesor',
      render: (teacher) => (
        <div className="flex items-center">
          <Avatar name={teacher.fullName} size="md" color="blue" />
          <div className="ml-4">
            <div className="font-medium text-gray-900">{teacher.fullName}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (teacher) => (
        <span className="text-sm text-gray-500">{teacher.email}</span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (teacher) => <UserStatusBadge status={teacher.status} />,
    },
    {
      key: 'createdAt',
      header: 'Creado',
      render: (teacher) => (
        <span className="text-sm text-gray-500">
          {new Date(teacher.createdAt).toLocaleDateString('es-ES')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'right',
      render: (teacher) => (
        <ActionsCell>
          <Link
            to={`/admin/teachers/${teacher.id}`}
            className="font-medium text-blue-600 hover:text-blue-800"
          >
            Ver detalle
          </Link>
          {onDelete && (
            <ActionButton
              onClick={() => onDelete(teacher.id)}
              variant="danger"
              disabled={isDeleting}
            >
              Eliminar
            </ActionButton>
          )}
        </ActionsCell>
      ),
    },
  ]

  return (
    <DataTable
      data={teachers}
      columns={columns}
      keyExtractor={(teacher) => teacher.id}
      emptyMessage="No se encontraron profesores"
    />
  )
}
