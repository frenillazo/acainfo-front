import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminSessions } from '../hooks/useAdminSessions'
import { useAdminGroups } from '../../groups/hooks/useAdminGroups'
import { useAdminSubjects } from '../../subjects/hooks/useAdminSubjects'
import { SessionTable } from '../components/SessionTable'
import type { SessionStatus, SessionType, SessionMode, SessionFilters } from '../../types/admin.types'

const SESSION_STATUSES: { key: SessionStatus | ''; label: string }[] = [
  { key: '', label: 'Todos los estados' },
  { key: 'SCHEDULED', label: 'Programada' },
  { key: 'IN_PROGRESS', label: 'En curso' },
  { key: 'COMPLETED', label: 'Completada' },
  { key: 'CANCELLED', label: 'Cancelada' },
  { key: 'POSTPONED', label: 'Pospuesta' },
]

const SESSION_TYPES: { key: SessionType | ''; label: string }[] = [
  { key: '', label: 'Todos los tipos' },
  { key: 'REGULAR', label: 'Regular' },
  { key: 'EXTRA', label: 'Extra' },
  { key: 'SCHEDULING', label: 'Agenda' },
]

const SESSION_MODES: { key: SessionMode | ''; label: string }[] = [
  { key: '', label: 'Todos los modos' },
  { key: 'IN_PERSON', label: 'Presencial' },
  { key: 'ONLINE', label: 'Online' },
  { key: 'DUAL', label: 'Dual' },
]

export function AdminSessionsPage() {
  const [page, setPage] = useState(0)
  const [selectedStatus, setSelectedStatus] = useState<SessionStatus | ''>('')
  const [selectedType, setSelectedType] = useState<SessionType | ''>('')
  const [selectedMode, setSelectedMode] = useState<SessionMode | ''>('')
  const [selectedGroupId, setSelectedGroupId] = useState<number | ''>('')
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | ''>('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const filters: SessionFilters = {
    page,
    size: 20,
    sortBy: 'date',
    sortDirection: 'DESC',
    ...(selectedStatus && { status: selectedStatus }),
    ...(selectedType && { type: selectedType }),
    ...(selectedMode && { mode: selectedMode }),
    ...(selectedGroupId && { groupId: selectedGroupId }),
    ...(selectedSubjectId && { subjectId: selectedSubjectId }),
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
  }

  const { data: sessionsData, isLoading, error } = useAdminSessions(filters)
  const { data: groupsData } = useAdminGroups({ size: 100 })
  const { data: subjectsData } = useAdminSubjects({ size: 100, status: 'ACTIVE' })

  const sessions = sessionsData?.content ?? []
  const totalPages = sessionsData?.totalPages ?? 0
  const totalElements = sessionsData?.totalElements ?? 0

  const groups = groupsData?.content ?? []
  const subjects = subjectsData?.content ?? []

  const handleClearFilters = () => {
    setSelectedStatus('')
    setSelectedType('')
    setSelectedMode('')
    setSelectedGroupId('')
    setSelectedSubjectId('')
    setDateFrom('')
    setDateTo('')
    setPage(0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sesiones</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona las sesiones de clase
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/sessions/generate"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Generar sesiones
          </Link>
          <Link
            to="/admin/sessions/new"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Nueva sesion
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Sesiones</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{totalElements}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Programadas</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">
            {sessions.filter(s => s.status === 'SCHEDULED').length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-500">En Curso</p>
          <p className="mt-1 text-2xl font-bold text-yellow-600">
            {sessions.filter(s => s.status === 'IN_PROGRESS').length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Completadas</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {sessions.filter(s => s.status === 'COMPLETED').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value as SessionStatus | '')
                setPage(0)
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {SESSION_STATUSES.map((s) => (
                <option key={s.key || 'all'} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Tipo
            </label>
            <select
              id="type"
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value as SessionType | '')
                setPage(0)
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {SESSION_TYPES.map((t) => (
                <option key={t.key || 'all'} value={t.key}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="mode" className="block text-sm font-medium text-gray-700">
              Modo
            </label>
            <select
              id="mode"
              value={selectedMode}
              onChange={(e) => {
                setSelectedMode(e.target.value as SessionMode | '')
                setPage(0)
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {SESSION_MODES.map((m) => (
                <option key={m.key || 'all'} value={m.key}>{m.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Asignatura
            </label>
            <select
              id="subject"
              value={selectedSubjectId}
              onChange={(e) => {
                setSelectedSubjectId(e.target.value ? Number(e.target.value) : '')
                setPage(0)
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Todas las asignaturas</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="group" className="block text-sm font-medium text-gray-700">
              Grupo
            </label>
            <select
              id="group"
              value={selectedGroupId}
              onChange={(e) => {
                setSelectedGroupId(e.target.value ? Number(e.target.value) : '')
                setPage(0)
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Todos los grupos</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.subjectCode} - {g.teacherName}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700">
              Desde
            </label>
            <input
              type="date"
              id="dateFrom"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value)
                setPage(0)
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700">
              Hasta
            </label>
            <input
              type="date"
              id="dateTo"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value)
                setPage(0)
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleClearFilters}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {error ? (
          <div className="p-4 text-red-600">
            Error al cargar las sesiones. Por favor, intenta de nuevo.
          </div>
        ) : (
          <SessionTable sessions={sessions} isLoading={isLoading} />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
            <div className="text-sm text-gray-500">
              Mostrando {sessions.length} de {totalElements} sesiones
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="flex items-center px-3 text-sm text-gray-700">
                Pagina {page + 1} de {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
