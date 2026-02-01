import { Link } from 'react-router-dom'
import type { Group } from '../../types/admin.types'
import { GroupStatusBadge } from './GroupStatusBadge'
import { GroupTypeBadge } from './GroupTypeBadge'
import {
  DataTable,
  TextCell,
  ActionsCell,
  ActionButton,
  type Column,
} from '@/shared/components/ui'

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
  const columns: Column<Group>[] = [
    {
      key: 'subject',
      header: 'Asignatura',
      render: (group) => (
        <TextCell primary={group.subjectName} secondary={group.subjectCode} />
      ),
    },
    {
      key: 'type',
      header: 'Tipo',
      render: (group) => <GroupTypeBadge type={group.type} />,
    },
    {
      key: 'teacher',
      header: 'Profesor',
      render: (group) => (
        <span className="text-sm text-gray-500">{group.teacherName}</span>
      ),
    },
    {
      key: 'capacity',
      header: 'Capacidad',
      render: (group) => (
        <span className="text-sm text-gray-500">
          <span
            className={
              group.availableSeats === 0 ? 'font-medium text-red-600' : ''
            }
          >
            {group.currentEnrollmentCount}/{group.maxCapacity}
          </span>
          <span className="ml-1 text-gray-400">
            ({group.availableSeats} disponibles)
          </span>
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (group) => <GroupStatusBadge status={group.status} />,
    },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'right',
      render: (group) => (
        <ActionsCell>
          <Link
            to={`/admin/groups/${group.id}`}
            className="font-medium text-blue-600 hover:text-blue-800"
          >
            Ver
          </Link>
          {onCancel && group.status !== 'CANCELLED' && (
            <ActionButton
              onClick={() => onCancel(group.id)}
              variant="warning"
              disabled={isCancelling}
            >
              Cancelar
            </ActionButton>
          )}
          {onDelete && group.currentEnrollmentCount === 0 && (
            <ActionButton
              onClick={() => onDelete(group.id)}
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
      data={groups}
      columns={columns}
      keyExtractor={(group) => group.id}
      emptyMessage="No se encontraron grupos"
    />
  )
}
