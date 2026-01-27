import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/shared/utils/cn'
import type { Subject, Degree, SubjectStatus } from '../../types/admin.types'

const createSubjectSchema = z.object({
  code: z
    .string()
    .min(1, 'El código es requerido')
    .regex(
      /^[A-Z]{3}\d{3}$/,
      'El código debe ser 3 letras mayúsculas seguidas de 3 dígitos (ej: ING101)'
    ),
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  degree: z.enum(['INGENIERIA_INFORMATICA', 'INGENIERIA_INDUSTRIAL'] as const, {
    message: 'Selecciona un grado',
  }),
})

const updateSubjectSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
})

type CreateSubjectFormData = z.infer<typeof createSubjectSchema>
type UpdateSubjectFormData = z.infer<typeof updateSubjectSchema>

interface SubjectFormProps {
  subject?: Subject
  onSubmit: (data: CreateSubjectFormData | UpdateSubjectFormData) => void
  isSubmitting?: boolean
  error?: Error | null
  onCancel?: () => void
}

const degreeOptions: { value: Degree; label: string }[] = [
  { value: 'INGENIERIA_INFORMATICA', label: 'Ingeniería Informática' },
  { value: 'INGENIERIA_INDUSTRIAL', label: 'Ingeniería Industrial' },
]

const statusOptions: { value: SubjectStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Activa' },
  { value: 'INACTIVE', label: 'Inactiva' },
  { value: 'ARCHIVED', label: 'Archivada' },
]

export function SubjectForm({
  subject,
  onSubmit,
  isSubmitting,
  error,
  onCancel,
}: SubjectFormProps) {
  const isEditing = !!subject

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSubjectFormData>({
    resolver: zodResolver(isEditing ? updateSubjectSchema : createSubjectSchema) as any,
    defaultValues: subject
      ? {
          name: subject.name,
        }
      : undefined,
  })

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Code (readonly) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Código
          </label>
          <input
            type="text"
            value={subject.code}
            disabled
            className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            El código no se puede modificar
          </p>
        </div>

        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className={cn(
              'mt-1 block w-full rounded-md border px-3 py-2 text-sm',
              'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
              errors.name ? 'border-red-500' : 'border-gray-300'
            )}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Degree (readonly) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Grado
          </label>
          <input
            type="text"
            value={
              degreeOptions.find((d) => d.value === subject.degree)?.label ??
              subject.degree
            }
            disabled
            className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            El grado no se puede modificar
          </p>
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Estado
          </label>
          <select
            id="status"
            {...register('status' as keyof CreateSubjectFormData)}
            defaultValue={subject.status}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3">
            <p className="text-sm text-red-700">
              {error.message || 'Error al guardar la asignatura'}
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
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Code */}
      <div>
        <label
          htmlFor="code"
          className="block text-sm font-medium text-gray-700"
        >
          Código
        </label>
        <input
          type="text"
          id="code"
          {...register('code')}
          placeholder="ING101"
          className={cn(
            'mt-1 block w-full rounded-md border px-3 py-2 text-sm font-mono uppercase',
            'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
            errors.code ? 'border-red-500' : 'border-gray-300'
          )}
        />
        <p className="mt-1 text-xs text-gray-500">
          3 letras mayúsculas + 3 dígitos (ej: ING101, MAT201)
        </p>
        {errors.code && (
          <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
        )}
      </div>

      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Nombre
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          placeholder="Programación I"
          className={cn(
            'mt-1 block w-full rounded-md border px-3 py-2 text-sm',
            'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
            errors.name ? 'border-red-500' : 'border-gray-300'
          )}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Degree */}
      <div>
        <label
          htmlFor="degree"
          className="block text-sm font-medium text-gray-700"
        >
          Grado
        </label>
        <select
          id="degree"
          {...register('degree')}
          className={cn(
            'mt-1 block w-full rounded-md border px-3 py-2 text-sm',
            'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
            errors.degree ? 'border-red-500' : 'border-gray-300'
          )}
        >
          <option value="">Selecciona un grado</option>
          {degreeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.degree && (
          <p className="mt-1 text-sm text-red-600">{errors.degree.message}</p>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-700">
            {error.message || 'Error al crear la asignatura'}
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
          {isSubmitting ? 'Creando...' : 'Crear asignatura'}
        </button>
      </div>
    </form>
  )
}
