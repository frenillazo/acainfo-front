import { Link } from 'react-router-dom'
import type { Subject } from '../../types/admin.types'
import { SubjectStatusBadge } from './SubjectStatusBadge'
import { DegreeBadge } from './DegreeBadge'
import {
  DataTable,
  ActionsCell,
  ActionButton,
  type Column,
} from '@/shared/components/ui'

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
  const columns: Column<Subject>[] = [
    {
      key: 'code',
      header: 'Código',
      render: (subject) => (
        <span className="font-mono text-sm font-medium text-gray-900">
          {subject.code}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Nombre',
      render: (subject) => (
        <div className="text-sm text-gray-900">{subject.name}</div>
      ),
    },
    {
      key: 'degree',
      header: 'Grado',
      render: (subject) => <DegreeBadge degree={subject.degree} />,
    },
    {
      key: 'groups',
      header: 'Grupos',
      render: (subject) => (
        <span className="text-sm text-gray-500">{subject.currentGroupCount}</span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (subject) => <SubjectStatusBadge status={subject.status} />,
    },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'right',
      render: (subject) => (
        <ActionsCell>
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
            <ActionButton
              onClick={() => onArchive(subject.id)}
              variant="warning"
              disabled={isArchiving}
            >
              Archivar
            </ActionButton>
          )}
          {onDelete && subject.currentGroupCount === 0 && (
            <ActionButton
              onClick={() => onDelete(subject.id)}
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
      data={subjects}
      columns={columns}
      keyExtractor={(subject) => subject.id}
      emptyMessage="No se encontraron asignaturas"
    />
  )
}
