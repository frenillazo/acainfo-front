import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormField } from '@/shared/components/form'
import { Button, Alert } from '@/shared/components/ui'
import type { Teacher } from '../../types/admin.types'
import { getApiErrorMessage } from '@/shared/utils/apiError'

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

interface TeacherFormBaseProps {
  isSubmitting?: boolean
  error?: Error | null
  onCancel?: () => void
}

// Props discriminadas por modo: cada página recibe el tipo exacto de su submit
// (con la unión plana, strictFunctionTypes rechaza los handlers concretos).
type TeacherFormProps = TeacherFormBaseProps &
  (
    | { teacher?: undefined; onSubmit: (data: CreateTeacherFormData) => void }
    | { teacher: Teacher; onSubmit: (data: UpdateTeacherFormData) => void }
  )

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
    resolver: zodResolver(isEditing ? updateTeacherSchema : createTeacherSchema) as unknown as Resolver<CreateTeacherFormData>,
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
        <FormField
          {...register('email')}
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
        />
      )}

      {!isEditing && (
        <FormField
          {...register('password')}
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
        />
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          {...register('firstName')}
          label="Nombre"
          type="text"
          autoComplete="given-name"
          error={errors.firstName?.message}
        />

        <FormField
          {...register('lastName')}
          label="Apellidos"
          type="text"
          autoComplete="family-name"
          error={errors.lastName?.message}
        />
      </div>

      {error && (
        <Alert
          variant="error"
          message={getApiErrorMessage(error, 'Error al guardar el profesor')}
        />
      )}

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          isLoading={isSubmitting}
          loadingText="Guardando..."
        >
          {isEditing ? 'Guardar cambios' : 'Crear profesor'}
        </Button>
      </div>
    </form>
  )
}
