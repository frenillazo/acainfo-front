import { useMemo } from 'react'
import { Folder, FolderOpen } from 'lucide-react'
import type { Material, MaterialFolder } from '../types/material.types'
import { MaterialCard } from './MaterialCard'

interface MaterialsGroupedByFolderProps {
  materials: Material[]
  // Carpetas de la asignatura, ya ordenadas por position (las devuelve así el back)
  folders: MaterialFolder[]
  // Admin: renderizar también carpetas sin materiales (el alumno no las ve)
  showEmptyFolders?: boolean
  onView?: (material: Material) => void
  onDownload?: (id: number, filename: string) => void
  onDelete?: (materialId: number) => void
  canDelete?: boolean
  isDownloading?: boolean
  // ===== Admin mode =====
  isAdminMode?: boolean
  selectedIds?: Set<number>
  onSelectChange?: (id: number, selected: boolean) => void
  onToggleDownloadDisabled?: (id: number, disabled: boolean) => void
  onToggleVisibility?: (id: number, visible: boolean) => void
  onEdit?: (material: Material) => void
  onTranscribe?: (material: Material) => void
}

interface FolderGroup {
  key: string
  name: string
  isRoot: boolean
  materials: Material[]
}

export function MaterialsGroupedByFolder({
  materials,
  folders,
  showEmptyFolders = false,
  onView,
  onDownload,
  onDelete,
  canDelete = false,
  isDownloading = false,
  isAdminMode = false,
  selectedIds,
  onSelectChange,
  onToggleDownloadDisabled,
  onToggleVisibility,
  onEdit,
  onTranscribe,
}: MaterialsGroupedByFolderProps) {
  // Carpetas en su orden + pseudo-grupo "Sin carpeta" al final (solo si tiene materiales)
  const groups = useMemo<FolderGroup[]>(() => {
    const byFolder = new Map<number | null, Material[]>()
    materials.forEach((material) => {
      const key = material.folderId
      const group = byFolder.get(key)
      if (group) group.push(material)
      else byFolder.set(key, [material])
    })
    byFolder.forEach((group) =>
      group.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    )

    const result: FolderGroup[] = folders
      .map((folder) => ({
        key: `folder-${folder.id}`,
        name: folder.name,
        isRoot: false,
        materials: byFolder.get(folder.id) ?? [],
      }))
      .filter((group) => showEmptyFolders || group.materials.length > 0)

    // Materiales cuya carpeta no está en `folders` (carrera borrado/caché) caen a la raíz
    const rootMaterials = materials
      .filter((m) => m.folderId === null || !folders.some((f) => f.id === m.folderId))
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    if (rootMaterials.length > 0) {
      result.push({ key: 'root', name: 'Sin carpeta', isRoot: true, materials: rootMaterials })
    }

    return result
  }, [materials, folders, showEmptyFolders])

  if (groups.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-500">Todavía no hay materiales</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.key} className="space-y-3" data-testid={`group-${group.key}`}>
          {/* Folder Header */}
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            {group.isRoot ? (
              <FolderOpen className="h-5 w-5 text-gray-400" />
            ) : (
              <Folder className="h-5 w-5 text-blue-600" />
            )}
            <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
            <span className="text-sm text-gray-500">({group.materials.length})</span>
          </div>

          {/* Materials Grid */}
          {group.materials.length === 0 ? (
            <p className="text-sm text-gray-400">Carpeta vacía</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.materials.map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onView={onView}
                  onDownload={onDownload}
                  onDelete={onDelete}
                  canDelete={canDelete}
                  isDownloading={isDownloading}
                  isAdminMode={isAdminMode}
                  selected={selectedIds?.has(material.id) ?? false}
                  onSelectChange={onSelectChange}
                  onToggleDownloadDisabled={onToggleDownloadDisabled}
                  onToggleVisibility={onToggleVisibility}
                  onEdit={onEdit}
                  onTranscribe={onTranscribe}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
