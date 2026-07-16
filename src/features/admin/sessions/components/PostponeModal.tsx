import { useState } from 'react'
import { usePostponeSession } from '../hooks/useAdminSessions'
import type { PostponeSessionRequest, Classroom, SessionMode } from '../../types/admin.types'
import { Modal, ModalFooter } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { CLASSROOM_LABELS, SESSION_MODE_LABELS } from '@/shared/config/domainConstants'

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

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Posponer sesión">
      <div className="space-y-4">
        <div>
          <label htmlFor="postpone-date" className="block text-sm font-medium text-gray-700">
            Nueva fecha *
          </label>
          <input
            id="postpone-date"
            type="date"
            value={postponeData.newDate}
            onChange={(e) => setPostponeData({ ...postponeData, newDate: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="postpone-start" className="block text-sm font-medium text-gray-700">
              Nueva hora inicio
            </label>
            <input
              id="postpone-start"
              type="time"
              value={postponeData.newStartTime ?? ''}
              onChange={(e) => setPostponeData({ ...postponeData, newStartTime: e.target.value || undefined })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="postpone-end" className="block text-sm font-medium text-gray-700">
              Nueva hora fin
            </label>
            <input
              id="postpone-end"
              type="time"
              value={postponeData.newEndTime ?? ''}
              onChange={(e) => setPostponeData({ ...postponeData, newEndTime: e.target.value || undefined })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label htmlFor="postpone-classroom" className="block text-sm font-medium text-gray-700">
            Nueva aula
          </label>
          <select
            id="postpone-classroom"
            value={postponeData.newClassroom ?? ''}
            onChange={(e) => setPostponeData({ ...postponeData, newClassroom: (e.target.value as Classroom) || undefined })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Mantener aula actual</option>
            {Object.entries(CLASSROOM_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="postpone-mode" className="block text-sm font-medium text-gray-700">
            Nuevo modo
          </label>
          <select
            id="postpone-mode"
            value={postponeData.newMode ?? ''}
            onChange={(e) => setPostponeData({ ...postponeData, newMode: (e.target.value as SessionMode) || undefined })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Mantener modo actual</option>
            {Object.entries(SESSION_MODE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <ModalFooter className="-mx-6 -mb-6 mt-6">
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button
          variant="warning"
          onClick={handlePostpone}
          disabled={!postponeData.newDate}
          isLoading={postponeMutation.isPending}
          loadingText="Posponiendo..."
        >
          Posponer
        </Button>
      </ModalFooter>
    </Modal>
  )
}
