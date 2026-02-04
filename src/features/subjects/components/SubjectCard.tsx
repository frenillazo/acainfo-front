import { Link } from 'react-router-dom'
import type { Subject } from '../types/subject.types'
import { cn } from '@/shared/utils/cn'
import { Card } from '@/shared/components/ui'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useCheckInterest, useMarkInterest, useRemoveInterest } from '@/features/group-requests/hooks/useGroupRequests'
import { HandMetal } from 'lucide-react'

interface SubjectCardProps {
  subject: Subject
}

const degreeLabels: Record<string, string> = {
  INGENIERIA_INFORMATICA: 'Ing. Informática',
  INGENIERIA_INDUSTRIAL: 'Ing. Industrial',
}

export function SubjectCard({ subject }: SubjectCardProps) {
  const user = useAuthStore((state) => state.user)
  const userId = user?.id ?? 0

  const { data: isInterested, isLoading: isCheckingInterest } = useCheckInterest(subject.id, userId)
  const markInterestMutation = useMarkInterest()
  const removeInterestMutation = useRemoveInterest()

  const isToggling = markInterestMutation.isPending || removeInterestMutation.isPending

  const handleToggleInterest = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!userId || isToggling) return

    if (isInterested) {
      removeInterestMutation.mutate({ subjectId: subject.id, studentId: userId })
    } else {
      markInterestMutation.mutate({ subjectId: subject.id, requesterId: userId })
    }
  }

  return (
    <Link to={`/dashboard/subjects/${subject.id}`}>
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
            {subject.active ? 'Disponible' : subject.archived ? 'Archivada' : 'Inactiva'}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-gray-600">{degreeLabels[subject.degree] || subject.degree}</span>
          <div className="flex items-center gap-3">
            <span className="text-gray-500">
              {subject.currentGroupCount} grupo{subject.currentGroupCount !== 1 ? 's' : ''}
            </span>
            <button
              onClick={handleToggleInterest}
              disabled={isToggling || isCheckingInterest}
              className={cn(
                'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-colors',
                isInterested
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600',
                (isToggling || isCheckingInterest) && 'opacity-50 cursor-not-allowed'
              )}
              title={isInterested ? 'Quitar interés' : 'Marcar interés'}
            >
              <HandMetal
                className={cn('h-3.5 w-3.5', isInterested && 'fill-current')}
              />
              Me renta
            </button>
          </div>
        </div>
      </Card>
    </Link>
  )
}
