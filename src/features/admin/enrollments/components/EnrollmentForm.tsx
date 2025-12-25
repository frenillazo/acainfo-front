import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/shared/utils/cn'
import { adminApi } from '../../services/adminApi'

const enrollmentSchema = z.object({
  studentId: z.number({ required_error: 'Selecciona un estudiante' }).min(1, 'Selecciona un estudiante'),
  groupId: z.number({ required_error: 'Selecciona un grupo' }).min(1, 'Selecciona un grupo'),
})

type EnrollmentFormData = z.infer<typeof enrollmentSchema>

interface EnrollmentFormProps {
  onSubmit: (data: EnrollmentFormData) => void
  isSubmitting?: boolean
  error?: Error | null
  onCancel?: () => void
}

export function EnrollmentForm({
  onSubmit,
  isSubmitting,
  error,
  onCancel,
}: EnrollmentFormProps) {
  const [studentSearch, setStudentSearch] = useState('')
  const [groupSearch, setGroupSearch] = useState('')

  // Fetch students (users with STUDENT role)
  const { data: studentsData, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['admin', 'users', { roleType: 'STUDENT', size: 100, searchTerm: studentSearch }],
    queryFn: () => adminApi.getUsers({ roleType: 'STUDENT', size: 100, searchTerm: studentSearch || undefined }),
  })

  // Fetch groups
  const { data: groupsData, isLoading: isLoadingGroups } = useQuery({
    queryKey: ['admin', 'groups', { size: 100 }],
    queryFn: () => adminApi.getGroups({ size: 100 }),
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
  })

  const selectedStudentId = watch('studentId')
  const selectedGroupId = watch('groupId')

  const students = studentsData?.content ?? []
  const groups = groupsData?.content ?? []

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Student Selection */}
      <div>
        <label
          htmlFor="studentSearch"
          className="block text-sm font-medium text-gray-700"
        >
          Estudiante
        </label>
        <input
          type="text"
          id="studentSearch"
          placeholder="Buscar estudiante por nombre o email..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={studentSearch}
          onChange={(e) => setStudentSearch(e.target.value)}
        />
        <div className="mt-2 max-h-48 overflow-y-auto rounded-md border border-gray-200">
          {isLoadingStudents ? (
            <div className="p-3 text-center text-sm text-gray-500">Cargando...</div>
          ) : students.length === 0 ? (
            <div className="p-3 text-center text-sm text-gray-500">No se encontraron estudiantes</div>
          ) : (
            students.map((student) => (
              <button
                key={student.id}
                type="button"
                onClick={() => setValue('studentId', student.id)}
                className={cn(
                  'flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50',
                  selectedStudentId === student.id && 'bg-blue-50 text-blue-700'
                )}
              >
                <div>
                  <div className="font-medium">{student.fullName}</div>
                  <div className="text-gray-500">{student.email}</div>
                </div>
                {selectedStudentId === student.id && (
                  <span className="text-blue-600">✓</span>
                )}
              </button>
            ))
          )}
        </div>
        <input type="hidden" {...register('studentId', { valueAsNumber: true })} />
        {errors.studentId && (
          <p className="mt-1 text-sm text-red-600">{errors.studentId.message}</p>
        )}
      </div>

      {/* Group Selection */}
      <div>
        <label
          htmlFor="groupSearch"
          className="block text-sm font-medium text-gray-700"
        >
          Grupo
        </label>
        <input
          type="text"
          id="groupSearch"
          placeholder="Buscar grupo..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={groupSearch}
          onChange={(e) => setGroupSearch(e.target.value)}
        />
        <div className="mt-2 max-h-48 overflow-y-auto rounded-md border border-gray-200">
          {isLoadingGroups ? (
            <div className="p-3 text-center text-sm text-gray-500">Cargando...</div>
          ) : groups.length === 0 ? (
            <div className="p-3 text-center text-sm text-gray-500">No se encontraron grupos</div>
          ) : (
            groups
              .filter((group) =>
                groupSearch
                  ? group.subjectName?.toLowerCase().includes(groupSearch.toLowerCase()) ||
                    group.type?.toLowerCase().includes(groupSearch.toLowerCase())
                  : true
              )
              .map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setValue('groupId', group.id)}
                  className={cn(
                    'flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50',
                    selectedGroupId === group.id && 'bg-blue-50 text-blue-700'
                  )}
                >
                  <div>
                    <div className="font-medium">
                      {group.subjectName} - {group.type}
                    </div>
                    <div className="text-gray-500">
                      Profesor: {group.teacherName} | Capacidad: {group.currentEnrollments}/{group.maxCapacity}
                    </div>
                  </div>
                  {selectedGroupId === group.id && (
                    <span className="text-blue-600">✓</span>
                  )}
                </button>
              ))
          )}
        </div>
        <input type="hidden" {...register('groupId', { valueAsNumber: true })} />
        {errors.groupId && (
          <p className="mt-1 text-sm text-red-600">{errors.groupId.message}</p>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-700">
            {error.message || 'Error al crear la inscripción'}
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
          disabled={isSubmitting || !selectedStudentId || !selectedGroupId}
          className={cn(
            'rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white',
            'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
        >
          {isSubmitting ? 'Creando...' : 'Crear inscripción'}
        </button>
      </div>
    </form>
  )
}
