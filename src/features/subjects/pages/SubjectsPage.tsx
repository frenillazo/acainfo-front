import { useState, useMemo } from 'react'
import { useSubjects } from '../hooks/useSubjects'
import { SubjectCard } from '../components/SubjectCard'
import { EnrolledSubjectCard } from '../components/EnrolledSubjectCard'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import type { Degree, SubjectFilters } from '../types/subject.types'
import { cn } from '@/shared/utils/cn'
import { useEnrolledSubjectIds } from '@/features/enrollments/hooks/useEnrollments'
import { useAuthStore } from '@/features/auth/store/authStore'

const degreeOptions: { value: Degree | ''; label: string }[] = [
  { value: '', label: 'Todas las carreras' },
  { value: 'INGENIERIA_INFORMATICA', label: 'Ingeniería Informática' },
  { value: 'INGENIERIA_INDUSTRIAL', label: 'Ingeniería Industrial' },
]

const yearOptions: { value: number | ''; label: string }[] = [
  { value: '', label: 'Todos los cursos' },
  { value: 1, label: '1º Curso' },
  { value: 2, label: '2º Curso' },
  { value: 3, label: '3º Curso' },
  { value: 4, label: '4º Curso' },
]

export function SubjectsPage() {
  const user = useAuthStore((state) => state.user)

  const [searchTerm, setSearchTerm] = useState('')
  const studentDegree = user?.degree ?? null
  const [selectedDegree, setSelectedDegree] = useState<Degree | ''>(studentDegree ?? '')
  const [selectedYear, setSelectedYear] = useState<number | ''>('')

  const {
    enrolledSubjectIds,
    enrollmentsBySubjectId,
    isLoading: isLoadingEnrollments,
  } = useEnrolledSubjectIds(user?.id ?? 0)

  const filters: SubjectFilters = {
    searchTerm: searchTerm || undefined,
    degree: (studentDegree ?? selectedDegree) || undefined,
    year: selectedYear || undefined,
    status: 'ACTIVE',
    size: 50,
    sortBy: 'name',
    sortDirection: 'ASC',
  }

  const { data, isLoading, error } = useSubjects(filters)

  const { enrolledSubjects, availableSubjects } = useMemo(() => {
    const allSubjects = data?.content ?? []
    return {
      enrolledSubjects: allSubjects.filter((s) => enrolledSubjectIds.has(s.id)),
      availableSubjects: allSubjects.filter((s) => !enrolledSubjectIds.has(s.id)),
    }
  }, [data?.content, enrolledSubjectIds])

  if (isLoading || isLoadingEnrollments) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} title="Error al cargar las asignaturas" />
  }

  const hasFilters = !!(searchTerm || (!studentDegree && selectedDegree) || selectedYear)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Asignaturas</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              'w-full rounded-lg border border-gray-300 px-4 py-2 pl-10',
              'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
            )}
          />
          <svg
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>

        {studentDegree ? (
          <span className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600">
            {degreeOptions.find((o) => o.value === studentDegree)?.label ?? studentDegree}
          </span>
        ) : (
          <select
            value={selectedDegree}
            onChange={(e) => setSelectedDegree(e.target.value as Degree | '')}
            className={cn(
              'rounded-lg border border-gray-300 px-4 py-2',
              'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
            )}
          >
            {degreeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : '')}
          className={cn(
            'rounded-lg border border-gray-300 px-4 py-2',
            'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
          )}
        >
          {yearOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Enrolled subjects section */}
      {enrolledSubjects.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Mis Asignaturas</h2>
            <span className="text-sm text-gray-500">
              {enrolledSubjects.length} asignatura{enrolledSubjects.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledSubjects.map((subject) => {
              const enrollment = enrollmentsBySubjectId.get(subject.id)
              return enrollment ? (
                <EnrolledSubjectCard
                  key={subject.id}
                  subject={subject}
                  enrollment={enrollment}
                />
              ) : null
            })}
          </div>
        </div>
      )}

      {/* Separator when both sections have content */}
      {enrolledSubjects.length > 0 && availableSubjects.length > 0 && (
        <hr className="border-gray-200" />
      )}

      {/* Available subjects section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Asignaturas Disponibles</h2>
          <span className="text-sm text-gray-500">
            {availableSubjects.length} asignatura{availableSubjects.length !== 1 ? 's' : ''}
          </span>
        </div>

        {availableSubjects.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availableSubjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-gray-500">
              {hasFilters
                ? 'No se encontraron asignaturas disponibles con los filtros aplicados'
                : 'No hay asignaturas disponibles'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
