import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  useAdminSessions,
  useStartSession,
  useCompleteSession,
  useCancelSession,
  useDeleteSession,
} from '../hooks/useAdminSessions'
import { useAdminCourses } from '../../courses/hooks/useAdminCourses'
import { useAdminSubjects } from '../../subjects/hooks/useAdminSubjects'
import { SessionTable } from '../components/SessionTable'
import { AdminWeeklyScheduleGrid } from '../components/AdminWeeklyScheduleGrid'
import { PostponeModal } from '../components/PostponeModal'
import { Card, PageHeader, Pagination } from '@/shared/components/ui'
import { ConfirmDialog } from '@/shared/components/common/ConfirmDialog'
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog'
import { LayoutGrid, List, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { formatISODate } from '@/shared/utils/formatters'
import { getWeekStart, getWeekEnd, formatWeekRange } from '@/shared/components/schedule/weekGridUtils'
import type { SessionStatus, SessionType, SessionMode, SessionFilters } from '../../types/admin.types'
import { useUrlFilters } from '@/shared/hooks/useUrlFilters'

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
]

const SESSION_MODES: { key: SessionMode | ''; label: string }[] = [
  { key: '', label: 'Todos los modos' },
  { key: 'IN_PERSON', label: 'Presencial' },
  { key: 'ONLINE', label: 'Online' },
  { key: 'DUAL', label: 'Dual' },
]

interface SessionsUrlState {
  view: 'table' | 'grid'
  page: number
  status: SessionStatus | ''
  type: SessionType | ''
  mode: SessionMode | ''
  courseId: number | ''
  subjectId: number | ''
  dateFrom: string
  dateTo: string
}

export function AdminSessionsPage() {
  // Los filtros viven en la URL: son 7 + vista + página y es el flujo diario del
  // admin; con useState, entrar a un detalle y volver (o un F5) los borraba todos.
  const [urlState, setUrlState] = useUrlFilters<SessionsUrlState>({
    view: 'table',
    page: 0,
    status: '',
    type: '',
    mode: '',
    courseId: '',
    subjectId: '',
    dateFrom: '',
    dateTo: '',
  })
  const {
    view: viewMode,
    page,
    status: selectedStatus,
    type: selectedType,
    mode: selectedMode,
    courseId: selectedCourseId,
    subjectId: selectedSubjectId,
    dateFrom,
    dateTo,
  } = urlState

  /** Cambia un filtro y, salvo que sea la propia página, vuelve a la primera. */
  const setFilter = <K extends keyof SessionsUrlState>(key: K, value: SessionsUrlState[K]) => {
    setUrlState((prev) => ({ ...prev, [key]: value, ...(key === 'page' ? {} : { page: 0 }) }))
  }

  // La semana es un Date y el modal es estado efímero: no van a la URL.
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()))
  const [postponeSessionId, setPostponeSessionId] = useState<number | null>(null)

  const startMutation = useStartSession()
  const completeMutation = useCompleteSession()
  const cancelMutation = useCancelSession()
  const deleteMutation = useDeleteSession()
  const { dialogProps, confirm } = useConfirmDialog()

  const isGridMode = viewMode === 'grid'

  const filters: SessionFilters = isGridMode
    ? {
        page: 0,
        size: 200,
        sortBy: 'date',
        sortDirection: 'ASC',
        dateFrom: formatISODate(weekStart),
        dateTo: formatISODate(getWeekEnd(weekStart)),
        ...(selectedStatus && { status: selectedStatus }),
        ...(selectedType && { type: selectedType }),
        ...(selectedMode && { mode: selectedMode }),
        ...(selectedCourseId && { courseId: selectedCourseId }),
        ...(selectedSubjectId && { subjectId: selectedSubjectId }),
      }
    : {
        page,
        size: 20,
        sortBy: 'date',
        sortDirection: 'DESC',
        ...(selectedStatus && { status: selectedStatus }),
        ...(selectedType && { type: selectedType }),
        ...(selectedMode && { mode: selectedMode }),
        ...(selectedCourseId && { courseId: selectedCourseId }),
        ...(selectedSubjectId && { subjectId: selectedSubjectId }),
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
      }

  const { data: sessionsData, isLoading, error } = useAdminSessions(filters)
  const { data: coursesData } = useAdminCourses({ size: 100 })
  const { data: subjectsData } = useAdminSubjects({ size: 100, status: 'ACTIVE' })

  const sessions = sessionsData?.content ?? []
  const totalPages = sessionsData?.totalPages ?? 0
  const totalElements = sessionsData?.totalElements ?? 0

  const courses = coursesData?.content ?? []
  const subjects = subjectsData?.content ?? []

  const handleClearFilters = () => {
    setUrlState((prev) => ({
      ...prev,
      status: '',
      type: '',
      mode: '',
      courseId: '',
      subjectId: '',
      dateFrom: '',
      dateTo: '',
      page: 0,
    }))
    if (isGridMode) setWeekStart(getWeekStart(new Date()))
  }

  const handleStart = async (id: number) => {
    const confirmed = await confirm({
      title: 'Iniciar sesión',
      message: '¿Iniciar esta sesión?',
      confirmLabel: 'Sí, iniciar',
      variant: 'info',
    })
    if (confirmed) startMutation.mutate(id)
  }

  const handleComplete = async (id: number) => {
    const confirmed = await confirm({
      title: 'Completar sesión',
      message: '¿Marcar esta sesión como completada?',
      confirmLabel: 'Sí, completar',
      variant: 'info',
    })
    if (confirmed) completeMutation.mutate(id)
  }

  const handleCancel = async (id: number) => {
    const confirmed = await confirm({
      title: 'Cancelar sesión',
      message: '¿Cancelar esta sesión?',
      confirmLabel: 'Sí, cancelar',
      variant: 'warning',
    })
    if (confirmed) cancelMutation.mutate(id)
  }

  const handleDelete = async (id: number) => {
    const confirmed = await confirm({
      title: 'Eliminar sesión',
      message: '¿Eliminar esta sesión? Esta acción no se puede deshacer.',
      confirmLabel: 'Sí, eliminar',
      variant: 'danger',
    })
    if (confirmed) deleteMutation.mutate(id)
  }

  const goToPreviousWeek = () => {
    setWeekStart((prev) => {
      const d = new Date(prev)
      d.setDate(d.getDate() - 7)
      return d
    })
  }

  const goToNextWeek = () => {
    setWeekStart((prev) => {
      const d = new Date(prev)
      d.setDate(d.getDate() + 7)
      return d
    })
  }

  const goToToday = () => {
    setWeekStart(getWeekStart(new Date()))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sesiones"
        subtitle="Gestiona las sesiones de clase"
        actions={
          <>
          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => setFilter('view', 'table')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                viewMode === 'table'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <List className="h-4 w-4" />
              Tabla
            </button>
            <button
              onClick={() => setFilter('view', 'grid')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                viewMode === 'grid'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <LayoutGrid className="h-4 w-4" />
              Semanal
            </button>
          </div>
          {/* No hay "Nueva sesión": /admin/sessions/new no existe y su enlace
              caía en sessions/:id -> parseInt('new')=NaN -> pantalla de error.
              Las sesiones se generan desde los horarios del curso. */}
          <Link
            to="/admin/sessions/generate"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Generar sesiones
          </Link>
          </>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card padding="sm">
          <p className="text-sm font-medium text-gray-500">Total Sesiones</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{totalElements}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm font-medium text-gray-500">Programadas</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">
            {sessions.filter(s => s.status === 'SCHEDULED').length}
          </p>
        </Card>
        <Card padding="sm">
          <p className="text-sm font-medium text-gray-500">En Curso</p>
          <p className="mt-1 text-2xl font-bold text-yellow-600">
            {sessions.filter(s => s.status === 'IN_PROGRESS').length}
          </p>
        </Card>
        <Card padding="sm">
          <p className="text-sm font-medium text-gray-500">Completadas</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {sessions.filter(s => s.status === 'COMPLETED').length}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => {
                setFilter('status', e.target.value as SessionStatus | '')
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
                setFilter('type', e.target.value as SessionType | '')
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
                setFilter('mode', e.target.value as SessionMode | '')
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
                setFilter('subjectId', e.target.value ? Number(e.target.value) : '')
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
            <label htmlFor="course" className="block text-sm font-medium text-gray-700">
              Curso
            </label>
            <select
              id="course"
              value={selectedCourseId}
              onChange={(e) => {
                setFilter('courseId', e.target.value ? Number(e.target.value) : '')
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Todos los cursos</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.subjectCode} - {c.name}</option>
              ))}
            </select>
          </div>

          {/* Date filters only in table mode */}
          {!isGridMode && (
            <>
              <div>
                <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700">
                  Desde
                </label>
                <input
                  type="date"
                  id="dateFrom"
                  value={dateFrom}
                  onChange={(e) => {
                    setFilter('dateFrom', e.target.value)
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
                    setFilter('dateTo', e.target.value)
                  }}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <div className="flex items-end">
            <button
              onClick={handleClearFilters}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </Card>

      {/* Content */}
      {isGridMode ? (
        <Card>
          {/* Week navigation */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Horario Semanal</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousWeek}
                className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                title="Semana anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="min-w-[200px] text-center text-sm font-medium text-gray-700">
                {formatWeekRange(weekStart)}
              </span>
              <button
                onClick={goToNextWeek}
                className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                title="Semana siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={goToToday}
                className="ml-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Hoy
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center text-gray-500">
              Cargando sesiones...
            </div>
          ) : error ? (
            <div className="p-4 text-red-600">
              Error al cargar las sesiones. Por favor, intenta de nuevo.
            </div>
          ) : sessions.length > 0 ? (
            <AdminWeeklyScheduleGrid
              sessions={sessions}
              weekStart={weekStart}
              onStart={handleStart}
              onComplete={handleComplete}
              onCancel={handleCancel}
              onPostpone={(id) => setPostponeSessionId(id)}
              onDelete={handleDelete}
            />
          ) : (
            <div className="flex h-64 items-center justify-center text-gray-500">
              No hay sesiones para esta semana.
            </div>
          )}
        </Card>
      ) : (
        <>
          <Card padding="none">
            {error ? (
              <div className="p-4 text-red-600">
                Error al cargar las sesiones. Por favor, intenta de nuevo.
              </div>
            ) : (
              <SessionTable sessions={sessions} isLoading={isLoading} />
            )}
          </Card>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(next) => setFilter('page', next)}
            isFirst={page === 0}
            isLast={page >= totalPages - 1}
          />
        </>
      )}

      {/* Modals */}
      <ConfirmDialog {...dialogProps} />

      {postponeSessionId !== null && (
        <PostponeModal
          sessionId={postponeSessionId}
          isOpen
          onClose={() => setPostponeSessionId(null)}
        />
      )}
    </div>
  )
}
