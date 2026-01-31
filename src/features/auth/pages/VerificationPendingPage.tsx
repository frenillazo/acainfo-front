import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { authApi } from '../services/authApi'

export function VerificationPendingPage() {
  const location = useLocation()
  const email = location.state?.email || ''
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState<string | null>(null)
  const [resendError, setResendError] = useState<string | null>(null)

  const handleResend = async () => {
    if (!email) {
      setResendError('No se encontro el email. Por favor, intenta registrarte de nuevo.')
      return
    }

    setIsResending(true)
    setResendMessage(null)
    setResendError(null)

    try {
      await authApi.resendVerification(email)
      setResendMessage('Email de verificacion reenviado. Revisa tu bandeja de entrada.')
    } catch (error) {
      setResendError('Error al reenviar el email. Intentalo de nuevo mas tarde.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="flex flex-col items-center gap-3 group">
            <img src="/logo.png" alt="AcaInfo" className="h-20 w-20 object-contain" />
            <h1
              className="text-3xl font-semibold tracking-wide text-gray-800 group-hover:text-blue-600 transition-colors"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              AcaInfo
            </h1>
          </Link>
        </div>

        <div className="rounded-lg bg-white p-8 shadow text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-8 w-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h2 className="mt-6 text-2xl font-semibold text-gray-900">
            Verifica tu email
          </h2>

          <p className="mt-4 text-gray-600">
            Hemos enviado un email de verificacion a:
          </p>
          {email && (
            <p className="mt-2 font-medium text-gray-900">{email}</p>
          )}

          <p className="mt-4 text-sm text-gray-500">
            Haz clic en el enlace del email para activar tu cuenta.
            El enlace expirara en 24 horas.
          </p>

          <div className="mt-6 rounded-md bg-yellow-50 p-4">
            <p className="text-sm text-yellow-700">
              No olvides revisar tu carpeta de spam si no encuentras el email.
            </p>
          </div>

          {resendMessage && (
            <div className="mt-4 rounded-md bg-green-50 p-3">
              <p className="text-sm text-green-700">{resendMessage}</p>
            </div>
          )}

          {resendError && (
            <div className="mt-4 rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-700">{resendError}</p>
            </div>
          )}

          <div className="mt-6 space-y-3">
            <button
              onClick={handleResend}
              disabled={isResending || !email}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isResending ? 'Reenviando...' : 'Reenviar email de verificacion'}
            </button>

            <Link
              to="/login"
              className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Volver al inicio de sesion
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
