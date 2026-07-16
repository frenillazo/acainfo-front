import { useMemo, useState } from 'react'
import { ChevronDown, Folder, FolderOpen } from 'lucide-react'
import type { Material, MaterialFolder } from '../types/material.types'
import { cn } from '@/shared/utils/cn'
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

  // Plegadas por clave. Abiertas por defecto: quien entra a una asignatura suele
  // venir a por lo último, y plegar es la excepción (buscar en carpetas viejas).
  const [collapsedKeys, setCollapsedKeys] = useState<Set<string>>(new Set())

  const toggleFolder = (key: string) => {
    setCollapsedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  if (groups.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-500">Todavía no hay materiales</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => {
        const isCollapsed = collapsedKeys.has(group.key)
        const contentId = `materials-${group.key}`
        return (
          <div key={group.key} className="space-y-3" data-testid={`group-${group.key}`}>
            {/* Folder Header: patrón de acordeón (botón DENTRO del heading) */}
            <h3 className="border-b border-gray-200 pb-2">
              <button
                type="button"
                onClick={() => toggleFolder(group.key)}
                aria-expanded={!isCollapsed}
                aria-controls={contentId}
                className="flex w-full items-center gap-2 rounded-sm text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <ChevronDown
                  className={cn(
                    'h-4 w-4 flex-shrink-0 text-gray-500 transition-transform',
                    isCollapsed && '-rotate-90'
                  )}
                  aria-hidden="true"
                />
                {group.isRoot ? (
                  <FolderOpen className="h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
                ) : (
                  <Folder className="h-5 w-5 flex-shrink-0 text-blue-600" aria-hidden="true" />
                )}
                <span className="text-lg font-semibold text-gray-900">{group.name}</span>
                <span className="text-sm font-normal text-gray-500">({group.materials.length})</span>
              </button>
            </h3>

            {/* Materials Grid */}
            <div id={contentId} hidden={isCollapsed}>
              {group.materials.length === 0 ? (
                <p className="text-sm text-gray-500">Carpeta vacía</p>
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
          </div>
        )
      })}
    </div>
  )
}
