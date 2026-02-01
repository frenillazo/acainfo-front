import { Link } from 'react-router-dom'
import type { Subject } from '../types/subject.types'
import { cn } from '@/shared/utils/cn'
import { Card } from '@/shared/components/ui'

interface SubjectCardProps {
  subject: Subject
}

const degreeLabels: Record<string, string> = {
  INGENIERIA_INFORMATICA: 'Ing. Informática',
  INGENIERIA_INDUSTRIAL: 'Ing. Industrial',
}

export function SubjectCard({ subject }: SubjectCardProps) {
  return (
    <Link to={`/subjects/${subject.id}`}>
      <Card
        variant="interactive"
        padding="sm"
        className={cn(!subject.active && 'border-gray-100 opacity-60')}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-gray-900">{subject.name}</h3>
          </div>
          <span
            className={cn(
              'rounded-full px-2 py-1 text-xs font-medium',
              subject.active
                ? 'bg-green-100 text-green-700'
                : subject.archived
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-yellow-100 text-yellow-700'
            )}
          >
            {subject.active ? 'Activa' : subject.archived ? 'Archivada' : 'Inactiva'}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-gray-600">{degreeLabels[subject.degree] || subject.degree}</span>
          <span className="text-gray-500">
            {subject.currentGroupCount} grupo{subject.currentGroupCount !== 1 ? 's' : ''}
          </span>
        </div>
      </Card>
    </Link>
  )
}
