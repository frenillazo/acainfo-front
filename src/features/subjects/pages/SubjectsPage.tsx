import { useState } from 'react'
import { useSubjects } from '../hooks/useSubjects'
import { SubjectCard } from '../components/SubjectCard'
import { LoadingState } from '@/shared/components/common/LoadingState'
import type { Degree, SubjectFilters } from '../types/subject.types'
import { cn } from '@/shared/utils/cn'

const degreeOptions: { value: Degree | ''; label: string }[] = [
  { value: '', label: 'Todas las carreras' },
  { value: 'INGENIERIA_INFORMATICA', label: 'Ingeniería Informática' },
  { value: 'INGENIERIA_INDUSTRIAL', label: 'Ingeniería Industrial' },
]

export function SubjectsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDegree, setSelectedDegree] = useState<Degree | ''>('')

  const filters: SubjectFilters = {
    searchTerm: searchTerm || undefined,
    degree: selectedDegree || undefined,
    status: 'ACTIVE',
    size: 50,
    sortBy: 'name',
    sortDirection: 'ASC',
  }

  const { data, isLoading, error } = useSubjects(filters)

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Error al cargar las asignaturas. Por favor, intenta de nuevo.
      </div>
    )
  }

  const subjects = data?.content ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Asignaturas Disponibles</h1>
        <span className="text-sm text-gray-500">{subjects.length} asignaturas</span>
      </div>

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
      </div>

      {subjects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-500">
            {searchTerm || selectedDegree
              ? 'No se encontraron asignaturas con los filtros aplicados'
              : 'No hay asignaturas disponibles'}
          </p>
        </div>
      )}
    </div>
  )
}
