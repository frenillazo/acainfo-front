import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authApi } from '../services/authApi'
import { FormField } from '@/shared/components/form'
import { Button, Alert } from '@/shared/components/ui'

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, 'La contrasena debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma tu contrasena'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contrasenas no coinciden',
    path: ['confirmPassword'],
  })

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    token ? 'idle' : 'error'
  )
  const [errorMessage, setErrorMessage] = useState(
    token ? '' : 'Token de recuperacion no proporcionado'
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return

    setStatus('loading')
    setErrorMessage('')

    try {
      await authApi.resetPassword(token, data.newPassword)
      setStatus('success')
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', {
          state: {
            message: 'Contrasena restablecida correctamente. Ya puedes iniciar sesion.',
          },
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
        setErrorMessage('Error al restablecer la contrasena')
      }
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
          <h2 className="mt-6 text-2xl font-semibold text-gray-900">
            Restablecer contrasena
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Introduce tu nueva contrasena
          </p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow">
          {status === 'success' ? (
            <div className="text-center">
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
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Contrasena restablecida
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Tu contrasena ha sido actualizada correctamente.
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
            </div>
          ) : status === 'error' && !token ? (
            <div className="text-center">
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
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Enlace invalido
              </h3>
              <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
              <div className="mt-6 space-y-3">
                <Link
                  to="/forgot-password"
                  className="block w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Solicitar nuevo enlace
                </Link>
                <Link
                  to="/login"
                  className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Volver al inicio de sesion
                </Link>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  {...register('newPassword')}
                  label="Nueva contrasena"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Minimo 6 caracteres"
                  error={errors.newPassword?.message}
                />

                <FormField
                  {...register('confirmPassword')}
                  label="Confirmar contrasena"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repite la contrasena"
                  error={errors.confirmPassword?.message}
                />

                {status === 'error' && errorMessage && (
                  <Alert variant="error" message={errorMessage} />
                )}

                <Button
                  type="submit"
                  isLoading={status === 'loading'}
                  loadingText="Restableciendo..."
                  fullWidth
                >
                  Restablecer contrasena
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Volver al inicio de sesion
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
