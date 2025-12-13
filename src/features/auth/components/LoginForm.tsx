import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../hooks/useAuth'
import { cn } from '@/shared/utils/cn'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const { login, isLoggingIn, loginError } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    login(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          autoComplete="email"
          className={cn(
            'mt-1 block w-full rounded-md border px-3 py-2 shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            errors.email ? 'border-red-500' : 'border-gray-300'
          )}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Contraseña
        </label>
        <input
          {...register('password')}
          type="password"
          id="password"
          autoComplete="current-password"
          className={cn(
            'mt-1 block w-full rounded-md border px-3 py-2 shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            errors.password ? 'border-red-500' : 'border-gray-300'
          )}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {loginError && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-700">
            {loginError instanceof Error
              ? loginError.message
              : 'Error al iniciar sesión'}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoggingIn}
        className={cn(
          'w-full rounded-md bg-blue-600 px-4 py-2 text-white',
          'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
      >
        {isLoggingIn ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
    </form>
  )
}
