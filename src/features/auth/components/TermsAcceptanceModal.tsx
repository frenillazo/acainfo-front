import { useState } from 'react'
import { Modal, ModalFooter } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui'
import { Alert } from '@/shared/components/ui'
import { useTerms } from '../hooks/useTerms'

/**
 * Modal that forces the user to accept the current terms and conditions.
 * Cannot be closed without accepting — no X button, no overlay click, no Escape.
 */
export function TermsAcceptanceModal() {
  const [checked, setChecked] = useState(false)
  const { acceptTerms, isAccepting, acceptError } = useTerms()

  return (
    <Modal
      isOpen={true}
      onClose={() => {}}
      title="Actualización de Términos y Condiciones"
      size="lg"
      showCloseButton={false}
      closeOnOverlayClick={false}
      closeOnEscape={false}
    >
      <div className="space-y-4">
        <p className="text-gray-700">
          Hemos actualizado nuestros Términos y Condiciones, Política de Privacidad y Política
          de Cookies. Por favor, revísalos y confirma tu aceptación para continuar utilizando
          la plataforma.
        </p>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <a
            href="/docs/terminos-y-condiciones"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Leer Términos y Condiciones, Política de Privacidad y Política de Cookies
          </a>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            He leído y acepto los Términos y Condiciones de Uso, Política de Privacidad y
            Política de Cookies. Entiendo que mis datos serán tratados conforme a lo descrito
            en dicho documento.
          </span>
        </label>

        {acceptError && (
          <Alert
            variant="error"
            message={
              acceptError instanceof Error
                ? acceptError.message
                : 'Error al aceptar los términos'
            }
          />
        )}
      </div>

      <ModalFooter>
        <Button
          onClick={acceptTerms}
          disabled={!checked}
          isLoading={isAccepting}
          loadingText="Aceptando..."
        >
          Aceptar y continuar
        </Button>
      </ModalFooter>
    </Modal>
  )
}
