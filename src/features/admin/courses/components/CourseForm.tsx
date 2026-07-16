import { useState } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi'
import { FormField, FormSelect, SearchableList } from '@/shared/components/form'
import { Button, Alert } from '@/shared/components/ui'
import type { Course } from '../../types/admin.types'
import { getApiErrorMessage } from '@/shared/utils/apiError'

// Helper: yyyy-MM-dd today + N months
function todayPlusMonths(months: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() + months)
  return d.toISOString().slice(0, 10)
}

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Fecha en formato yyyy-MM-dd' })

// Empty inputs -> undefined (optional numeric fields)
const optionalNumber = (v: unknown) =>
  v === '' || v === null || v === undefined || Number.isNaN(v) ? undefined : Number(v)

const createCourseSchema = z
  .object({
    subjectId: z.number({ message: 'Selecciona una asignatura' }).min(1),
    teacherId: z.number().min(1).optional(),
    startDate: isoDate,
    endDate: isoDate,
    capacity: z.preprocess(optionalNumber, z.number().min(1).optional()),
    pricePerMonth: z.preprocess(optionalNumber, z.number().min(0.01).optional()),
  })
  .refine((d) => d.endDate >= d.startDate, {
    path: ['endDate'],
    message: 'La fecha fin debe ser igual o posterior a la fecha de inicio',
  })

const updateCourseSchema = z
  .object({
    status: z.enum(['OPEN', 'CLOSED', 'CANCELLED']).optional(),
    capacity: z.preprocess(optionalNumber, z.number().min(1).optional()),
    pricePerMonth: z.preprocess(optionalNumber, z.number().min(0.01).optional()),
    startDate: isoDate.optional(),
    endDate: isoDate.optional(),
  })
  .refine(
    (d) => !d.startDate || !d.endDate || d.endDate >= d.startDate,
    { path: ['endDate'], message: 'La fecha fin debe ser igual o posterior a la fecha de inicio' }
  )

type CreateCourseFormData = z.infer<typeof createCourseSchema>
type UpdateCourseFormData = z.infer<typeof updateCourseSchema>

interface CourseFormBaseProps {
  isSubmitting?: boolean
  error?: Error | null
  onCancel?: () => void
}

// Props discriminadas por modo: cada página recibe el tipo exacto de su submit
// (con la unión plana, strictFunctionTypes rechaza los handlers concretos).
type CourseFormProps = CourseFormBaseProps &
  (
    | { course?: undefined; onSubmit: (data: CreateCourseFormData) => void }
    | { course: Course; onSubmit: (data: UpdateCourseFormData) => void }
  )

const statusOptions = [
  { value: 'OPEN', label: 'Abierto' },
  { value: 'CLOSED', label: 'Cerrado' },
  { value: 'CANCELLED', label: 'Cancelado' },
]

export function CourseForm({
  course,
  onSubmit,
  isSubmitting,
  error,
  onCancel,
}: CourseFormProps) {
  const isEditing = !!course
  const [subjectSearch, setSubjectSearch] = useState('')
  const [teacherSearch, setTeacherSearch] = useState('')

  const { data: subjectsData, isLoading: isLoadingSubjects } = useQuery({
    queryKey: ['admin', 'subjects', { size: 100 }],
    queryFn: () => adminApi.getSubjects({ size: 100 }),
    enabled: !isEditing,
  })

  const { data: teachersData, isLoading: isLoadingTeachers } = useQuery({
    queryKey: ['admin', 'teachers', { size: 100, searchTerm: teacherSearch }],
    queryFn: () => adminApi.getTeachers({ size: 100, searchTerm: teacherSearch || undefined }),
    enabled: !isEditing,
  })

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateCourseFormData>({
    resolver: zodResolver(isEditing ? updateCourseSchema : createCourseSchema) as Resolver<CreateCourseFormData>,
    defaultValues: course
      ? {
          capacity: course.capacity ?? undefined,
          pricePerMonth: course.pricePerMonth ?? undefined,
          startDate: course.startDate ?? undefined,
          endDate: course.endDate ?? undefined,
        }
      : {
          startDate: todayPlusMonths(0),
          endDate: todayPlusMonths(4),
        },
  })

  const selectedSubjectId = useWatch({ control, name: 'subjectId' })
  const selectedTeacherId = useWatch({ control, name: 'teacherId' })

  const subjects = subjectsData?.content ?? []
  const teachers = teachersData?.content ?? []

  const subjectItems = subjects.map((s) => ({
    id: s.id,
    primary: s.name,
    secondary: s.code,
  }))

  const teacherItems = teachers.map((t) => ({
    id: t.id,
    primary: t.fullName,
    secondary: t.email,
  }))

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormSelect
          {...register('status' as keyof CreateCourseFormData)}
          label="Estado"
          options={statusOptions}
          defaultValue={course.status}
        />

        <FormField
          {...register('capacity')}
          label="Capacidad (opcional)"
          type="number"
          min={1}
          placeholder="Sin límite"
          helperText="Sin límite = virtual/dual"
        />

        <FormField
          {...register('pricePerMonth')}
          label="Precio/mes (€)"
          type="number"
          min={0.01}
          step={0.01}
          placeholder="Opcional, solo informativo"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            {...register('startDate')}
            label="Fecha inicio"
            type="date"
            error={errors.startDate?.message}
          />
          <FormField
            {...register('endDate')}
            label="Fecha fin"
            type="date"
            error={errors.endDate?.message}
            helperText="Las sesiones nunca se generarán después de esta fecha"
          />
        </div>

        {error && (
          <Alert
            variant="error"
            message={getApiErrorMessage(error, 'Error al guardar el curso')}
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
      <SearchableList
        label="Asignatura"
        placeholder="Buscar asignatura..."
        items={subjectItems}
        selectedId={selectedSubjectId}
        onSelect={(id) => setValue('subjectId', id as number)}
        isLoading={isLoadingSubjects}
        error={errors.subjectId?.message}
        emptyMessage="No hay asignaturas"
        searchValue={subjectSearch}
        onSearchChange={setSubjectSearch}
      />
      <input type="hidden" {...register('subjectId', { valueAsNumber: true })} />

      <SearchableList
        label="Profesor (opcional)"
        placeholder="Buscar profesor..."
        items={teacherItems}
        selectedId={selectedTeacherId}
        onSelect={(id) => setValue('teacherId', id as number)}
        isLoading={isLoadingTeachers}
        error={errors.teacherId?.message}
        emptyMessage="No hay profesores"
        searchValue={teacherSearch}
        onSearchChange={setTeacherSearch}
      />
      <input type="hidden" {...register('teacherId', { valueAsNumber: true })} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          {...register('startDate')}
          label="Fecha inicio"
          type="date"
          error={errors.startDate?.message}
        />
        <FormField
          {...register('endDate')}
          label="Fecha fin"
          type="date"
          error={errors.endDate?.message}
          helperText="Las sesiones nunca se generarán después de esta fecha"
        />
      </div>

      <FormField
        {...register('capacity')}
        label="Capacidad (opcional)"
        type="number"
        min={1}
        placeholder="Sin límite"
        helperText="Sin límite = virtual/dual"
      />

      <FormField
        {...register('pricePerMonth')}
        label="Precio/mes (€)"
        type="number"
        min={0.01}
        step={0.01}
        placeholder="Opcional, solo informativo"
      />

      {error && (
        <Alert
          variant="error"
          message={getApiErrorMessage(error, 'Error al crear el curso')}
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
          disabled={!selectedSubjectId}
          isLoading={isSubmitting}
          loadingText="Creando..."
        >
          Crear curso
        </Button>
      </div>
    </form>
  )
}
