import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isFirst?: boolean
  isLast?: boolean
  totalElements?: number
  pageSize?: number
  className?: string
}

/**
 * Generate the list of page numbers to display.
 * Shows first, last, current, and adjacent pages with ellipsis.
 */
function getPageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i)
  }

  const pages: (number | 'ellipsis')[] = []

  // Always show first page
  pages.push(0)

  if (currentPage > 2) {
    pages.push('ellipsis')
  }

  // Pages around current
  const start = Math.max(1, currentPage - 1)
  const end = Math.min(totalPages - 2, currentPage + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (currentPage < totalPages - 3) {
    pages.push('ellipsis')
  }

  // Always show last page
  pages.push(totalPages - 1)

  return pages
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isFirst,
  isLast,
  totalElements,
  pageSize,
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

  const pageNumbers = getPageNumbers(currentPage, totalPages)

  // Calculate showing range
  const showingFrom =
    totalElements != null && pageSize != null ? currentPage * pageSize + 1 : null
  const showingTo =
    totalElements != null && pageSize != null
      ? Math.min((currentPage + 1) * pageSize, totalElements)
      : null

  return (
    <div
      className={`flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm ${className}`}
    >
      <div className="text-sm text-gray-500">
        {showingFrom != null && showingTo != null && totalElements != null ? (
          <>
            {showingFrom}-{showingTo} de {totalElements}
          </>
        ) : (
          <>
            Página {currentPage + 1} de {totalPages}
          </>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={handlePrevious}
          disabled={isFirst ?? currentPage === 0}
          className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        {/* Page numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((page, idx) =>
            page === 'ellipsis' ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 py-1.5 text-sm text-gray-400"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`min-w-[2rem] rounded-md px-2.5 py-1.5 text-sm font-medium ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
                aria-label={`Página ${page + 1}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page + 1}
              </button>
            )
          )}
        </div>

        {/* Mobile: simple page indicator */}
        <span className="sm:hidden px-2 text-sm text-gray-500">
          {currentPage + 1}/{totalPages}
        </span>

        <button
          onClick={handleNext}
          disabled={isLast ?? currentPage >= totalPages - 1}
          className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Página siguiente"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
