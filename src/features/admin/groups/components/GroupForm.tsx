import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/shared/utils/cn'
import { adminApi } from '../../services/adminApi'
import type { Group, GroupType, GroupStatus } from '../../types/admin.types'

const createGroupSchema = z.object({
  subjectId: z.number({ message: 'Selecciona una asignatura' }).min(1),
  teacherId: z.number({ message: 'Selecciona un profesor' }).min(1),
  type: z.enum(['REGULAR_Q1', 'INTENSIVE_Q1', 'REGULAR_Q2', 'INTENSIVE_Q2'] as const, {
    message: 'Selecciona un tipo',
  }),
  capacity: z.number().min(1).optional(),
  pricePerHour: z.number().min(0.01).optional(),
})

const updateGroupSchema = z.object({
  status: z.enum(['OPEN', 'CLOSED', 'CANCELLED']).optional(),
  capacity: z.number().min(1).optional(),
})

type CreateGroupFormData = z.infer<typeof createGroupSchema>
type UpdateGroupFormData = z.infer<typeof updateGroupSchema>

interface GroupFormProps {
  group?: Group
  onSubmit: (data: CreateGroupFormData | UpdateGroupFormData) => void
  isSubmitting?: boolean
  error?: Error | null
  onCancel?: () => void
}

export function GroupForm({
  group,
  onSubmit,
  isSubmitting,
  error,
  onCancel,
}: GroupFormProps) {
  const isEditing = !!group
  const [subjectSearch, setSubjectSearch] = useState('')
  const [teacherSearch, setTeacherSearch] = useState('')

  // Fetch subjects
  const { data: subjectsData, isLoading: isLoadingSubjects } = useQuery({
    queryKey: ['admin', 'subjects', { size: 100 }],
    queryFn: () => adminApi.getSubjects({ size: 100 }),
    enabled: !isEditing,
  })

  // Fetch teachers
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
  } = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema) as any,
    defaultValues: group
      ? {
          capacity: group.capacity ?? undefined,
        }
      : undefined,
  })

  const selectedSubjectId = watch('subjectId')
  const selectedTeacherId = watch('teacherId')

  const subjects = subjectsData?.content ?? []
  const teachers = teachersData?.content ?? []

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Status (only for editing) */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Estado
          </label>
          <select
            id="status"
            {...register('status' as keyof CreateGroupFormData)}
            defaultValue={group.status}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="OPEN">Abierto</option>
            <option value="CLOSED">Cerrado</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
        </div>

        {/* Capacity */}
        <div>
          <label
            htmlFor="capacity"
            className="block text-sm font-medium text-gray-700"
          >
            Capacidad personalizada (opcional)
          </label>
          <input
            type="number"
            id="capacity"
            min={1}
            {...register('capacity', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder={`Default: ${group.maxCapacity}`}
          />
          <p className="mt-1 text-xs text-gray-500">
            Deja vacío para usar la capacidad por defecto
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3">
            <p className="text-sm text-red-700">
              {error.message || 'Error al guardar el grupo'}
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
      {/* Subject Selection */}
      <div>
        <label
          htmlFor="subjectSearch"
          className="block text-sm font-medium text-gray-700"
        >
          Asignatura
        </label>
        <input
          type="text"
          id="subjectSearch"
          placeholder="Buscar asignatura..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={subjectSearch}
          onChange={(e) => setSubjectSearch(e.target.value)}
        />
        <div className="mt-2 max-h-48 overflow-y-auto rounded-md border border-gray-200">
          {isLoadingSubjects ? (
            <div className="p-3 text-center text-sm text-gray-500">Cargando...</div>
          ) : subjects.length === 0 ? (
            <div className="p-3 text-center text-sm text-gray-500">No hay asignaturas</div>
          ) : (
            subjects
              .filter((s) =>
                subjectSearch
                  ? s.name?.toLowerCase().includes(subjectSearch.toLowerCase()) ||
                    s.code?.toLowerCase().includes(subjectSearch.toLowerCase())
                  : true
              )
              .map((subject) => (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => setValue('subjectId', subject.id)}
                  className={cn(
                    'flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50',
                    selectedSubjectId === subject.id && 'bg-blue-50 text-blue-700'
                  )}
                >
                  <div>
                    <div className="font-medium">{subject.name}</div>
                    <div className="text-gray-500">{subject.code}</div>
                  </div>
                  {selectedSubjectId === subject.id && (
                    <span className="text-blue-600">✓</span>
                  )}
                </button>
              ))
          )}
        </div>
        <input type="hidden" {...register('subjectId', { valueAsNumber: true })} />
        {errors.subjectId && (
          <p className="mt-1 text-sm text-red-600">{errors.subjectId.message}</p>
        )}
      </div>

      {/* Teacher Selection */}
      <div>
        <label
          htmlFor="teacherSearch"
          className="block text-sm font-medium text-gray-700"
        >
          Profesor
        </label>
        <input
          type="text"
          id="teacherSearch"
          placeholder="Buscar profesor..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={teacherSearch}
          onChange={(e) => setTeacherSearch(e.target.value)}
        />
        <div className="mt-2 max-h-48 overflow-y-auto rounded-md border border-gray-200">
          {isLoadingTeachers ? (
            <div className="p-3 text-center text-sm text-gray-500">Cargando...</div>
          ) : teachers.length === 0 ? (
            <div className="p-3 text-center text-sm text-gray-500">No hay profesores</div>
          ) : (
            teachers.map((teacher) => (
              <button
                key={teacher.id}
                type="button"
                onClick={() => setValue('teacherId', teacher.id)}
                className={cn(
                  'flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50',
                  selectedTeacherId === teacher.id && 'bg-blue-50 text-blue-700'
                )}
              >
                <div>
                  <div className="font-medium">{teacher.fullName}</div>
                  <div className="text-gray-500">{teacher.email}</div>
                </div>
                {selectedTeacherId === teacher.id && (
                  <span className="text-blue-600">✓</span>
                )}
              </button>
            ))
          )}
        </div>
        <input type="hidden" {...register('teacherId', { valueAsNumber: true })} />
        {errors.teacherId && (
          <p className="mt-1 text-sm text-red-600">{errors.teacherId.message}</p>
        )}
      </div>

      {/* Type */}
      <div>
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700"
        >
          Tipo de grupo
        </label>
        <select
          id="type"
          {...register('type')}
          className={cn(
            'mt-1 block w-full rounded-md border px-3 py-2 text-sm',
            'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
            errors.type ? 'border-red-500' : 'border-gray-300'
          )}
        >
          <option value="">Selecciona un tipo</option>
          <option value="REGULAR_Q1">Regular Q1 (máx. 24)</option>
          <option value="INTENSIVE_Q1">Intensivo Q1 (máx. 50)</option>
          <option value="REGULAR_Q2">Regular Q2 (máx. 24)</option>
          <option value="INTENSIVE_Q2">Intensivo Q2 (máx. 50)</option>
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>

      {/* Capacity (optional) */}
      <div>
        <label
          htmlFor="capacity"
          className="block text-sm font-medium text-gray-700"
        >
          Capacidad personalizada (opcional)
        </label>
        <input
          type="number"
          id="capacity"
          min={1}
          {...register('capacity', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Dejar vacío para usar el default"
        />
      </div>

      {/* Price per hour (optional) */}
      <div>
        <label
          htmlFor="pricePerHour"
          className="block text-sm font-medium text-gray-700"
        >
          Precio por hora (opcional)
        </label>
        <input
          type="number"
          id="pricePerHour"
          min={0.01}
          step={0.01}
          {...register('pricePerHour', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Default: 15.00 €"
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-700">
            {error.message || 'Error al crear el grupo'}
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
          disabled={isSubmitting || !selectedSubjectId || !selectedTeacherId}
          className={cn(
            'rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white',
            'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
        >
          {isSubmitting ? 'Creando...' : 'Crear grupo'}
        </button>
      </div>
    </form>
  )
}
