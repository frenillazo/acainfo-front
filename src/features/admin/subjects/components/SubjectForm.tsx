import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormField, FormSelect } from '@/shared/components/form'
import { Button, Alert } from '@/shared/components/ui'
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
  year: z.coerce.number().min(1).max(4).optional(),
})

const updateSubjectSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .optional(),
  year: z.coerce.number().min(1).max(4).optional().nullable(),
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

const degreeOptions: { value: Degree | ''; label: string }[] = [
  { value: '', label: 'Selecciona un grado' },
  { value: 'INGENIERIA_INFORMATICA', label: 'Ingeniería Informática' },
  { value: 'INGENIERIA_INDUSTRIAL', label: 'Ingeniería Industrial' },
]

const statusOptions: { value: SubjectStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Activa' },
  { value: 'INACTIVE', label: 'Inactiva' },
  { value: 'ARCHIVED', label: 'Archivada' },
]

const yearOptions: { value: number | ''; label: string }[] = [
  { value: '', label: 'Sin asignar' },
  { value: 1, label: '1º Curso' },
  { value: 2, label: '2º Curso' },
  { value: 3, label: '3º Curso' },
  { value: 4, label: '4º Curso' },
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
        <FormField
          label="Código"
          value={subject.code}
          disabled
          helperText="El código no se puede modificar"
        />

        <FormField
          {...register('name')}
          label="Nombre"
          error={errors.name?.message}
        />

        <FormField
          label="Grado"
          value={
            degreeOptions.find((d) => d.value === subject.degree)?.label ??
            subject.degree
          }
          disabled
          helperText="El grado no se puede modificar"
        />

        <FormSelect
          {...register('year' as keyof CreateSubjectFormData)}
          label="Curso"
          options={yearOptions}
          defaultValue={subject.year ?? ''}
        />

        <FormSelect
          {...register('status' as keyof CreateSubjectFormData)}
          label="Estado"
          options={statusOptions}
          defaultValue={subject.status}
        />

        {error && (
          <Alert
            variant="error"
            message={error.message || 'Error al guardar la asignatura'}
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
            Guardar cambios
          </Button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        {...register('code')}
        label="Código"
        placeholder="ING101"
        className="font-mono uppercase"
        helperText="3 letras mayúsculas + 3 dígitos (ej: ING101, MAT201)"
        error={errors.code?.message}
      />

      <FormField
        {...register('name')}
        label="Nombre"
        placeholder="Programación I"
        error={errors.name?.message}
      />

      <FormSelect
        {...register('degree')}
        label="Grado"
        options={degreeOptions}
        error={errors.degree?.message}
      />

      <FormSelect
        {...register('year')}
        label="Curso (opcional)"
        options={yearOptions}
      />

      {error && (
        <Alert
          variant="error"
          message={error.message || 'Error al crear la asignatura'}
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
          loadingText="Creando..."
        >
          Crear asignatura
        </Button>
      </div>
    </form>
  )
}
