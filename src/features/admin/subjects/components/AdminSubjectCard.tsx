import { Link } from 'react-router-dom'
import type { Subject } from '../../types/admin.types'
import { SubjectStatusBadge } from './SubjectStatusBadge'
import { DegreeBadge } from './DegreeBadge'
import { Card } from '@/shared/components/ui'
import { Eye, Pencil, Archive, Trash2 } from 'lucide-react'

interface AdminSubjectCardProps {
  subjects: Subject[]
  onArchive?: (id: number) => void
  onDelete?: (id: number) => void
  isArchiving?: boolean
  isDeleting?: boolean
}

export function AdminSubjectCards({
  subjects,
  onArchive,
  onDelete,
  isArchiving,
  isDeleting,
}: AdminSubjectCardProps) {
  if (subjects.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-500">No se encontraron asignaturas</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {subjects.map((subject) => (
        <AdminSubjectCard
          key={subject.id}
          subject={subject}
          onArchive={onArchive}
          onDelete={onDelete}
          isArchiving={isArchiving}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  )
}

function AdminSubjectCard({
  subject,
  onArchive,
  onDelete,
  isArchiving,
  isDeleting,
}: {
  subject: Subject
  onArchive?: (id: number) => void
  onDelete?: (id: number) => void
  isArchiving?: boolean
  isDeleting?: boolean
}) {
  return (
    <Card padding="sm" variant="interactive">
      {/* Header: code + status */}
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <span className="font-mono text-xs font-medium text-gray-500">{subject.code}</span>
          <h3 className="mt-0.5 truncate font-medium text-gray-900">{subject.name}</h3>
        </div>
        <SubjectStatusBadge status={subject.status} />
      </div>

      {/* Info: degree, year, groups */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <DegreeBadge degree={subject.degree} />
        {subject.year && (
          <span className="text-xs text-gray-500">{subject.year}º Curso</span>
        )}
        <span className="ml-auto text-xs text-gray-500">
          {subject.currentGroupCount} grupo{subject.currentGroupCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-1 border-t border-gray-100 pt-3">
        <Link
          to={`/admin/subjects/${subject.id}`}
          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
        >
          <Eye className="h-3.5 w-3.5" />
          Ver
        </Link>
        <Link
          to={`/admin/subjects/${subject.id}/edit`}
          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
        >
          <Pencil className="h-3.5 w-3.5" />
          Editar
        </Link>
        {onArchive && subject.status !== 'ARCHIVED' && (
          <button
            onClick={() => onArchive(subject.id)}
            disabled={isArchiving}
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-50 disabled:opacity-50"
          >
            <Archive className="h-3.5 w-3.5" />
            Archivar
          </button>
        )}
        {onDelete && subject.currentGroupCount === 0 && (
          <button
            onClick={() => onDelete(subject.id)}
            disabled={isDeleting}
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Eliminar
          </button>
        )}
      </div>
    </Card>
  )
}
