import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isFirst?: boolean
  isLast?: boolean
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isFirst,
  isLast,
  className = '',
}: PaginationProps) {
  if (totalPages <= 1) return null

  const handlePrevious = () => {
    if (!isFirst && currentPage > 0) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (!isLast && currentPage < totalPages - 1) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <div
      className={`flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm ${className}`}
    >
      <div className="text-sm text-gray-500">
        Página {currentPage + 1} de {totalPages}
      </div>
      <div className="flex gap-2">
        <button
          onClick={handlePrevious}
          disabled={isFirst ?? currentPage === 0}
          className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </button>
        <button
          onClick={handleNext}
          disabled={isLast ?? currentPage >= totalPages - 1}
          className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Página siguiente"
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
