import type { EnrichedReservation } from '../types/reservation.types'
import { ReservationModeBadge } from './ReservationModeBadge'
import { Badge } from '@/shared/components/ui/Badge'

interface AttendanceHistoryTableProps {
  reservations: EnrichedReservation[]
}

const CLASSROOM_LABELS: Record<string, string> = {
  AULA_PORTAL1: 'Aula Portal 1',
  AULA_PORTAL2: 'Aula Portal 2',
  AULA_VIRTUAL: 'Aula Virtual',
  AULA_101: 'Aula 101',
  AULA_102: 'Aula 102',
  AULA_201: 'Aula 201',
  AULA_202: 'Aula 202',
  LAB_A: 'Laboratorio A',
  LAB_B: 'Laboratorio B',
  ONLINE_MEET: 'Online (Meet)',
}

export function AttendanceHistoryTable({ reservations }: AttendanceHistoryTableProps) {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })

  const formatTime = (time: string) => time?.substring(0, 5) ?? ''

  if (reservations.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-500">No hay registros de asistencia</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr className="text-left text-xs font-medium uppercase text-gray-500">
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Asignatura</th>
            <th className="px-4 py-3">Aula</th>
            <th className="px-4 py-3">Modo</th>
            <th className="px-4 py-3 text-center">Asistencia</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {reservations.map((r) => (
            <tr key={r.id} className="text-sm">
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{formatDate(r.sessionDate)}</div>
                <div className="text-xs text-gray-500">
                  {formatTime(r.sessionStartTime)} - {formatTime(r.sessionEndTime)}
                </div>
              </td>
              <td className="px-4 py-3 text-gray-900">{r.subjectName}</td>
              <td className="px-4 py-3 text-gray-600">
                {CLASSROOM_LABELS[r.classroom] || r.classroom}
              </td>
              <td className="px-4 py-3">
                <ReservationModeBadge mode={r.mode} />
              </td>
              <td className="px-4 py-3 text-center">
                {r.hasAttendanceRecorded ? (
                  <Badge variant={r.wasPresent ? 'success' : 'error'}>
                    {r.wasPresent ? 'Presente' : 'Ausente'}
                  </Badge>
                ) : (
                  <Badge variant="default">Pendiente</Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
