import { useState } from 'react'
import { cn } from '@/shared/utils/cn'
import { Check, Search } from 'lucide-react'
import { Spinner } from '../ui/Spinner'

export interface SearchableListItem {
  id: number | string
  primary: string
  secondary?: string
}

interface SearchableListProps {
  label: string
  placeholder?: string
  items: SearchableListItem[]
  selectedId?: number | string | null
  onSelect: (id: number | string) => void
  isLoading?: boolean
  error?: string
  emptyMessage?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  filterFn?: (item: SearchableListItem, search: string) => boolean
}

export function SearchableList({
  label,
  placeholder = 'Buscar...',
  items,
  selectedId,
  onSelect,
  isLoading = false,
  error,
  emptyMessage = 'No hay elementos',
  searchValue: externalSearchValue,
  onSearchChange,
  filterFn,
}: SearchableListProps) {
  const [internalSearch, setInternalSearch] = useState('')
  const searchValue = externalSearchValue ?? internalSearch
  const setSearchValue = onSearchChange ?? setInternalSearch

  const defaultFilter = (item: SearchableListItem, search: string) =>
    item.primary.toLowerCase().includes(search.toLowerCase()) ||
    (item.secondary?.toLowerCase().includes(search.toLowerCase()) ?? false)

  const filteredItems = searchValue
    ? items.filter((item) =>
        filterFn ? filterFn(item, searchValue) : defaultFilter(item, searchValue)
      )
    : items

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative mt-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <div className="mt-2 max-h-48 overflow-y-auto rounded-md border border-gray-200">
        {isLoading ? (
          <div className="flex items-center justify-center p-3">
            <Spinner size="sm" />
            <span className="ml-2 text-sm text-gray-500">Cargando...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-3 text-center text-sm text-gray-500">{emptyMessage}</div>
        ) : (
          filteredItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={cn(
                'flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50',
                selectedId === item.id && 'bg-blue-50 text-blue-700'
              )}
            >
              <div>
                <div className="font-medium">{item.primary}</div>
                {item.secondary && (
                  <div className="text-gray-500">{item.secondary}</div>
                )}
              </div>
              {selectedId === item.id && (
                <Check className="h-4 w-4 text-blue-600" aria-hidden="true" />
              )}
            </button>
          ))
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
