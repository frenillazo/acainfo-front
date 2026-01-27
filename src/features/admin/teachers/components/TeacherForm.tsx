import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/shared/utils/cn'
import type { Teacher } from '../../types/admin.types'

const createTeacherSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  firstName: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
  lastName: z.string().min(1, 'Los apellidos son obligatorios').max(50, 'Máximo 50 caracteres'),
})

const updateTeacherSchema = z.object({
  firstName: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
  lastName: z.string().min(1, 'Los apellidos son obligatorios').max(50, 'Máximo 50 caracteres'),
})

type CreateTeacherFormData = z.infer<typeof createTeacherSchema>
type UpdateTeacherFormData = z.infer<typeof updateTeacherSchema>

interface TeacherFormProps {
  teacher?: Teacher
  onSubmit: (data: CreateTeacherFormData | UpdateTeacherFormData) => void
  isSubmitting?: boolean
  error?: Error | null
  onCancel?: () => void
}

export function TeacherForm({
  teacher,
  onSubmit,
  isSubmitting,
  error,
  onCancel,
}: TeacherFormProps) {
  const isEditing = !!teacher

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTeacherFormData>({
    resolver: zodResolver(isEditing ? updateTeacherSchema : createTeacherSchema) as any,
    defaultValues: teacher
      ? {
          firstName: teacher.firstName,
          lastName: teacher.lastName,
        }
      : undefined,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {!isEditing && (
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
      )}

      {!isEditing && (
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
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
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
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-700">
            {error.message || 'Error al guardar el profesor'}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white',
            'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
        >
          {isSubmitting
            ? 'Guardando...'
            : isEditing
              ? 'Guardar cambios'
              : 'Crear profesor'}
        </button>
      </div>
    </form>
  )
}
