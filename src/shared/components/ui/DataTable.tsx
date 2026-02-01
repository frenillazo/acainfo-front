import { cn } from '@/shared/utils/cn'
import { EmptyState } from './EmptyState'

export interface Column<T> {
  key: string
  header: string
  align?: 'left' | 'center' | 'right'
  render: (item: T, index: number) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string | number
  emptyMessage?: string
  emptyDescription?: string
  onRowClick?: (item: T) => void
  rowClassName?: (item: T) => string
  isLoading?: boolean
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = 'No se encontraron resultados',
  emptyDescription,
  onRowClick,
  rowClassName,
  isLoading,
}: DataTableProps<T>) {
  if (!isLoading && data.length === 0) {
    return <EmptyState message={emptyMessage} description={emptyDescription} />
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500',
                    column.align === 'right' && 'text-right',
                    column.align === 'center' && 'text-center',
                    column.align !== 'right' && column.align !== 'center' && 'text-left'
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((item, index) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  'hover:bg-gray-50',
                  onRowClick && 'cursor-pointer',
                  rowClassName?.(item)
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'whitespace-nowrap px-6 py-4',
                      column.align === 'right' && 'text-right',
                      column.align === 'center' && 'text-center',
                      column.className
                    )}
                  >
                    {column.render(item, index)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Helper components for common cell patterns
interface TextCellProps {
  primary: string
  secondary?: string
}

export function TextCell({ primary, secondary }: TextCellProps) {
  return (
    <div>
      <div className="font-medium text-gray-900">{primary}</div>
      {secondary && <div className="text-sm text-gray-500">{secondary}</div>}
    </div>
  )
}

interface ActionsCellProps {
  children: React.ReactNode
}

export function ActionsCell({ children }: ActionsCellProps) {
  return (
    <div className="flex items-center justify-end gap-3 text-sm">{children}</div>
  )
}

interface ActionLinkProps {
  to: string
  children: React.ReactNode
}

export function ActionLink({ to, children }: ActionLinkProps) {
  // We can't import Link here to avoid circular deps, so use a native link
  // The parent component should use react-router-dom Link instead
  return (
    <a href={to} className="font-medium text-blue-600 hover:text-blue-800">
      {children}
    </a>
  )
}

interface ActionButtonProps {
  onClick: () => void
  variant?: 'primary' | 'danger' | 'warning' | 'success'
  disabled?: boolean
  children: React.ReactNode
}

const actionButtonVariants = {
  primary: 'text-blue-600 hover:text-blue-800',
  danger: 'text-red-600 hover:text-red-800',
  warning: 'text-yellow-600 hover:text-yellow-800',
  success: 'text-green-600 hover:text-green-800',
}

export function ActionButton({
  onClick,
  variant = 'primary',
  disabled,
  children,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      disabled={disabled}
      className={cn(
        'font-medium disabled:opacity-50',
        actionButtonVariants[variant]
      )}
    >
      {children}
    </button>
  )
}
