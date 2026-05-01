import { Link } from 'react-router-dom'
import type { Intensive } from '../types/intensive.types'
import {
  DataTable,
  TextCell,
  ActionsCell,
  ActionButton,
  ConfigBadge,
  type Column,
} from '@/shared/components/ui'
import { GROUP_STATUS_CONFIG } from '@/shared/config/badgeConfig'

interface IntensiveTableProps {
  intensives: Intensive[]
  onCancel?: (id: number) => void
  onDelete?: (id: number) => void
  isCancelling?: boolean
  isDeleting?: boolean
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function IntensiveTable({
  intensives,
  onCancel,
  onDelete,
  isCancelling,
  isDeleting,
}: IntensiveTableProps) {
  const columns: Column<Intensive>[] = [
    {
      key: 'name',
      header: 'Intensivo',
      render: (it) => <TextCell primary={it.name} secondary={it.subjectName} />,
    },
    {
      key: 'teacher',
      header: 'Profesor',
      render: (it) => <span className="text-sm text-gray-500">{it.teacherName}</span>,
    },
    {
      key: 'dates',
      header: 'Fechas',
      render: (it) => (
        <span className="text-sm text-gray-500">
          {formatDate(it.startDate)} → {formatDate(it.endDate)}
        </span>
      ),
    },
    {
      key: 'capacity',
      header: 'Capacidad',
      render: (it) => (
        <span className="text-sm text-gray-500">
          <span className={it.availableSeats === 0 ? 'font-medium text-red-600' : ''}>
            {it.currentEnrollmentCount}/{it.maxCapacity}
          </span>
          <span className="ml-1 text-gray-400">({it.availableSeats} disponibles)</span>
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (it) => <ConfigBadge config={GROUP_STATUS_CONFIG} value={it.status} />,
    },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'right',
      render: (it) => (
        <ActionsCell>
          <Link
            to={`/admin/intensives/${it.id}`}
            className="font-medium text-blue-600 hover:text-blue-800"
          >
            Ver
          </Link>
          {onCancel && it.status !== 'CANCELLED' && (
            <ActionButton
              onClick={() => onCancel(it.id)}
              variant="warning"
              disabled={isCancelling}
            >
              Cancelar
            </ActionButton>
          )}
          {onDelete && it.currentEnrollmentCount === 0 && (
            <ActionButton
              onClick={() => onDelete(it.id)}
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
      data={intensives}
      columns={columns}
      keyExtractor={(it) => it.id}
      emptyMessage="No se encontraron intensivos"
    />
  )
}
