import { useState } from 'react'
import { Button } from '../ui/Button'
import { FormFieldControlled } from '../form/FormFieldControlled'

export interface PromptDialogProps {
  isOpen: boolean
  title: string
  message: string
  inputLabel?: string
  inputPlaceholder?: string
  confirmLabel?: string
  cancelLabel?: string
  isLoading?: boolean
  onConfirm: (value: string) => void
  onCancel: () => void
}

export function PromptDialog({
  isOpen,
  title,
  message,
  inputLabel,
  inputPlaceholder = '',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isLoading = false,
  onConfirm,
  onCancel,
}: PromptDialogProps) {
  const [value, setValue] = useState('')

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm(value)
    setValue('')
  }

  const handleCancel = () => {
    onCancel()
    setValue('')
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-500/75 transition-opacity"
        onClick={handleCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
          <div className="p-6">
            <h3
              className="text-lg font-semibold text-gray-900"
              id="modal-title"
            >
              {title}
            </h3>
            <p className="mt-2 text-sm text-gray-600">{message}</p>

            <div className="mt-4">
              <FormFieldControlled
                label={inputLabel || ''}
                name="prompt-input"
                value={value}
                onChange={setValue}
                placeholder={inputPlaceholder}
                autoFocus
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
            <Button
              onClick={handleConfirm}
              isLoading={isLoading}
              loadingText="Procesando..."
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
