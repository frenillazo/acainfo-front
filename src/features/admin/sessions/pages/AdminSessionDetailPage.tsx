import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  useAdminSession,
  useStartSession,
  useCompleteSession,
  useCancelSession,
  usePostponeSession,
  useDeleteSession,
} from '../hooks/useAdminSessions'
import { SessionStatusBadge } from '../components/SessionStatusBadge'
import { SessionTypeBadge } from '../components/SessionTypeBadge'
import { SessionModeBadge } from '../components/SessionModeBadge'
import { ClassroomBadge } from '../../schedules/components/ClassroomBadge'
import { ConfirmDialog } from '@/shared/components/common/ConfirmDialog'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs'
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog'
import type { PostponeSessionRequest, Classroom, SessionMode } from '../../types/admin.types'

const CLASSROOMS: { key: Classroom; label: string }[] = [
  { key: 'AULA_PORTAL1', label: 'Aula Portal 1' },
  { key: 'AULA_PORTAL2', label: 'Aula Portal 2' },
  { key: 'AULA_VIRTUAL', label: 'Aula Virtual' },
]

const SESSION_MODES: { key: SessionMode; label: string }[] = [
  { key: 'IN_PERSON', label: 'Presencial' },
  { key: 'ONLINE', label: 'Online' },
  { key: 'DUAL', label: 'Dual' },
]

export function AdminSessionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const sessionId = id ? parseInt(id, 10) : 0

  const [showPostponeModal, setShowPostponeModal] = useState(false)
  const [postponeData, setPostponeData] = useState<PostponeSessionRequest>({
    newDate: '',
    newStartTime: '',
    newEndTime: '',
  })

  const { data: session, isLoading, error } = useAdminSession(sessionId)

  const startMutation = useStartSession()
  const completeMutation = useCompleteSession()
  const cancelMutation = useCancelSession()
  const postponeMutation = usePostponeSession()
  const deleteMutation = useDeleteSession()
  const { dialogProps, confirm } = useConfirmDialog()

  const handleStart = async () => {
    const confirmed = await confirm({
      title: 'Iniciar sesión',
      message: '¿Iniciar esta sesión?',
      confirmLabel: 'Sí, iniciar',
      variant: 'info',
    })
    if (confirmed) {
      startMutation.mutate(sessionId)
    }
  }

  const handleComplete = async () => {
    const confirmed = await confirm({
      title: 'Completar sesión',
      message: '¿Marcar esta sesión como completada?',
      confirmLabel: 'Sí, completar',
      variant: 'info',
    })
    if (confirmed) {
      completeMutation.mutate(sessionId)
    }
  }

  const handleCancel = async () => {
    const confirmed = await confirm({
      title: 'Cancelar sesión',
      message: '¿Cancelar esta sesión?',
      confirmLabel: 'Sí, cancelar',
      variant: 'warning',
    })
    if (confirmed) {
      cancelMutation.mutate(sessionId)
    }
  }

  const handlePostpone = () => {
    if (!postponeData.newDate) return
    postponeMutation.mutate(
      { id: sessionId, data: postponeData },
      {
        onSuccess: () => {
          setShowPostponeModal(false)
          setPostponeData({ newDate: '' })
        },
      }
    )
  }

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Eliminar sesión',
      message: '¿Eliminar esta sesión? Esta acción no se puede deshacer.',
      confirmLabel: 'Sí, eliminar',
      variant: 'danger',
    })
    if (confirmed) {
      deleteMutation.mutate(sessionId, {
        onSuccess: () => navigate('/admin/sessions'),
      })
    }
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (error || !session) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/sessions"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          ← Volver a sesiones
        </Link>
        <ErrorState error={error} title="Error al cargar la sesión" />
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumbs
        homeHref="/admin"
        items={[
          { label: 'Sesiones', href: '/admin/sessions' },
          { label: `Sesión #${session.id}` },
        ]}
      />

      {/* Header */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Sesion #{session.id}
              </h1>
              <SessionTypeBadge type={session.type} />
              <SessionModeBadge mode={session.mode} />
              <SessionStatusBadge status={session.status} />
            </div>
            <p className="mt-1 text-gray-500">
              {session.subjectCode} - {session.subjectName}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Lifecycle actions */}
            {session.isScheduled && (
              <>
                <button
                  onClick={handleStart}
                  disabled={startMutation.isPending}
                  className="rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-yellow-700 disabled:opacity-50"
                >
                  {startMutation.isPending ? 'Iniciando...' : 'Iniciar'}
                </button>
                <button
                  onClick={() => setShowPostponeModal(true)}
                  className="rounded-md border border-orange-300 bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-700 hover:bg-orange-100"
                >
                  Posponer
                </button>
                <button
                  onClick={handleCancel}
                  disabled={cancelMutation.isPending}
                  className="rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                >
                  {cancelMutation.isPending ? 'Cancelando...' : 'Cancelar'}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
                </button>
              </>
            )}
            {session.isInProgress && (
              <button
                onClick={handleComplete}
                disabled={completeMutation.isPending}
                className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                {completeMutation.isPending ? 'Completando...' : 'Completar'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Session Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Informacion de la Sesion
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Fecha</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(session.date)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Horario</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {session.startTime} - {session.endTime} ({session.durationMinutes} min)
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Aula</dt>
              <dd className="mt-1">
                <ClassroomBadge classroom={session.classroom} />
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Modalidad</dt>
              <dd className="mt-1">
                <SessionModeBadge mode={session.mode} />
              </dd>
            </div>
            {session.isPostponed && session.postponedToDate && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Pospuesta a</dt>
                <dd className="mt-1 text-sm text-orange-600">
                  {formatDate(session.postponedToDate)}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Subject & Group Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Asignatura y Grupo
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Asignatura</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {session.subjectName} ({session.subjectCode})
              </dd>
            </div>
            {session.hasGroup && (
              <>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Grupo</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {session.groupType ?? 'N/A'}
                  </dd>
                </div>
                <div className="pt-2">
                  <Link
                    to={`/admin/groups/${session.groupId}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Ver detalles del grupo →
                  </Link>
                </div>
              </>
            )}
            {session.teacherName && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Profesor</dt>
                <dd className="mt-1 text-sm text-gray-900">{session.teacherName}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Metadata */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Metadatos</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{session.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Tipo</dt>
              <dd className="mt-1">
                <SessionTypeBadge type={session.type} />
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Estado</dt>
              <dd className="mt-1">
                <SessionStatusBadge status={session.status} />
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Creada</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(session.createdAt).toLocaleString('es-ES')}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Actualizada</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(session.updatedAt).toLocaleString('es-ES')}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <ConfirmDialog {...dialogProps} />

      {/* Postpone Modal */}
      {showPostponeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">Posponer sesion</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nueva fecha *
                </label>
                <input
                  type="date"
                  value={postponeData.newDate}
                  onChange={(e) => setPostponeData({ ...postponeData, newDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nueva hora inicio
                  </label>
                  <input
                    type="time"
                    value={postponeData.newStartTime ?? ''}
                    onChange={(e) => setPostponeData({ ...postponeData, newStartTime: e.target.value || undefined })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nueva hora fin
                  </label>
                  <input
                    type="time"
                    value={postponeData.newEndTime ?? ''}
                    onChange={(e) => setPostponeData({ ...postponeData, newEndTime: e.target.value || undefined })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nueva aula
                </label>
                <select
                  value={postponeData.newClassroom ?? ''}
                  onChange={(e) => setPostponeData({ ...postponeData, newClassroom: e.target.value as Classroom || undefined })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">Mantener aula actual</option>
                  {CLASSROOMS.map((c) => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nuevo modo
                </label>
                <select
                  value={postponeData.newMode ?? ''}
                  onChange={(e) => setPostponeData({ ...postponeData, newMode: e.target.value as SessionMode || undefined })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">Mantener modo actual</option>
                  {SESSION_MODES.map((m) => (
                    <option key={m.key} value={m.key}>{m.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowPostponeModal(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handlePostpone}
                disabled={!postponeData.newDate || postponeMutation.isPending}
                className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
              >
                {postponeMutation.isPending ? 'Posponiendo...' : 'Posponer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
