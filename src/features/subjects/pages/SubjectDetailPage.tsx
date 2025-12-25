import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSubject, useGroupsBySubject } from '../hooks/useSubjects'
import { useEnroll } from '@/features/enrollments/hooks/useEnrollments'
import { useAuthStore } from '@/features/auth/store/authStore'
import { GroupCard } from '../components/GroupCard'
import type { Group } from '../types/subject.types'
import { cn } from '@/shared/utils/cn'

const degreeLabels: Record<string, string> = {
  INGENIERIA_INFORMATICA: 'Ingeniería Informática',
  INGENIERIA_INDUSTRIAL: 'Ingeniería Industrial',
}

export function SubjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const subjectId = Number(id)

  const user = useAuthStore((state) => state.user)
  const { data: subject, isLoading: isLoadingSubject, error: subjectError } = useSubject(subjectId)
  const { data: groupsData, isLoading: isLoadingGroups } = useGroupsBySubject(subjectId, 'OPEN')
  const enrollMutation = useEnroll()

  const groups = groupsData?.content ?? []

  const handleEnroll = async (group: Group) => {
    if (!user?.id) return

    try {
      await enrollMutation.mutateAsync({
        studentId: user.id,
        groupId: group.id,
      })
      navigate('/enrollments')
    } catch (error) {
      console.error('Error enrolling:', error)
    }
  }

  if (isLoadingSubject) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    )
  }

  if (subjectError || !subject) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          No se encontró la asignatura solicitada.
        </div>
        <Link to="/subjects" className="text-blue-600 hover:underline">
          Volver a asignaturas
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/subjects" className="hover:text-blue-600">
          Asignaturas
        </Link>
        <span>/</span>
        <span className="text-gray-900">{subject.code}</span>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{subject.name}</h1>
            <p className="mt-1 text-gray-500">{subject.code}</p>
          </div>
          <span
            className={cn(
              'rounded-full px-3 py-1 text-sm font-medium',
              subject.active
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            )}
          >
            {subject.active ? 'Activa' : 'Inactiva'}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"
              />
            </svg>
            <span>{degreeLabels[subject.degree] || subject.degree}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
              />
            </svg>
            <span>{subject.currentGroupCount} grupo{subject.currentGroupCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Grupos Disponibles</h2>
          {isLoadingGroups && (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
          )}
        </div>

        {enrollMutation.isError && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
            Error al inscribirse. Por favor, intenta de nuevo.
          </div>
        )}

        {groups.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onEnroll={handleEnroll}
                isEnrolling={enrollMutation.isPending}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-gray-500">
              No hay grupos disponibles para esta asignatura en este momento.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
