import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  useInterestSummary,
  useGroupRequests,
} from '../hooks/useGroupRequests'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import type { GroupRequestFilters } from '../types/groupRequest.types'
import { Heart, Users, Eye, ArrowLeft } from 'lucide-react'
import { formatDate } from '@/shared/utils/formatters'

export function AdminGroupRequestsPage() {
  const [view, setView] = useState<'summary' | 'detail'>('summary')
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null)
  const [selectedSubjectName, setSelectedSubjectName] = useState<string>('')
  const [filters, setFilters] = useState<GroupRequestFilters>({
    page: 0,
    size: 20,
    status: 'PENDING',
  })

  const { data: summaryData, isLoading: isLoadingSummary, error: summaryError } = useInterestSummary()
  const { data: detailData, isLoading: isLoadingDetail, error: detailError } = useGroupRequests({
    ...filters,
    subjectId: selectedSubjectId ?? undefined,
  })

  const handleViewDetail = (subjectId: number, subjectName: string) => {
    setSelectedSubjectId(subjectId)
    setSelectedSubjectName(subjectName)
    setView('detail')
  }

  const handleBackToSummary = () => {
    setSelectedSubjectId(null)
    setSelectedSubjectName('')
    setView('summary')
  }

  const handlePageChange = (page: number) => {
    if (!Number.isNaN(page) && page >= 0) {
      setFilters((prev) => ({ ...prev, page }))
    }
  }

  if (summaryError && view === 'summary') {
    return <ErrorState error={summaryError} title="Error al cargar resumen de intereses" />
  }

  if (detailError && view === 'detail') {
    return <ErrorState error={detailError} title="Error al cargar alumnos interesados" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          <Heart className="inline-block h-6 w-6 mr-2 text-pink-500" />
          Alumnos Interesados
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Visualiza cuantos alumnos estan interesados en cada asignatura
        </p>
      </div>

      {view === 'summary' ? (
        // SUMMARY VIEW - Interest by subject
        <>
          {isLoadingSummary ? (
            <LoadingState />
          ) : summaryData && summaryData.length > 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asignatura
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grado
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interesados
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {summaryData.map((summary) => (
                    <tr key={summary.subjectId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {summary.subjectName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {summary.subjectCode}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {summary.degreeName || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
                          <Users className="h-4 w-4" />
                          {summary.interestedCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewDetail(summary.subjectId, summary.subjectName)}
                          className="inline-flex items-center gap-1 text-pink-600 hover:text-pink-900"
                        >
                          <Eye className="h-4 w-4" />
                          Ver alumnos
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
              <Heart className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-gray-500">No hay alumnos interesados en ninguna asignatura</p>
            </div>
          )}
        </>
      ) : (
        // DETAIL VIEW - Students interested in a specific subject
        <>
          <button
            onClick={handleBackToSummary}
            className="inline-flex items-center text-sm text-pink-600 hover:text-pink-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver al resumen
          </button>

          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900">
              Alumnos interesados en: {selectedSubjectName}
            </h2>
          </div>

          {isLoadingDetail ? (
            <LoadingState />
          ) : detailData && detailData.content.length > 0 ? (
            <>
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Alumno
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha de interes
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {detailData.content.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {request.requesterName || `Alumno #${request.requesterId}`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(request.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/admin/users/${request.requesterId}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Ver alumno
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {detailData.totalPages > 1 && (
                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
                  <div className="text-sm text-gray-500">
                    Pagina {(detailData.page ?? 0) + 1} de {detailData.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange((detailData.page ?? 0) - 1)}
                      disabled={detailData.first}
                      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => handlePageChange((detailData.page ?? 0) + 1)}
                      disabled={detailData.last}
                      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
              <p className="text-gray-500">No hay alumnos interesados en esta asignatura</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
