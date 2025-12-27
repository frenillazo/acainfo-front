import { useState } from 'react'
import { useEnrichedSchedules } from '../hooks/useAdminSchedules'
import { GlobalScheduleGrid } from '../components/GlobalScheduleGrid'
import type { Classroom, DayOfWeek, GroupStatus } from '../../types/admin.types'

const CLASSROOMS: { key: Classroom | ''; label: string }[] = [
  { key: '', label: 'Todas las aulas' },
  { key: 'AULA_PORTAL1', label: 'Aula Portal 1' },
  { key: 'AULA_PORTAL2', label: 'Aula Portal 2' },
  { key: 'AULA_VIRTUAL', label: 'Aula Virtual' },
]

const DAYS: { key: DayOfWeek | ''; label: string }[] = [
  { key: '', label: 'Todos los días' },
  { key: 'MONDAY', label: 'Lunes' },
  { key: 'TUESDAY', label: 'Martes' },
  { key: 'WEDNESDAY', label: 'Miércoles' },
  { key: 'THURSDAY', label: 'Jueves' },
  { key: 'FRIDAY', label: 'Viernes' },
  { key: 'SATURDAY', label: 'Sábado' },
]

export function AdminSchedulesPage() {
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | ''>('')
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | ''>('')
  const [showCancelled, setShowCancelled] = useState(false)

  const filters = {
    ...(selectedClassroom && { classroom: selectedClassroom }),
    ...(selectedDay && { dayOfWeek: selectedDay }),
  }

  const { data: schedulesData, isLoading, error } = useEnrichedSchedules(filters)

  // Filter out cancelled group schedules unless showCancelled is true
  const schedules = (schedulesData?.content ?? []).filter(
    schedule => showCancelled || schedule.groupStatus !== 'CANCELLED'
  )

  // Stats
  const totalSchedules = schedules.length
  const schedulesPerClassroom = CLASSROOMS.slice(1).map(c => ({
    ...c,
    count: schedules.filter(s => s.classroom === c.key).length,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Horarios Globales</h1>
          <p className="mt-1 text-sm text-gray-500">
            Vista general de todos los horarios por aula
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Horarios</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{totalSchedules}</p>
        </div>
        {schedulesPerClassroom.map((c) => (
          <div key={c.key} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-500">{c.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{c.count}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label htmlFor="classroom" className="block text-sm font-medium text-gray-700">
              Aula
            </label>
            <select
              id="classroom"
              value={selectedClassroom}
              onChange={(e) => setSelectedClassroom(e.target.value as Classroom | '')}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {CLASSROOMS.map((c) => (
                <option key={c.key || 'all'} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="day" className="block text-sm font-medium text-gray-700">
              Día
            </label>
            <select
              id="day"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value as DayOfWeek | '')}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {DAYS.map((d) => (
                <option key={d.key || 'all'} value={d.key}>{d.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={showCancelled}
                onChange={(e) => setShowCancelled(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Mostrar grupos cancelados
            </label>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Horario semanal</h2>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 p-4 text-red-700">
            Error al cargar los horarios. Por favor, intenta de nuevo.
          </div>
        ) : schedules.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-gray-500">
            No hay horarios registrados con los filtros seleccionados.
          </div>
        ) : (
          <GlobalScheduleGrid
            schedules={schedules}
            selectedClassroom={selectedClassroom || null}
          />
        )}
      </div>
    </div>
  )
}
