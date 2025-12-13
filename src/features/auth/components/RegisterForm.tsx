import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../hooks/useAuth'
import { cn } from '@/shared/utils/cn'

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'Mínimo 2 caracteres'),
    lastName: z.string().min(2, 'Mínimo 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const { register: registerUser, isRegistering, registerError } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data: RegisterFormData) => {
    registerUser({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre
          </label>
          <input
            {...register('firstName')}
            type="text"
            id="firstName"
            autoComplete="given-name"
            className={cn(
              'mt-1 block w-full rounded-md border px-3 py-2 shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            )}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Apellidos
          </label>
          <input
            {...register('lastName')}
            type="text"
            id="lastName"
            autoComplete="family-name"
            className={cn(
              'mt-1 block w-full rounded-md border px-3 py-2 shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            )}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

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
          autoComplete="new-password"
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

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirmar contraseña
        </label>
        <input
          {...register('confirmPassword')}
          type="password"
          id="confirmPassword"
          autoComplete="new-password"
          className={cn(
            'mt-1 block w-full rounded-md border px-3 py-2 shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
          )}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {registerError && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-700">
            {registerError instanceof Error
              ? registerError.message
              : 'Error al registrarse'}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isRegistering}
        className={cn(
          'w-full rounded-md bg-blue-600 px-4 py-2 text-white',
          'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
      >
        {isRegistering ? 'Registrando...' : 'Registrarse'}
      </button>
    </form>
  )
}
