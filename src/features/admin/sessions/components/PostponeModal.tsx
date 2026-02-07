import { useState } from 'react'
import { usePostponeSession } from '../hooks/useAdminSessions'
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

interface PostponeModalProps {
  sessionId: number
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function PostponeModal({ sessionId, isOpen, onClose, onSuccess }: PostponeModalProps) {
  const [postponeData, setPostponeData] = useState<PostponeSessionRequest>({
    newDate: '',
  })

  const postponeMutation = usePostponeSession()

  const handlePostpone = () => {
    if (!postponeData.newDate) return
    postponeMutation.mutate(
      { id: sessionId, data: postponeData },
      {
        onSuccess: () => {
          setPostponeData({ newDate: '' })
          onClose()
          onSuccess?.()
        },
      }
    )
  }

  const handleClose = () => {
    setPostponeData({ newDate: '' })
    onClose()
  }

  if (!isOpen) return null

  return (
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
              onChange={(e) => setPostponeData({ ...postponeData, newClassroom: (e.target.value as Classroom) || undefined })}
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
              onChange={(e) => setPostponeData({ ...postponeData, newMode: (e.target.value as SessionMode) || undefined })}
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
            onClick={handleClose}
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
  )
}
