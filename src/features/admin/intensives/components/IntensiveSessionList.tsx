import { Link } from 'react-router-dom'
import {
  DataTable,
  TextCell,
  ConfigBadge,
  type Column,
} from '@/shared/components/ui'
import {
  SESSION_STATUS_CONFIG,
  SESSION_MODE_CONFIG,
  CLASSROOM_CONFIG,
} from '@/shared/config/badgeConfig'
import type { Session } from '../../types/admin.types'

interface IntensiveSessionListProps {
  sessions: Session[]
}

function fmtDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function fmtTimeRange(start: string, end: string): string {
  return `${start} – ${end}`
}

export function IntensiveSessionList({ sessions }: IntensiveSessionListProps) {
  // Sort by date asc, then start time
  const sorted = [...sessions].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date)
    return a.startTime.localeCompare(b.startTime)
  })

  const columns: Column<Session>[] = [
    {
      key: 'date',
      header: 'Fecha',
      render: (s) => (
        <TextCell primary={fmtDate(s.date)} secondary={fmtTimeRange(s.startTime, s.endTime)} />
      ),
    },
    {
      key: 'classroom',
      header: 'Aula',
      render: (s) => <ConfigBadge config={CLASSROOM_CONFIG} value={s.classroom} />,
    },
    {
      key: 'mode',
      header: 'Modo',
      render: (s) => <ConfigBadge config={SESSION_MODE_CONFIG} value={s.mode} />,
    },
    {
      key: 'status',
      header: 'Estado',
      render: (s) => <ConfigBadge config={SESSION_STATUS_CONFIG} value={s.status} />,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (s) => (
        <Link
          to={`/admin/sessions/${s.id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Detalle →
        </Link>
      ),
    },
  ]

  return (
    <DataTable
      data={sorted}
      columns={columns}
      keyExtractor={(s) => s.id}
      emptyMessage="Este intensivo aún no tiene sesiones. Usa el botón “Añadir sesiones” para crearlas."
    />
  )
}
