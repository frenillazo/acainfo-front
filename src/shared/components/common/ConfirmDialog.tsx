import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react'
import { Button, type ButtonVariant } from '../ui/Button'

export interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info' | 'primary'
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

const variantToButtonVariant: Record<'danger' | 'warning' | 'info' | 'primary', ButtonVariant> = {
  danger: 'danger',
  warning: 'warning',
  info: 'primary',
  primary: 'primary',
}

const variantIcons = {
  danger: <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />,
  warning: <AlertCircle className="h-6 w-6 text-yellow-600" aria-hidden="true" />,
  info: <Info className="h-6 w-6 text-blue-600" aria-hidden="true" />,
  primary: <CheckCircle className="h-6 w-6 text-green-600" aria-hidden="true" />,
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null

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
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                {variantIcons[variant]}
              </div>
              <div className="flex-1">
                <h3
                  className="text-lg font-semibold text-gray-900"
                  id="modal-title"
                >
                  {title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{message}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <Button
              variant="secondary"
              onClick={onCancel}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
            <Button
              variant={variantToButtonVariant[variant]}
              onClick={onConfirm}
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
