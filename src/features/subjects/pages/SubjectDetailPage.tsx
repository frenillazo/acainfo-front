import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSubject, useGroupsBySubject } from '../hooks/useSubjects'
import { useEnroll } from '@/features/enrollments/hooks/useEnrollments'
import { useAuthStore } from '@/features/auth/store/authStore'
import { GroupCard } from '../components/GroupCard'
import type { Group } from '../types/subject.types'
import { cn } from '@/shared/utils/cn'
import { useMaterials } from '@/features/materials/hooks/useMaterials'
import { MaterialCard } from '@/features/materials/components/MaterialCard'
import { useEffect } from 'react'
import { useGroupRequests, useAddSupporter } from '@/features/group-requests/hooks/useGroupRequests'

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

  // Group requests for this subject
  const { data: requestsData, isLoading: isLoadingRequests } = useGroupRequests({
    subjectId,
    status: 'PENDING'
  })
  const pendingRequests = requestsData?.content ?? []
  const addSupporterMutation = useAddSupporter()

  // Materials
  const {
    materials,
    isLoading: isLoadingMaterials,
    download,
    isDownloading,
    getBySubjectId,
  } = useMaterials()

  const groups = groupsData?.content ?? []

  // Load materials when subject is loaded
  useEffect(() => {
    if (subjectId) {
      getBySubjectId(subjectId)
    }
  }, [subjectId])

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

  const handleSupport = async (requestId: number) => {
    if (!user?.id) return

    try {
      await addSupporterMutation.mutateAsync({
        id: requestId,
        data: { studentId: user.id }
      })
    } catch (error) {
      console.error('Error supporting request:', error)
    }
  }

  const groupTypeLabels: Record<string, string> = {
    REGULAR_Q1: 'Regular Q1',
    REGULAR_Q2: 'Regular Q2',
    INTENSIVE_Q1: 'Intensivo Q1',
    INTENSIVE_Q2: 'Intensivo Q2',
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
          <div className="flex items-center gap-3">
            {isLoadingGroups && (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
            )}
            <Link
              to={`/group-requests/new?subjectId=${subjectId}`}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Solicitar grupo
            </Link>
          </div>
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

      {/* Pending Group Requests Section */}
      {pendingRequests.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Solicitudes de Grupo Pendientes</h2>
            {isLoadingRequests && (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
            )}
          </div>

          <div className="space-y-3">
            {pendingRequests.map((request) => {
              const isRequester = user?.id === request.requesterId
              const hasSupported = user?.id ? request.supporterIds.includes(user.id) : false
              const canSupport = !isRequester && !hasSupported

              return (
                <div
                  key={request.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                          {groupTypeLabels[request.requestedGroupType] || request.requestedGroupType}
                        </span>
                        {isRequester && (
                          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                            Tu solicitud
                          </span>
                        )}
                      </div>
                      {request.justification && (
                        <p className="mt-2 text-sm text-gray-600">{request.justification}</p>
                      )}
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                          </svg>
                          {request.supporterCount} / 8 apoyos
                        </span>
                        {request.supportersNeeded > 0 && (
                          <span className="text-amber-600">
                            Faltan {request.supportersNeeded} apoyos
                          </span>
                        )}
                        {request.hasMinimumSupporters && (
                          <span className="text-green-600 font-medium">
                            ¡Listo para revisión!
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      {canSupport && (
                        <button
                          onClick={() => handleSupport(request.id)}
                          disabled={addSupporterMutation.isPending}
                          className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                          </svg>
                          Apoyar
                        </button>
                      )}
                      {hasSupported && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600">
                          <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          Apoyado
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Materials Section */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Materiales de la Asignatura</h2>
          {isLoadingMaterials && (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
          )}
        </div>

        {materials.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {materials.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                onDownload={download}
                isDownloading={isDownloading}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-gray-500">
              No hay materiales disponibles para esta asignatura.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
