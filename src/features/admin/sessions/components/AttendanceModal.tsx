import { useState, useEffect, useMemo } from 'react'
import { useSessionAttendance, useRecordBulkAttendance } from '../hooks/useAttendance'
import { AttendanceStatus } from '@/features/reservations/types/reservation.types'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { Badge } from '@/shared/components/ui/Badge'
import { cn } from '@/shared/utils/cn'

interface AttendanceModalProps {
  sessionId: number
  isOpen: boolean
  onClose: () => void
}

export function AttendanceModal({ sessionId, isOpen, onClose }: AttendanceModalProps) {
  const { data: reservations, isLoading } = useSessionAttendance(sessionId)
  const recordMutation = useRecordBulkAttendance()
  const [attendanceMap, setAttendanceMap] = useState<Record<number, AttendanceStatus>>({})

  // Initialize from already-recorded reservations
  useEffect(() => {
    if (reservations) {
      const initial: Record<number, AttendanceStatus> = {}
      reservations.forEach((r) => {
        if (r.hasAttendanceRecorded && r.attendanceStatus) {
          initial[r.id] = r.attendanceStatus as AttendanceStatus
        }
      })
      setAttendanceMap(initial)
    }
  }, [reservations])

  const confirmedReservations = useMemo(
    () => reservations?.filter((r) => r.isConfirmed) ?? [],
    [reservations]
  )

  const unrecordedReservations = useMemo(
    () => confirmedReservations.filter((r) => !r.hasAttendanceRecorded),
    [confirmedReservations]
  )

  const recordedCount = useMemo(
    () => confirmedReservations.filter((r) => r.hasAttendanceRecorded).length,
    [confirmedReservations]
  )

  const pendingChanges = useMemo(() => {
    if (!reservations) return {}
    const changes: Record<number, AttendanceStatus> = {}
    for (const [idStr, status] of Object.entries(attendanceMap)) {
      const id = Number(idStr)
      const reservation = reservations.find((r) => r.id === id)
      if (reservation && !reservation.hasAttendanceRecorded) {
        changes[id] = status
      }
    }
    return changes
  }, [attendanceMap, reservations])

  const hasPendingChanges = Object.keys(pendingChanges).length > 0

  const toggleAttendance = (reservationId: number, status: AttendanceStatus) => {
    setAttendanceMap((prev) => {
      if (prev[reservationId] === status) {
        const next = { ...prev }
        delete next[reservationId]
        return next
      }
      return { ...prev, [reservationId]: status }
    })
  }

  const markAllUnrecorded = (status: AttendanceStatus) => {
    setAttendanceMap((prev) => {
      const next = { ...prev }
      unrecordedReservations.forEach((r) => {
        next[r.id] = status
      })
      return next
    })
  }

  const handleSubmit = () => {
    if (!hasPendingChanges) return
    recordMutation.mutate(
      { sessionId, data: { attendanceMap: pendingChanges } },
      { onSuccess: () => onClose() }
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Pasar Lista
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {recordedCount} de {confirmedReservations.length} registrados
          </p>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
          {isLoading ? (
            <LoadingState />
          ) : confirmedReservations.length === 0 ? (
            <p className="py-8 text-center text-gray-500">
              No hay reservas confirmadas para esta sesion
            </p>
          ) : (
            <>
              {/* Bulk actions */}
              {unrecordedReservations.length > 0 && (
                <div className="mb-4 flex gap-2">
                  <button
                    onClick={() => markAllUnrecorded(AttendanceStatus.PRESENT)}
                    className="rounded-md bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
                  >
                    Marcar todos presentes
                  </button>
                  <button
                    onClick={() => markAllUnrecorded(AttendanceStatus.ABSENT)}
                    className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                  >
                    Marcar todos ausentes
                  </button>
                </div>
              )}

              {/* Student list */}
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs font-medium uppercase text-gray-500">
                    <th className="pb-2">Estudiante</th>
                    <th className="pb-2">Modo</th>
                    <th className="pb-2 text-center">Asistencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {confirmedReservations.map((reservation) => {
                    const isRecorded = reservation.hasAttendanceRecorded
                    const currentStatus = attendanceMap[reservation.id]

                    return (
                      <tr key={reservation.id} className="text-sm">
                        <td className="py-3">
                          <div className="font-medium text-gray-900">
                            {reservation.studentName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {reservation.studentEmail}
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge variant={reservation.isInPerson ? 'success' : 'info'}>
                            {reservation.isInPerson ? 'Presencial' : 'Online'}
                          </Badge>
                        </td>
                        <td className="py-3">
                          {isRecorded ? (
                            <div className="flex justify-center">
                              <Badge variant={reservation.wasPresent ? 'success' : 'error'}>
                                {reservation.wasPresent ? 'Presente' : 'Ausente'}
                              </Badge>
                            </div>
                          ) : (
                            <div className="flex justify-center gap-1">
                              <button
                                onClick={() =>
                                  toggleAttendance(reservation.id, AttendanceStatus.PRESENT)
                                }
                                className={cn(
                                  'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                                  currentStatus === AttendanceStatus.PRESENT
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700'
                                )}
                              >
                                Presente
                              </button>
                              <button
                                onClick={() =>
                                  toggleAttendance(reservation.id, AttendanceStatus.ABSENT)
                                }
                                className={cn(
                                  'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                                  currentStatus === AttendanceStatus.ABSENT
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700'
                                )}
                              >
                                Ausente
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cerrar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!hasPendingChanges || recordMutation.isPending}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {recordMutation.isPending ? 'Guardando...' : 'Guardar asistencia'}
          </button>
        </div>
      </div>
    </div>
  )
}
