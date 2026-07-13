import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi'
import { SearchableList } from '@/shared/components/form'
import { Button, Alert } from '@/shared/components/ui'

const enrollmentSchema = z.object({
  studentId: z.number({ message: 'Selecciona un estudiante' }).min(1, 'Selecciona un estudiante'),
  courseId: z.number({ message: 'Selecciona un curso' }).min(1, 'Selecciona un curso'),
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
  const [courseSearch, setCourseSearch] = useState('')

  // Fetch students (users with STUDENT role)
  const { data: studentsData, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['admin', 'users', { roleType: 'STUDENT', size: 100, searchTerm: studentSearch }],
    queryFn: () => adminApi.getUsers({ roleType: 'STUDENT', size: 100, searchTerm: studentSearch || undefined }),
  })

  // Fetch courses
  const { data: coursesData, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['admin', 'courses', { size: 100 }],
    queryFn: () => adminApi.getCourses({ size: 100 }),
  })

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
  })

  const selectedStudentId = useWatch({ control, name: 'studentId' })
  const selectedCourseId = useWatch({ control, name: 'courseId' })

  const students = studentsData?.content ?? []
  const courses = coursesData?.content ?? []

  const studentItems = students.map((s) => ({
    id: s.id,
    primary: s.fullName,
    secondary: s.email,
  }))

  const courseItems = courses
    .filter((course) =>
      courseSearch
        ? course.subjectName?.toLowerCase().includes(courseSearch.toLowerCase()) ||
          course.name?.toLowerCase().includes(courseSearch.toLowerCase())
        : true
    )
    .map((c) => ({
      id: c.id,
      primary: `${c.subjectName} - ${c.name}`,
      secondary: `Profesor: ${c.teacherName ?? 'Sin asignar'} | Capacidad: ${c.currentEnrollmentCount}/${c.capacity ?? '∞'}`,
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
        label="Curso"
        placeholder="Buscar curso..."
        items={courseItems}
        selectedId={selectedCourseId}
        onSelect={(id) => setValue('courseId', id as number)}
        isLoading={isLoadingCourses}
        error={errors.courseId?.message}
        emptyMessage="No se encontraron cursos"
        searchValue={courseSearch}
        onSearchChange={setCourseSearch}
      />
      <input type="hidden" {...register('courseId', { valueAsNumber: true })} />

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
          disabled={!selectedStudentId || !selectedCourseId}
          isLoading={isSubmitting}
          loadingText="Creando..."
        >
          Crear inscripción
        </Button>
      </div>
    </form>
  )
}
