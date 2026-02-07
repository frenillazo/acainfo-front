import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authApi } from '../services/authApi'
import { FormField } from '@/shared/components/form'
import { Button, Alert } from '@/shared/components/ui'

const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalido'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setStatus('loading')
    setErrorMessage('')

    try {
      await authApi.requestPasswordReset(data.email)
      setStatus('success')
    } catch (error: unknown) {
      setStatus('error')
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } }
        setErrorMessage(
          axiosError.response?.data?.message ||
            'Error al enviar el correo de recuperacion'
        )
      } else {
        setErrorMessage('Error al enviar el correo de recuperacion')
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
            Recuperar contrasena
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Introduce tu email y te enviaremos un enlace para restablecer tu contrasena
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Revisa tu correo
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Si el email esta registrado, recibiras un enlace para restablecer tu
                contrasena. Revisa tambien la carpeta de spam.
              </p>
              <Link
                to="/login"
                className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
              >
                Volver al inicio de sesion
              </Link>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  {...register('email')}
                  label="Email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@email.com"
                  error={errors.email?.message}
                />

                {status === 'error' && (
                  <Alert variant="error" message={errorMessage} />
                )}

                <Button
                  type="submit"
                  isLoading={status === 'loading'}
                  loadingText="Enviando..."
                  fullWidth
                >
                  Enviar enlace de recuperacion
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
