import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi'
import { SearchableList } from '@/shared/components/form'
import { Button, Alert } from '@/shared/components/ui'

const enrollmentSchema = z.object({
  studentId: z.number({ message: 'Selecciona un estudiante' }).min(1, 'Selecciona un estudiante'),
  groupId: z.number({ message: 'Selecciona un grupo' }).min(1, 'Selecciona un grupo'),
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

  const studentItems = students.map((s) => ({
    id: s.id,
    primary: s.fullName,
    secondary: s.email,
  }))

  const groupItems = groups
    .filter((group) =>
      groupSearch
        ? group.subjectName?.toLowerCase().includes(groupSearch.toLowerCase()) ||
          group.type?.toLowerCase().includes(groupSearch.toLowerCase())
        : true
    )
    .map((g) => ({
      id: g.id,
      primary: `${g.subjectName} - ${g.type}`,
      secondary: `Profesor: ${g.teacherName} | Capacidad: ${g.currentEnrollmentCount}/${g.maxCapacity}`,
    }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <SearchableList
        label="Estudiante"
        placeholder="Buscar estudiante por nombre o email..."
        items={studentItems}
        selectedId={selectedStudentId}
        onSelect={(id) => setValue('studentId', id as number)}
        isLoading={isLoadingStudents}
        error={errors.studentId?.message}
        emptyMessage="No se encontraron estudiantes"
        searchValue={studentSearch}
        onSearchChange={setStudentSearch}
      />
      <input type="hidden" {...register('studentId', { valueAsNumber: true })} />

      <SearchableList
        label="Grupo"
        placeholder="Buscar grupo..."
        items={groupItems}
        selectedId={selectedGroupId}
        onSelect={(id) => setValue('groupId', id as number)}
        isLoading={isLoadingGroups}
        error={errors.groupId?.message}
        emptyMessage="No se encontraron grupos"
        searchValue={groupSearch}
        onSearchChange={setGroupSearch}
      />
      <input type="hidden" {...register('groupId', { valueAsNumber: true })} />

      {error && (
        <Alert
          variant="error"
          message={error.message || 'Error al crear la inscripción'}
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
          disabled={!selectedStudentId || !selectedGroupId}
          isLoading={isSubmitting}
          loadingText="Creando..."
        >
          Crear inscripción
        </Button>
      </div>
    </form>
  )
}
