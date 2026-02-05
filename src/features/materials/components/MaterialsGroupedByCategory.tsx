import { useMemo } from 'react'
import type { Material } from '../types/material.types'
import { MaterialCategory, CATEGORY_LABELS, CATEGORY_ICONS } from '../types/material.types'
import { MaterialCard } from './MaterialCard'

interface MaterialsGroupedByCategoryProps {
  materials: Material[]
  onView?: (material: Material) => void
  onDownload?: (id: number, filename: string) => void
  onDelete?: (materialId: number) => void
  canDelete?: boolean
  isDownloading?: boolean
}

export function MaterialsGroupedByCategory({
  materials,
  onView,
  onDownload,
  onDelete,
  canDelete = false,
  isDownloading = false,
}: MaterialsGroupedByCategoryProps) {
  // Group materials by category
  const groupedMaterials = useMemo(() => {
    const groups: Partial<Record<MaterialCategory, Material[]>> = {}

    materials.forEach((material) => {
      const category = material.category || MaterialCategory.OTROS
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category]!.push(material)
    })

    // Sort each group by uploadedAt (newest first)
    Object.values(groups).forEach((group) => {
      group?.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    })

    return groups
  }, [materials])

  // Get categories that have materials (in a consistent order)
  const categoriesWithMaterials = Object.values(MaterialCategory).filter(
    (category) => groupedMaterials[category] && groupedMaterials[category]!.length > 0
  )

  if (materials.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-500">No materials available yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {categoriesWithMaterials.map((category) => {
        const categoryMaterials = groupedMaterials[category] || []

        return (
          <div key={category} className="space-y-3">
            {/* Category Header */}
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
              <span className="text-2xl">{CATEGORY_ICONS[category]}</span>
              <h3 className="text-lg font-semibold text-gray-900">
                {CATEGORY_LABELS[category]}
              </h3>
              <span className="text-sm text-gray-500">
                ({categoryMaterials.length})
              </span>
            </div>

            {/* Materials Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryMaterials.map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onView={onView}
                  onDownload={onDownload}
                  onDelete={onDelete}
                  canDelete={canDelete}
                  isDownloading={isDownloading}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
