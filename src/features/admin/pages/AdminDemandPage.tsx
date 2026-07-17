import { useInterestSummary } from '@/features/subjects/hooks/useSubjectInterest'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { DataTable, PageHeader, TextCell, type Column } from '@/shared/components/ui'
import type { SubjectInterestSummary } from '@/features/subjects/types/subject.types'

export function AdminDemandPage() {
  const { data, isLoading, error } = useInterestSummary()

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} title="Error al cargar la demanda de asignaturas" />
  }

  const summary = (data ?? []).slice().sort((a, b) => b.interestedCount - a.interestedCount)

  const columns: Column<SubjectInterestSummary>[] = [
    {
      key: 'subject',
      header: 'Asignatura',
      render: (row) => <TextCell primary={row.subjectName} secondary={row.subjectCode} />,
    },
    {
      key: 'degree',
      header: 'Grado',
      render: (row) => (
        <span className="text-sm text-gray-500">{row.degreeName ?? '—'}</span>
      ),
    },
    {
      key: 'interested',
      header: 'Interesados',
      align: 'right',
      render: (row) => (
        <span className="text-sm font-semibold text-gray-900">{row.interestedCount}</span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Demanda de Asignaturas"
        subtitle={'Estudiantes que han pulsado "Me renta" en cada asignatura'}
      />

      <DataTable
        data={summary}
        columns={columns}
        keyExtractor={(row) => row.subjectId}
        emptyMessage="Ningún estudiante ha marcado interés todavía"
      />
    </div>
  )
}
