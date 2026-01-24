import { MaterialCategory, CATEGORY_LABELS, CATEGORY_ICONS } from '../types/material.types'

interface CategorySelectorProps {
  value: MaterialCategory
  onChange: (category: MaterialCategory) => void
  disabled?: boolean
}

export function CategorySelector({ value, onChange, disabled = false }: CategorySelectorProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
        Categoría
      </label>
      <select
        id="category"
        value={value}
        onChange={(e) => onChange(e.target.value as MaterialCategory)}
        disabled={disabled}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        {Object.values(MaterialCategory).map((category) => (
          <option key={category} value={category}>
            {CATEGORY_ICONS[category]} {CATEGORY_LABELS[category]}
          </option>
        ))}
      </select>
    </div>
  )
}
