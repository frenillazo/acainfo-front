import { useState, useMemo } from 'react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useEnrollments } from '@/features/enrollments/hooks/useEnrollments'
import { useEnrichedReservations } from '../hooks/useEnrichedReservations'
import { AttendanceHistoryTable } from '../components/AttendanceHistoryTable'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { ClipboardCheck, CheckCircle, XCircle, BarChart3 } from 'lucide-react'

export function AttendanceHistoryPage() {
  const user = useAuthStore((state) => state.user)
  const { data: enrichedReservations, isLoading, error } = useEnrichedReservations(user?.id ?? 0)
  const { data: enrollments } = useEnrollments(user?.id ?? 0)

  const [selectedSubject, setSelectedSubject] = useState<string>('all')

  // Get unique subjects from enrollments for the filter
  const subjectOptions = useMemo(() => {
    if (!enrollments) return []
    const unique = new Map<number, string>()
    for (const e of enrollments) {
      if (e.isActive && !unique.has(e.subjectId)) {
        unique.set(e.subjectId, e.subjectName)
      }
    }
    return Array.from(unique.entries()).map(([id, name]) => ({
      value: String(id),
      label: name,
    }))
  }, [enrollments])

  // Filter only confirmed reservations, sorted by date desc
  const confirmedReservations = useMemo(() => {
    if (!enrichedReservations) return []
    return enrichedReservations
      .filter((r) => r.isConfirmed)
      .filter((r) => selectedSubject === 'all' || r.subjectName === subjectOptions.find((s) => s.value === selectedSubject)?.label)
      .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime())
  }, [enrichedReservations, selectedSubject, subjectOptions])

  // Stats
  const stats = useMemo(() => {
    const withAttendance = confirmedReservations.filter((r) => r.hasAttendanceRecorded)
    const present = withAttendance.filter((r) => r.wasPresent).length
    const absent = withAttendance.filter((r) => r.wasAbsent).length
    const total = withAttendance.length
    const rate = total > 0 ? Math.round((present / total) * 100) : 0
    return { total: confirmedReservations.length, present, absent, rate }
  }, [confirmedReservations])

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} title="Error al cargar el historial de asistencia" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardCheck className="h-7 w-7 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Mi Asistencia</h1>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-blue-50 p-2">
              <ClipboardCheck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total sesiones</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-green-50 p-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Presente</p>
              <p className="text-2xl font-bold text-gray-900">{stats.present}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-red-50 p-2">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ausente</p>
              <p className="text-2xl font-bold text-gray-900">{stats.absent}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-purple-50 p-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">% Asistencia</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      {subjectOptions.length > 1 && (
        <div className="flex items-center gap-3">
          <label htmlFor="subject-filter" className="text-sm font-medium text-gray-700">
            Asignatura:
          </label>
          <select
            id="subject-filter"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Todas las asignaturas</option>
            {subjectOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Table */}
      <AttendanceHistoryTable reservations={confirmedReservations} />
    </div>
  )
}
