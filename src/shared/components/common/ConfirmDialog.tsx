import { useEffect } from 'react'
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react'
import { useFocusTrap } from '@/shared/hooks/useFocusTrap'
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
  const panelRef = useFocusTrap<HTMLDivElement>(isOpen)

  // Escape cerraba el Modal base pero no éste: dos diálogos que se ven igual y
  // responden distinto al teclado. Mientras la acción está en vuelo no se cierra
  // (igual que el botón Cancelar, que se deshabilita).
  useEffect(() => {
    if (!isOpen || isLoading) return
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onEscape)
    return () => document.removeEventListener('keydown', onEscape)
  }, [isOpen, isLoading, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="confirm-dialog-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-500/75 transition-opacity"
        onClick={isLoading ? undefined : onCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={panelRef}
          tabIndex={-1}
          className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all"
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                {variantIcons[variant]}
              </div>
              <div className="flex-1">
                <h3
                  className="text-lg font-semibold text-gray-900"
                  id="confirm-dialog-title"
                >
                  {title}
                </h3>
                {/* whitespace-pre-line: hay mensajes con \n\n cuya aclaración
                    (p.ej. el batch de usuarios) salía pegada en una línea. */}
                <p className="mt-2 whitespace-pre-line text-sm text-gray-600">{message}</p>
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
