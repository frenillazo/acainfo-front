import { useEffect, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { authApi } from '../services/authApi'

type VerificationStatus = 'loading' | 'success' | 'error'

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<VerificationStatus>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setErrorMessage('Token de verificacion no proporcionado')
      return
    }

    const verifyEmail = async () => {
      try {
        await authApi.verifyEmail(token)
        setStatus('success')
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', {
            state: { message: 'Email verificado correctamente. Ya puedes iniciar sesion.' },
          })
        }, 3000)
      } catch (error: unknown) {
        setStatus('error')
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { data?: { message?: string } } }
          setErrorMessage(
            axiosError.response?.data?.message ||
              'Token invalido o expirado'
          )
        } else {
          setErrorMessage('Error al verificar el email')
        }
      }
    }

    verifyEmail()
  }, [token, navigate])

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
          {status === 'loading' && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
              </div>
              <h2 className="mt-6 text-xl font-semibold text-gray-900">
                Verificando tu email...
              </h2>
              <p className="mt-2 text-gray-600">
                Por favor, espera un momento.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="mt-6 text-xl font-semibold text-gray-900">
                Email verificado
              </h2>
              <p className="mt-2 text-gray-600">
                Tu cuenta ha sido activada correctamente.
              </p>
              <p className="mt-4 text-sm text-gray-500">
                Redirigiendo al inicio de sesion...
              </p>
              <Link
                to="/login"
                className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
              >
                Ir a iniciar sesion
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="mt-6 text-xl font-semibold text-gray-900">
                Error de verificacion
              </h2>
              <p className="mt-2 text-red-600">{errorMessage}</p>
              <p className="mt-4 text-sm text-gray-500">
                El enlace puede haber expirado o ya fue utilizado.
              </p>
              <div className="mt-6 space-y-3">
                <Link
                  to="/login"
                  className="block w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Ir a iniciar sesion
                </Link>
                <Link
                  to="/register"
                  className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Registrarse de nuevo
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
