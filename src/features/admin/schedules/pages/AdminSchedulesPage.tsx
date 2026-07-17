import { useState } from 'react'
import { useEnrichedSchedules } from '../hooks/useAdminSchedules'
import { GlobalScheduleGrid } from '../components/GlobalScheduleGrid'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { Card, PageHeader } from '@/shared/components/ui'
import type { Classroom, DayOfWeek } from '../../types/admin.types'

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
  // Por defecto solo cursos OPEN (filtro en servidor); el toggle muestra también cerrados/cancelados
  const [showAllCourses, setShowAllCourses] = useState(false)

  const filters = {
    ...(selectedClassroom && { classroom: selectedClassroom }),
    ...(selectedDay && { dayOfWeek: selectedDay }),
    ...(!showAllCourses && { courseStatus: 'OPEN' as const }),
  }

  const { data: schedulesData, isLoading, error } = useEnrichedSchedules(filters)

  const schedules = schedulesData?.content ?? []

  // Stats
  const totalSchedules = schedules.length
  const schedulesPerClassroom = CLASSROOMS.slice(1).map(c => ({
    ...c,
    count: schedules.filter(s => s.classroom === c.key).length,
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Horarios Globales"
        subtitle="Vista general de todos los horarios por aula"
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card padding="sm">
          <p className="text-sm font-medium text-gray-500">Total Horarios</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{totalSchedules}</p>
        </Card>
        {schedulesPerClassroom.map((c) => (
          <Card key={c.key} padding="sm">
            <p className="text-sm font-medium text-gray-500">{c.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{c.count}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card padding="sm">
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
                checked={showAllCourses}
                onChange={(e) => setShowAllCourses(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Mostrar cursos cerrados y cancelados
            </label>
          </div>
        </div>
      </Card>

      {/* Schedule Grid */}
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Horario semanal</h2>

        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} title="Error al cargar los horarios" />
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
      </Card>
    </div>
  )
}
