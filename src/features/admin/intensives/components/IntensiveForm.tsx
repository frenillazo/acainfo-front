import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi'
import { FormField, FormSelect, SearchableList } from '@/shared/components/form'
import { Button, Alert } from '@/shared/components/ui'
import type { Intensive } from '../types/intensive.types'

function todayPlusMonths(months: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() + months)
  return d.toISOString().slice(0, 10)
}

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Fecha en formato yyyy-MM-dd' })

const createIntensiveSchema = z
  .object({
    subjectId: z.number({ message: 'Selecciona una asignatura' }).min(1),
    teacherId: z.number({ message: 'Selecciona un profesor' }).min(1),
    startDate: isoDate,
    endDate: isoDate,
    capacity: z.number().min(1).optional(),
    pricePerHour: z.number().min(0.01).optional(),
  })
  .refine((d) => d.endDate >= d.startDate, {
    path: ['endDate'],
    message: 'La fecha fin debe ser igual o posterior a la fecha de inicio',
  })

const updateIntensiveSchema = z
  .object({
    status: z.enum(['OPEN', 'CLOSED', 'CANCELLED']).optional(),
    capacity: z.number().min(1).optional(),
    pricePerHour: z.number().min(0.01).optional(),
    startDate: isoDate.optional(),
    endDate: isoDate.optional(),
  })
  .refine(
    (d) => !d.startDate || !d.endDate || d.endDate >= d.startDate,
    { path: ['endDate'], message: 'La fecha fin debe ser igual o posterior a la fecha de inicio' }
  )

type CreateIntensiveFormData = z.infer<typeof createIntensiveSchema>
type UpdateIntensiveFormData = z.infer<typeof updateIntensiveSchema>

interface IntensiveFormProps {
  intensive?: Intensive
  onSubmit: (data: CreateIntensiveFormData | UpdateIntensiveFormData) => void
  isSubmitting?: boolean
  error?: Error | null
  onCancel?: () => void
}

const statusOptions = [
  { value: 'OPEN', label: 'Abierto' },
  { value: 'CLOSED', label: 'Cerrado' },
  { value: 'CANCELLED', label: 'Cancelado' },
]

export function IntensiveForm({
  intensive,
  onSubmit,
  isSubmitting,
  error,
  onCancel,
}: IntensiveFormProps) {
  const isEditing = !!intensive
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
    watch,
    formState: { errors },
  } = useForm<CreateIntensiveFormData>({
    resolver: zodResolver(createIntensiveSchema) as any,
    defaultValues: intensive
      ? {
          capacity: intensive.capacity ?? undefined,
          pricePerHour: intensive.pricePerHour ?? undefined,
          startDate: intensive.startDate,
          endDate: intensive.endDate,
        }
      : {
          startDate: todayPlusMonths(0),
          endDate: todayPlusMonths(1),
        },
  })

  const selectedSubjectId = watch('subjectId')
  const selectedTeacherId = watch('teacherId')

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
          {...register('status' as keyof CreateIntensiveFormData)}
          label="Estado"
          options={statusOptions}
          defaultValue={intensive.status}
        />

        <FormField
          {...register('capacity', { valueAsNumber: true })}
          label="Capacidad personalizada (opcional)"
          type="number"
          min={1}
          placeholder={`Default: ${intensive.maxCapacity}`}
          helperText="Deja vacío para usar la capacidad por defecto (50)"
        />

        <FormField
          {...register('pricePerHour', { valueAsNumber: true })}
          label="Precio por hora (opcional)"
          type="number"
          min={0.01}
          step={0.01}
          placeholder="Default: 15.00 €"
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
            helperText="Las sesiones del intensivo deben caer dentro de este rango"
          />
        </div>

        {error && <Alert variant="error" message={error.message || 'Error al guardar el intensivo'} />}

        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" isLoading={isSubmitting} loadingText="Guardando...">
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
        label="Profesor"
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
          helperText="Las sesiones del intensivo deben caer dentro de este rango"
        />
      </div>

      <FormField
        {...register('capacity', { valueAsNumber: true })}
        label="Capacidad personalizada (opcional)"
        type="number"
        min={1}
        placeholder="Dejar vacío para usar el default (50)"
      />

      <FormField
        {...register('pricePerHour', { valueAsNumber: true })}
        label="Precio por hora (opcional)"
        type="number"
        min={0.01}
        step={0.01}
        placeholder="Default: 15.00 €"
      />

      {error && <Alert variant="error" message={error.message || 'Error al crear el intensivo'} />}

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          disabled={!selectedSubjectId || !selectedTeacherId}
          isLoading={isSubmitting}
          loadingText="Creando..."
        >
          Crear intensivo
        </Button>
      </div>
    </form>
  )
}
